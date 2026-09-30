import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('../lab-solos')
const require = createRequire(path.join(root, 'frontend/package.json'))
const { chromium } = require('@playwright/test')
const baseURL = process.env.LABON_URL ?? 'http://127.0.0.1:4173'
const output = path.resolve('public/screenshots/2026-09-29')
await mkdir(output, { recursive: true })

const browser = await chromium.launch({ headless: true })
const product = {
  id: 901, nomeProduto: 'Reagente sintético de bancada', tipoProduto: 'Quimico',
  fornecedor: 'Fornecedor sintético', quantidade: 10, quantidadeMinima: 1,
  unidadeMedida: 'ml', localizacaoProduto: 'Armário A', status: 'Disponivel',
  dataFabricacao: null, dataValidade: null,
}

async function session(page, role) {
  const payload = Buffer.from(JSON.stringify({ sub: '4242', role, password_change_required: false })).toString('base64url')
  const domain = new URL(baseURL).hostname
  await page.context().addCookies([
    { name: 'doorKey', value: `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${payload}.`, domain, path: '/' },
    { name: 'rankID', value: '4242', domain, path: '/' },
    { name: 'level', value: role, domain, path: '/' },
  ])
  await page.route('**/api/**', route => route.fulfill({ json: [] }))
  await page.route('**/api/Usuarios/4242', route => route.fulfill({ json: {
    id: 4242, nomeCompleto: 'Pessoa Sintética', email: 'sessao@example.invalid',
    telefone: null, dataIngresso: '2026-09-01', status: 'Habilitado',
    nivelUsuario: role, tipoUsuario: role === 'Administrador' ? 'Comum' : 'Academico',
    cidade: role === 'Administrador' ? undefined : 'Belo Jardim',
    curso: role === 'Administrador' ? undefined : 'ES',
    instituicao: role === 'Administrador' ? undefined : 'IFPE', responsavel: null,
  } }))
  await page.route('**/api/System/quantities', route => route.fulfill({ json: { produtos: { Vidraria: 1, Quimico: 1, Outro: 0 } } }))
}

try {
  const login = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await login.goto(baseURL)
  assert.equal(await login.locator('script[src*="/assets/index-"]').count(), 1, 'Capture the production preview, not the Vite development server')
  await login.getByRole('heading', { name: 'Entrar no LabOn' }).waitFor()
  await login.screenshot({ path: path.join(output, 'login-desktop.png'), animations: 'disabled' })
  await login.close()

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', isMobile: true })
  await mobile.goto(baseURL)
  await mobile.getByRole('heading', { name: 'Entrar no LabOn' }).waitFor()
  await mobile.screenshot({ path: path.join(output, 'login-mobile.png'), animations: 'disabled' })
  await mobile.close()

  const admin = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await session(admin, 'Administrador')
  await admin.goto(`${baseURL}/admin`)
  await admin.getByRole('heading').first().waitFor()
  await admin.screenshot({ path: path.join(output, 'home-admin.png'), animations: 'disabled' })
  await admin.close()

  const mentor = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await session(mentor, 'Mentor')
  await mentor.route('**/api/Produtos', route => route.fulfill({ json: [product] }))
  await mentor.goto(`${baseURL}/mentor/search-material`)
  await mentor.getByText(product.nomeProduto).first().waitFor()
  await mentor.screenshot({ path: path.join(output, 'catalogo-mentor.png'), animations: 'disabled' })
  await mentor.close()
} finally {
  await browser.close()
}
