import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Reuse the browser installed by the adjacent LabOn application's E2E suite.
const appRoot = path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos')
const require = createRequire(path.join(appRoot, 'frontend/package.json'))
const { chromium, request, expect } = require('@playwright/test')
const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173'
const apiURL = process.env.E2E_API_URL ?? 'http://127.0.0.1:18080/api'
const output = fileURLToPath(new URL('../public/screenshots/2026-09/', import.meta.url))
const adminEmail = 'synthetic-e2e-admin@example.invalid'
const initialPassword = 'synthetic-e2e-admin-password'
const finalPassword = 'Synthetic E2E Reset Password 2026!'
const records = process.argv.includes('--lists-only')
  ? JSON.parse(await readFile(path.join(output, 'capturas.json'), 'utf8')).records.filter(record => ['recuperacao-senha.png', 'cadastro-usuario.png'].includes(record.file))
  : []
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ baseURL, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
const page = await context.newPage()
page.setDefaultTimeout(30_000)
page.setDefaultNavigationTimeout(90_000)
const api = await request.newContext({ baseURL: apiURL })

async function goto(route) {
  await page.goto(route, { waitUntil: 'domcontentloaded' })
}

async function capture(file, description, mode = 'API real local') {
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(output, file), fullPage: page.viewportSize().width > 640, animations: 'disabled' })
  records.push({ file, route: new URL(page.url()).pathname, viewport: page.viewportSize(), mode, description })
  console.log(`Captured ${file}`)
}

async function login(password) {
  await goto('/')
  await page.locator('input[name="email"]').fill(adminEmail)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Submeter Login' }).click()
}

try {
  if (process.argv.includes('--first-access')) {
    await login(initialPassword)
    await expect(page).toHaveURL(/\/change-password-required$/)
    await expect(page.getByRole('heading', { name: 'Defina uma nova senha' })).toBeVisible()
    const session = await api.post(`${apiURL}/Auth/login`, { data: { email: adminEmail, password: initialPassword } })
    assert.equal(session.status(), 200)
    const { token, requiresPasswordChange } = await session.json()
    assert.equal(requiresPasswordChange, true)
    const restricted = await api.get(`${apiURL}/Usuarios`, { headers: { Authorization: `Bearer ${token}` } })
    assert.equal(restricted.status(), 403)
    await capture('primeiro-acesso.png', 'Login real redireciona para troca obrigatória; API bloqueia consulta de usuários com HTTP 403.')
  } else {
    if (!process.argv.includes('--lists-only')) {
    // Run credential-lifecycle.spec.ts on the fresh isolated stack before this phase.
    await goto('/forgot-your-password')
    await page.getByLabel('Email', { exact: true }).fill(adminEmail)
    const resetResponse = page.waitForResponse(r => r.url().includes('/Email/request-password-reset') && r.request().method() === 'POST')
    await page.getByRole('button', { name: 'Enviar e-mail de recuperação' }).click()
    assert.equal((await resetResponse).status(), 202)
    await expect(page).toHaveURL(/\/reset-password$/)
    await expect(page.getByText('Se a conta estiver apta, enviaremos as instruções.')).toBeVisible()
    await capture('recuperacao-senha.png', 'Solicitação real retorna 202 e mostra confirmação neutra; token recebido no SMTP de teste não aparece no print.')

    await goto('/create-account')
    await page.getByRole('combobox', { name: 'Tipo de usuário' }).click()
    await page.getByRole('option', { name: 'Mentor', exact: true }).click()
    await page.getByLabel('Nome Completo').fill('Marina — demonstração LabOn')
    await page.getByLabel('Email', { exact: true }).fill(`marina-report-${Date.now()}@example.invalid`)
    await page.locator('input[name="senha"]').fill('Synthetic User Data Password 2026!')
    await page.locator('input[name="repeat"]').fill('Synthetic User Data Password 2026!')
    await page.getByLabel('Instituição').fill('IFPE Campus Belo Jardim')
    await page.getByLabel('Curso').fill('  ES  ')
    await page.getByLabel('Cidade').fill('  Belo Jardim  ')
    await page.getByLabel('Telefone').fill('81999999999')
    await page.getByLabel('Email do Mentor Responsável').fill(adminEmail)
    await page.getByRole('checkbox').check()
    await capture('cadastro-usuario.png', 'Cadastro preenchido com cidade real e sigla de curso ES; envio subsequente validado com HTTP 201 e normalização do payload.')
    const createdPromise = page.waitForResponse(r => r.url() === `${apiURL}/Usuarios` && r.request().method() === 'POST')
    await page.getByRole('button', { name: 'Criar Conta' }).click()
    const created = await createdPromise
    assert.equal(created.status(), 201)
    assert.equal(created.request().postDataJSON().cidade, 'Belo Jardim')
    assert.equal(created.request().postDataJSON().curso, 'ES')
    assert.match((await created.json()).dataIngresso, /^\d{4}-\d{2}-\d{2}$/)
    await expect(page).toHaveURL(/\/$/)
    }

    await login(finalPassword)
    await expect(page).toHaveURL(/\/admin\/?$/)
    await goto('/admin/users')
    await expect(page.getByText(/^Marina — demonstração LabOn$/i).first()).toBeVisible()
    await capture('usuarios-desktop.png', 'Lista real de usuários do banco isolado, com data civil e dados cadastrados durante a validação.')
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByRole('list', { name: 'Usuários cadastrados', exact: true })).toBeVisible()
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await page.getByRole('list', { name: 'Usuários cadastrados', exact: true }).scrollIntoViewIfNeeded()
    await capture('usuarios-mobile.png', 'Mesma lista em 375 px, organizada em cartões; página rolada até os registros, sem transbordamento horizontal.')
    await page.setViewportSize({ width: 1280, height: 800 })

    let fail = true
    const failureRoute = async route => {
      if (!fail) return route.continue()
      return route.fulfill({ status: 500, contentType: 'application/problem+json', body: JSON.stringify({ title: 'INTERNAL_SENTINEL', detail: 'INTERNAL_SENTINEL', traceId: 'report-20260909-retry' }) })
    }
    await page.route(`${apiURL}/Usuarios`, failureRoute)
    await goto('/admin/users')
    const feedback = page.getByRole('alert')
    await expect(feedback.getByRole('button', { name: 'Tentar novamente' })).toBeVisible()
    await expect(page.getByText('INTERNAL_SENTINEL')).toHaveCount(0)
    await capture('erro-recuperavel.png', 'HTTP 500 controlado na consulta de usuários; interface real oferece nova tentativa e oculta detalhes internos.', 'Falha HTTP simulada no navegador; sessão real')
    fail = false
    await feedback.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(page.getByText(/^Marina — demonstração LabOn$/i).first()).toBeVisible()
    await expect(page.getByRole('alert')).toHaveCount(0)
    await capture('consulta-recuperada.png', 'Após Tentar novamente, consulta real à API recupera a lista sem novo login.')
    await page.unroute(`${apiURL}/Usuarios`, failureRoute)

    await page.route(`${apiURL}/Usuarios`, route => route.fulfill({ status: 403, contentType: 'application/problem+json', body: JSON.stringify({ title: 'INTERNAL_SENTINEL', detail: 'INTERNAL_SENTINEL' }) }))
    await goto('/admin/users')
    await expect(page.getByRole('alert')).toContainText(/permiss/i)
    await expect(page).toHaveURL(/\/admin\/users$/)
    assert.ok((await context.cookies()).some(cookie => cookie.name === 'doorKey'))
    await capture('acesso-negado.png', 'HTTP 403 controlado mostra falta de permissão e preserva sessão e rota.', 'Falha HTTP simulada no navegador; sessão real')
  }
  await writeFile(path.join(output, process.argv.includes('--first-access') ? 'primeiro-acesso.json' : 'capturas.json'), JSON.stringify({ capturedAt: new Date().toISOString(), baseURL, records }, null, 2) + '\n')
} finally {
  await api.dispose()
  await browser.close()
}
