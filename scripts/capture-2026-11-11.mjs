import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Somente a interface é executada. A API abaixo é um cenário sintético em memória.
const root = path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos')
const revision = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const require = createRequire(path.join(root, 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const baseURL = process.env.LABON_URL ?? 'http://127.0.0.1:4173'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(baseURL).hostname), 'Capturar somente ambiente local')
const output = path.resolve('public/screenshots/2026-11-11')
await mkdir(output, { recursive: true })
const now = '2026-11-10T18:00:00Z'
const admin = {
  id: 101, nomeCompleto: 'Ana Gestão · demonstração', email: 'gestao@example.invalid',
  nivelUsuario: 'Administrador', tipoUsuario: 'Comum', status: 'Habilitado',
  telefone: null, dataIngresso: '2026-11-10', cidade: 'Belo Jardim',
  instituicao: 'Instituição demonstrativa', curso: null, responsavel: null,
}
const token = `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${Buffer.from(JSON.stringify({ sub: '101', role: 'Administrador', password_change_required: false })).toString('base64url')}.`
const captures = []
const calls = []
let product = null
let created = false
let patched = false
const forbiddenCalls = []
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: 'pt-BR', timezoneId: 'America/Sao_Paulo', reducedMotion: 'reduce', colorScheme: 'light' })
await context.addInitScript(() => localStorage.setItem('labon.theme.v1', 'light'))
await context.route('**/api/**', async route => {
  const request = route.request()
  const endpoint = new URL(request.url()).pathname.split('/api/')[1]?.replace(/\/$/, '') ?? ''
  const method = request.method()
  calls.push({ method, endpoint })
  const reply = (json, status = 200) => route.fulfill({ status, json, headers: { 'access-control-allow-origin': '*' } })
  if (method === 'OPTIONS') return reply({})
  if (endpoint === 'Auth/login') return reply({ token, requiresPasswordChange: false })
  if (/^Usuarios\/101$/.test(endpoint)) return reply(admin)
  if (endpoint.toLowerCase() === 'produtos' && method === 'POST') {
    assert.equal(created, false, 'Um único cadastro deve ser enviado')
    const data = request.postDataJSON()
    assert.equal(data.tipo, 'Vidraria')
    assert.equal(data.quantidade, 10)
    assert.equal(data.quantidadeMinima, 2)
    assert.equal(data.capacidade, 250)
    product = { ...data, id: 901, tipoProduto: data.tipo, unidadeMedida: 'Unidade', status: 'Disponivel', loteId: null, lote: null, ultimaModificacao: now, dataFabricacao: null, dataValidade: null }
    created = true
    return reply({ ...product }, 201)
  }
  if (endpoint === 'Produtos/901' && method === 'PATCH') {
    assert.ok(created)
    const operations = request.postDataJSON()
    for (const operation of operations) {
      assert.equal(operation.op, 'replace')
      assert.ok(['/quantidade', '/quantidadeMinima', '/localizacaoProduto'].includes(operation.path))
      product[operation.path.slice(1)] = operation.value
    }
    assert.equal(product.quantidade, 12)
    assert.equal(product.quantidadeMinima, 3)
    assert.equal(product.localizacaoProduto, 'Armário B · prateleira 1')
    patched = true
    return reply({ ...product })
  }
  if (endpoint === 'Produtos/901/historico-saida') return reply({ produtoId: 901, nomeProduto: product.nomeProduto, tipoProduto: 'Vidraria', estoqueAtual: product.quantidade, unidadeMedida: 'Unidade', historico: [], totalEmprestimos: 0, totalQuantidadeEmprestada: 0 })
  if (endpoint === 'Produtos/901') return reply(product)
  if (endpoint === 'Produtos') return reply(product ? [{ ...product }] : [])
  if (endpoint === 'System/quantities') return reply({ produtos: { Vidraria: product ? 1 : 0, Quimico: 0, Outro: 0 }, usuarios: { Mentor: 0, Mentorado: 0 } })
  if (endpoint === 'Notificacoes/count-nao-lidas') return reply({ count: 0 })
  if (endpoint === 'Notificacoes/minhas') return reply([])
  forbiddenCalls.push({ method, endpoint })
  return reply([])
})
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
async function snap(filename, step) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
  const target = path.join(output, `${filename}.png`)
  await page.screenshot({ path: target, animations: 'disabled' })
  captures.push({ arquivo: `${filename}.png`, etapa: step, papel: 'Administrador', rota: new URL(page.url()).pathname + new URL(page.url()).search, sha256: createHash('sha256').update(await readFile(target)).digest('hex') })
}
try {
  await page.goto(baseURL)
  assert.equal(await page.locator('script[src*="/assets/index-"]').count(), 1, 'Exige build de produção')
  const assets = await page.locator('script[src*="/assets/"], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')))
  await page.locator('input[name="email"]').fill(admin.email)
  await page.locator('input[name="password"]').fill('Senha Sintetica Demonstracao 2026!')
  await page.getByRole('button', { name: 'Submeter Login' }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
  await page.goto(`${baseURL}/admin/insert`)
  await page.getByRole('tab', { name: 'Vidrarias', exact: true }).click()
  await snap('materiais-01-tipo', 'Escolher Vidrarias em Produtos > Adicionar')
  for (const [name, value] of Object.entries({ nome: 'Béquer de vidro 250 mL', marca: 'Fornecedor demonstrativo', quantidade: '10', minimo: '2', capacidade: '250', localizacao: 'Armário A · prateleira 2' })) {
    await page.locator(`input[name="${name}"]`).fill(value)
  }
  await page.getByRole('combobox', { name: 'Material', exact: true }).click()
  await page.getByRole('option', { name: 'Vidro Borossilicato', exact: true }).click()
  await snap('materiais-02-dados', 'Revisar os dados de cadastro antes de adicionar')
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click()
  await expect(page.getByText('Produto criado', { exact: true })).toBeVisible()
  assert.ok(created)
  await page.goto(`${baseURL}/admin/search-material`)
  await expect(page.getByText(product.nomeProduto, { exact: true }).first()).toBeVisible()
  await snap('materiais-03-catalogo', 'Confirmar o cadastro na pesquisa: saldo 10 unidades')
  await page.getByText(product.nomeProduto, { exact: true }).first().click()
  await expect(page.getByRole('button', { name: 'Editar Produto', exact: true })).toBeVisible()
  await snap('materiais-04-detalhe', 'Conferir os dados na verificação do material')
  await page.getByRole('button', { name: 'Editar Produto', exact: true }).click()
  await page.getByRole('textbox', { name: 'Localização', exact: true }).fill('Armário B · prateleira 1')
  await page.getByRole('spinbutton', { name: 'Quantidade', exact: true }).fill('12')
  await page.getByRole('spinbutton', { name: 'Quantidade Mínima', exact: true }).fill('3')
  await snap('materiais-05-edicao', 'Revisar os novos valores no modal de edição')
  await page.getByRole('button', { name: 'Salvar Alterações', exact: true }).click()
  await expect(page.getByText('Produto atualizado', { exact: true })).toBeVisible()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  assert.ok(patched)
  await page.goto(`${baseURL}/admin/search-material`)
  await page.reload()
  await expect(page.getByText(product.nomeProduto, { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('listitem').filter({ hasText: product.nomeProduto })).toContainText('12')
  await snap('materiais-06-confirmacao', 'Recarregar a pesquisa e confirmar o saldo simulado de 12 unidades')
  assert.deepEqual(errors, [])
  assert.deepEqual(forbiddenCalls, [])
  await writeFile(path.join(output, 'capturas.json'), JSON.stringify({
    data: '2026-11-10', interface: `lab-solos ${revision}`, modoInterface: 'Build de produção local, servida por vite preview',
    arquivosInterface: assets, ambiente: baseURL, natureza: 'Interface real compilada, API simulada em memória e dados sintéticos. Não comprova persistência do backend nem operação em produção.',
    capturas: captures, chamadas: calls, errosDePagina: errors, chamadasNaoPrevistas: forbiddenCalls,
    resultadoSimulado: { produtoId: product.id, quantidadeInicial: 10, quantidadeFinal: product.quantidade, minimoInicial: 2, minimoFinal: product.quantidadeMinima, localizacaoFinal: product.localizacaoProduto },
  }, null, 2) + '\n')
  console.log(JSON.stringify({ capturas: captures.length, criado: created, editado: patched, quantidadeFinal: product.quantidade }))
} catch (error) {
  await page.screenshot({ path: path.join(output, 'diagnostico.png') }).catch(() => {})
  console.error((await page.locator('body').innerText()).slice(0, 1800))
  throw error
} finally {
  await browser.close()
}
