import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const appRoot = path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos')
const require = createRequire(path.join(appRoot, 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const ts = require('typescript')
const output = path.resolve('public/screenshots/2026-09-16')
const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173'
await mkdir(output, { recursive: true })
await mkdir('.impeccable', { recursive: true })

// Execute the application's existing synthetic fixtures, without editing its source.
const fixtureSource = await readFile(path.join(appRoot, 'frontend/e2e/responsive-support.ts'), 'utf8')
const fixtureModule = ts.transpileModule(fixtureSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  .replace("import { expect } from '@playwright/test';", `import playwright from ${JSON.stringify(pathToFileURL(require.resolve('@playwright/test')).href)}; const { expect } = playwright;`)
const fixturePath = path.resolve('.impeccable/capture-support.mjs')
await writeFile(fixturePath, fixtureModule)
const { mockResponsiveSession, loanRequestFixtures } = await import(pathToFileURL(fixturePath).href)
await unlink(fixturePath)
const browser = await chromium.launch({ headless: true })
const records = []

async function capture(page, file, description, mode = 'Interface local; sessão e respostas de API sintéticas') {
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: path.join(output, `${file}.png`), animations: 'disabled' })
  records.push({ file: `${file}.png`, url: page.url(), viewport: page.viewportSize(), mode, description })
  console.log(`Captured ${file}`)
}

async function appPage(role, viewport = { width: 1440, height: 900 }) {
  const page = await browser.newPage({ baseURL, viewport, reducedMotion: 'reduce' })
  await mockResponsiveSession(page, role)
  const loans = structuredClone(loanRequestFixtures.slice(0, 2))
  loans[0].solicitante.nomeCompleto = 'Marina — demonstração'
  loans[1].solicitante.nomeCompleto = 'Rafael — demonstração'
  for (const loan of loans) {
    loan.produtos[0].produto.nomeProduto = 'Béquer de vidro · 250 mL'
    loan.produtos[0].produto.tipoProduto = 'Vidraria'
  }
  await page.route('**/api/Emprestimos', route => route.fulfill({ json: loans }))
  await page.route('**/api/Emprestimos/701', route => route.fulfill({ json: loans[0] }))
  page.setDefaultTimeout(30_000)
  return page
}

try {
  if (!process.argv.includes('--remote-only')) {
    const admin = await appPage('Administrador')
    await admin.goto('/admin/profile')
    await expect(admin.getByText('Pessoa Sintética', { exact: true }).first()).toBeVisible()
    await expect(admin.getByText(/Verificar empréstimos vencidos/i).first()).toBeVisible()
    await admin.getByRole('button', { name: /Pessoa Sintética.*sessao@example.invalid/ }).click()
    await expect(admin.getByRole('menuitem', { name: 'Conta' })).toBeVisible()
    await expect(admin.getByRole('menuitem', { name: 'Sair' })).toBeVisible()
    await expect(admin.getByText(/Labon Pro|Comunicação InterLab|Importar planilha/i)).toHaveCount(0)
    await capture(admin, 'conta-menu', 'Conta administrativa e menu abertos, sem importação, InterLab ou Labon Pro.')
    await admin.keyboard.press('Escape')
    await admin.goto('/admin/')
    await expect(admin.locator('a[href="/admin/loans-request"]').first()).toBeVisible()
    await expect(admin.getByRole('alert')).toHaveCount(0)
    await expect(admin.getByText('Carregando dados da home')).toHaveCount(0)
    await capture(admin, 'home-admin', 'Home administrativa com seis atalhos operacionais e consultas carregadas.')
    await admin.goto('/admin/loans-request')
    await admin.locator('a[href="/admin/history/loan?id=701"]').click()
    await admin.reload()
    await expect(admin.getByText('Marina — demonstração', { exact: true }).first()).toBeVisible()
    await expect(admin.getByRole('link', { name: 'Voltar', exact: true })).toHaveAttribute('href', '/admin/all-loans')
    await capture(admin, 'detalhe-apos-recarregar', 'Detalhe aberto por link e recarregado mantendo id=701 e retorno explícito para todos os empréstimos.')
    await admin.getByRole('link', { name: 'Voltar', exact: true }).click()
    await expect(admin).toHaveURL(/\/admin\/all-loans$/)
    await admin.close()

    const mentor = await appPage('Mentor')
    await mentor.goto('/mentor/')
    await expect(mentor.locator('a[href="/mentor/history/class"]').first()).toBeVisible()
    await mentor.locator('a[href="/mentor/search-material"]').last().scrollIntoViewIfNeeded()
    await capture(mentor, 'home-mentor', 'Home do Mentor com atalhos de turma, solicitações, empréstimos e produtos; rolada para mostrar todos os atalhos.')
    await mentor.setViewportSize({ width: 375, height: 812 })
    await expect(mentor.locator('a[href="/mentor/my-class"]').first()).toBeVisible()
    assert.ok(await mentor.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    await mentor.locator('a[href="/mentor/search-material"]').last().scrollIntoViewIfNeeded()
    await capture(mentor, 'home-mentor-mobile', 'Home do Mentor em 375 px, rolada até os atalhos, sem transbordamento horizontal.')
    await mentor.close()
  }

  if (!process.argv.includes('--app-only')) {
    const remote = await browser.newPage({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' })
    remote.setDefaultTimeout(45_000)
    await remote.goto('https://github.com/ifpebj-ti/lab-solos/wiki/Manual-do-Usuario', { waitUntil: 'domcontentloaded' })
    await expect(remote.getByRole('heading', { name: 'Manual de uso do LabOn', exact: true })).toBeVisible()
    await capture(remote, 'manual-wiki', 'Índice do manual publicado no GitHub Wiki, com versão e orientações para os três perfis.', 'Página pública do GitHub Wiki')
    for (const [run, file, conclusion] of [['35008036822', 'qualidade-green', 'Success'], ['35000986662', 'qualidade-red', 'Failure']]) {
      await remote.goto(`https://github.com/ifpebj-ti/lab-solos/actions/runs/${run}`, { waitUntil: 'domcontentloaded' })
      await expect(remote.getByText(conclusion, { exact: true }).first()).toBeVisible()
      await expect(remote.getByText('Quality gate', { exact: true }).first()).toBeVisible()
      await expect(remote.getByRole('link', { name: 'Frontend quality', exact: true })).toBeVisible()
      await capture(remote, file, `Execução ${run} do Container CI com resultado ${conclusion}.`, 'Página pública do GitHub Actions; execução real registrada')
    }
    await remote.close()
  }
  const existing = await readFile(path.join(output, 'capturas.json'), 'utf8').then(JSON.parse).catch(() => ({ records: [] }))
  const merged = [...existing.records.filter(record => !records.some(item => item.file === record.file)), ...records]
  await writeFile(path.join(output, 'capturas.json'), JSON.stringify({ capturedAt: new Date().toISOString(), baseURL, records: merged }, null, 2) + '\n')
} finally {
  await browser.close()
}
