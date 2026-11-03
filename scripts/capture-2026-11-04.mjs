import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Demonstra a interface atual. Todas as respostas de API são simuladas.
// Nenhuma conta, estoque ou empréstimo real é criado ou alterado.
const root = path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos')
const revision = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const require = createRequire(path.join(root, 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const baseURL = process.env.LABON_URL ?? 'http://127.0.0.1:4173'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(baseURL).hostname), 'Somente ambiente local')
const output = path.resolve('public/screenshots/2026-11-04')
await mkdir(output, { recursive: true })
const now = '2026-11-03T14:00:00Z'
const password = 'Senha Sintetica Demonstracao 2026!'
const person = (id, nomeCompleto, nivelUsuario, email) => ({
  id, nomeCompleto, nivelUsuario, email, telefone: null,
  dataIngresso: '2026-11-03', status: 'Habilitado',
  tipoUsuario: nivelUsuario === 'Administrador' ? 'Comum' : 'Academico',
  cidade: 'Belo Jardim', curso: 'Engenharia de Software', instituicao: 'Instituição demonstrativa', responsavel: null,
})
const admin = person(101, 'Ana Gestão · demonstração', 'Administrador', 'gestao@example.invalid')
const mentor = person(110, 'Marina Mentora · demonstração', 'Mentor', 'mentora@example.invalid')
let student = person(120, 'Lucas Discente · demonstração', 'Mentorado', 'discente@example.invalid')
student.responsavel = { ...mentor }
const product = {
  id: 901, catmat: 'DEMO-901', nomeProduto: 'Béquer de vidro 250 mL', tipoProduto: 'Vidraria',
  fornecedor: 'Fornecedor demonstrativo', quantidade: 10, quantidadeMinima: 2,
  unidadeMedida: 'Unidade', localizacaoProduto: 'Armário A · prateleira 2',
  dataFabricacao: null, dataValidade: null, ultimaModificacao: now, status: 'Disponivel',
  material: 'Vidro borossilicato', formato: 'Cilíndrico', capacidade: 250, graduacao: '50 mL', altura: 10, lote: null,
}
let registered = false
let loan = null
const requests = []
const captures = []
let interfaceAssets = []
const unexpected = new Set()
const token = user => `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${Buffer.from(JSON.stringify({ sub: String(user.id), role: user.nivelUsuario, password_change_required: false })).toString('base64url')}.`
const loanView = () => loan && ({ ...loan, produtos: [{ emprestimoId: loan.id, produto: { ...product }, quantidade: 2 }] })
async function api(route) {
  const request = route.request()
  const endpoint = new URL(request.url()).pathname.split('/api/')[1]?.replace(/\/$/, '') ?? ''
  const method = request.method()
  requests.push({ method, endpoint })
  const reply = (json, status = 200) => route.fulfill({ status, json, headers: { 'access-control-allow-origin': '*' } })
  if (method === 'OPTIONS') return reply({})
  if (endpoint === 'Auth/login') {
    const { email } = request.postDataJSON()
    const user = [admin, mentor, student].find(item => item.email === email)
    if (!user || user.status !== 'Habilitado') return reply({ message: 'E-mail ou senha inválidos.' }, 401)
    return reply({ token: token(user), requiresPasswordChange: false })
  }
  if (endpoint === 'Usuarios' && method === 'POST') {
    const data = request.postDataJSON()
    assert.equal(data.nivelUsuario, 'Mentorado')
    assert.equal(data.responsavelEmail, mentor.email)
    student = { ...student, nomeCompleto: data.nomeCompleto, status: 'Pendente' }
    registered = true
    return reply(student, 201)
  }
  if (endpoint === 'Usuarios/dependentes/120/aprovar' && method === 'PATCH') {
    assert.equal(student.status, 'Pendente')
    student.status = 'Habilitado'
    return reply(student)
  }
  if (/^Usuarios\/\d+\/dependentes\/aprovacao$/.test(endpoint) || endpoint === 'Usuarios/aprovacao') return reply(registered && student.status === 'Pendente' ? [student] : [])
  if (/^Usuarios\/\d+\/dependentes\/emprestimos$/.test(endpoint)) return reply([])
  if (/^Usuarios\/\d+\/dependentes$/.test(endpoint)) return reply(registered && student.status === 'Habilitado' ? [student] : [])
  if (/^Usuarios\/\d+$/.test(endpoint)) return reply([admin, mentor, student].find(user => user.id === Number(endpoint.split('/')[1])))
  if (endpoint === 'Usuarios') return reply([admin, mentor, ...(registered ? [student] : [])])
  if (endpoint === 'Produtos') return reply([product])
  if (endpoint === 'Produtos/901') return reply(product)
  if (endpoint.startsWith('Produtos/901/')) return reply([])
  if (endpoint === 'Emprestimos' && method === 'POST') {
    const data = request.postDataJSON()
    assert.deepEqual(data.produtos, [{ produtoId: 901, quantidade: 2 }])
    assert.equal(data.diasParaDevolucao, 5)
    assert.equal(data.solicitanteId, undefined, 'Interface atual não transmite o mentorado selecionado')
    loan = { id: 701, status: 'Pendente', dataRealizacao: now, dataPrevistaDevolucao: '2026-11-08T14:00:00Z', dataDevolucao: null, dataAprovacao: null, solicitante: mentor, aprovador: null }
    return reply(loanView(), 201)
  }
  if (endpoint === 'Emprestimos/aprovar/701' && method === 'PATCH') {
    assert.equal(loan.status, 'Pendente')
    assert.equal(product.quantidade, 10)
    loan.status = 'Aprovado'
    loan.dataAprovacao = now
    loan.aprovador = admin
    product.quantidade -= 2
    return reply(loanView())
  }
  if (endpoint === 'Emprestimos/devolver/701' && method === 'PATCH') {
    assert.equal(loan.status, 'Aprovado')
    assert.equal(loan.dataDevolucao, null)
    loan.dataDevolucao = now
    product.quantidade += 2
    return reply(loanView())
  }
  if (endpoint === 'Emprestimos/701') return reply(loanView())
  if (endpoint === 'Emprestimos' || /^Emprestimos\/usuario\/\d+$/.test(endpoint)) return reply(loan ? [loanView()] : [])
  if (endpoint === 'System/quantities') return reply({ produtos: { Vidraria: 1, Quimico: 0, Outro: 0 }, usuarios: { Mentor: 1, Mentorado: registered ? 1 : 0 } })
  if (/notif|alert|Lotes/i.test(endpoint)) return reply([])
  unexpected.add(`${method} ${endpoint}`)
  return reply([])
}
const browser = await chromium.launch({ headless: true })
async function newActor() {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' })
  await context.route('**/api/**', api)
  const page = await context.newPage()
  await page.clock.setFixedTime(new Date(now))
  return page
}
async function snap(page, name, actor, step) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  const filename = `${name}.png`
  const destination = path.join(output, filename)
  await page.screenshot({ path: destination, animations: 'disabled' })
  captures.push({ arquivo: filename, papel: actor, etapa: step, rota: new URL(page.url()).pathname + new URL(page.url()).search, sha256: createHash('sha256').update(await readFile(destination)).digest('hex'), origem: 'Captura Playwright da interface local atual; respostas de API simuladas; dados sintéticos.' })
  console.log(filename)
}
async function login(page, user) {
  await page.goto(baseURL)
  await page.locator('input[name="email"]').fill(user.email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Submeter Login' }).click()
  await expect(page).toHaveURL(new RegExp(`/${user.nivelUsuario === 'Administrador' ? 'admin' : user.nivelUsuario === 'Mentor' ? 'mentor' : 'mentee'}/?$`))
}
try {
  const applicant = await newActor()
  await applicant.goto(baseURL)
  assert.equal(await applicant.locator('script[src*="/assets/index-"]').count(), 1, 'Capturar somente a build de produção, não o servidor de desenvolvimento')
  interfaceAssets = await applicant.locator('script[src*="/assets/"], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')))
  const legacyImage = await applicant.request.get(`${baseURL}/public/images/laboratory.png`)
  assert.ok(!legacyImage.headers()['content-type']?.startsWith('image/'), 'A captura não deve reintroduzir a imagem legada que está indisponível nesse caminho na versão publicada')
  await snap(applicant, 'acesso-01-login', 'Visitante', 'Abrir a tela de entrada e escolher criar conta')
  await applicant.getByRole('link', { name: 'Crie a sua agora.', exact: true }).click()
  await expect(applicant).toHaveURL(/create-account$/)
  await applicant.getByRole('combobox', { name: 'Tipo de usuário' }).click()
  await applicant.getByRole('option', { name: 'Mentorado', exact: true }).click()
  const fields = { nome: student.nomeCompleto, email: student.email, senha: password, repeat: password, instituicao: student.instituicao, curso: student.curso, cidade: student.cidade, telefone: '81900000000', emailMentor: mentor.email }
  for (const [name, value] of Object.entries(fields)) await applicant.locator(`input[name="${name}"]`).fill(value)
  await applicant.getByRole('checkbox').check()
  await snap(applicant, 'acesso-02-cadastro', 'Mentorado solicitante', 'Preencher perfil, dados acadêmicos e e-mail do mentor responsável')
  await applicant.getByRole('button', { name: 'Criar Conta', exact: true }).click()
  await expect(applicant).toHaveURL(`${baseURL}/`)
  await expect(applicant.getByText('Cadastro submetido à aprovação!', { exact: true })).toBeVisible()
  await snap(applicant, 'acesso-03-pendente', 'Mentorado solicitante', 'Cadastro enviado; aguardar decisão do responsável')
  const responsible = await newActor()
  await login(responsible, mentor)
  await responsible.goto(`${baseURL}/mentor/users-request`)
  await expect(responsible.getByRole('button', { name: `Aprovar ${student.nomeCompleto}` })).toBeVisible()
  await snap(responsible, 'acesso-04-analisar', 'Mentor responsável', 'Consultar Solicitações de Cadastro e conferir a pessoa vinculada')
  await responsible.getByRole('button', { name: `Aprovar ${student.nomeCompleto}` }).click()
  await expect(responsible.getByText('Solicitação aceita', { exact: true })).toBeVisible()
  assert.equal(student.status, 'Habilitado')
  await snap(responsible, 'acesso-05-aprovado', 'Mentor responsável', 'Aprovar o cadastro e retirar a solicitação da fila pendente')
  await login(applicant, student)
  await expect(applicant.getByRole('heading').first()).toBeVisible()
  await snap(applicant, 'acesso-06-habilitado', 'Mentorado habilitado', 'Entrar com a conta aprovada e acessar a área do mentorado')

  await responsible.goto(`${baseURL}/mentor/search-material`)
  await expect(responsible.getByText(product.nomeProduto, { exact: true }).first()).toBeVisible()
  await snap(responsible, 'emprestimo-01-catalogo', 'Mentor', 'Consultar material disponível: 10 unidades')
  await responsible.goto(`${baseURL}/mentor/loan/creation`)
  await expect(responsible.getByRole('heading', { name: 'Criação de Empréstimo' })).toBeVisible()
  const choose = async (index, name) => {
    await responsible.getByRole('combobox').nth(index).click()
    await responsible.getByRole('option', { name, exact: true }).click()
  }
  await choose(0, student.nomeCompleto)
  await choose(1, 'Vidraria')
  await choose(2, product.nomeProduto)
  await responsible.getByLabel('Quantidade', { exact: true }).fill('2')
  await choose(3, 'Unidade')
  await snap(responsible, 'emprestimo-02-selecao', 'Mentor', 'Selecionar utilizador, grupo, item, quantidade e unidade')
  await responsible.getByRole('button', { name: 'Adicionar', exact: true }).click()
  await responsible.getByRole('button', { name: 'Solicitar Empréstimo', exact: true }).scrollIntoViewIfNeeded()
  await snap(responsible, 'emprestimo-03-revisao', 'Mentor', 'Conferir produtos selecionados e solicitar')
  await responsible.getByRole('button', { name: 'Solicitar Empréstimo', exact: true }).click()
  await expect(responsible.getByText('Solicitação de empréstimo bem sucessida!', { exact: true })).toBeVisible()
  assert.equal(loan.status, 'Pendente')
  assert.equal(product.quantidade, 10)
  await snap(responsible, 'emprestimo-04-enviado', 'Mentor', 'Solicitação enviada sem redução do estoque')
  await responsible.goto(`${baseURL}/mentor/history/loan?id=701`)
  await expect(responsible.getByRole('heading', { name: 'Histórico de Empréstimo - Pendente', exact: true })).toBeVisible()
  await expect(responsible.getByRole('heading', { name: 'Histórico de Mentorados', exact: true })).toHaveCount(0)
  await snap(responsible, 'emprestimo-05-pendente', 'Mentor', 'Consultar o detalhe do empréstimo pendente antes da decisão administrativa')
  const manager = await newActor()
  await login(manager, admin)
  await manager.goto(`${baseURL}/admin/loans-request`)
  await expect(manager.getByRole('button', { name: `Aprovar ${mentor.nomeCompleto}` })).toBeVisible()
  await snap(manager, 'emprestimo-06-analisar', 'Administrador', 'Consultar a fila de empréstimos e decidir')
  await manager.getByRole('listitem').filter({ hasText: mentor.email }).getByRole('link').click()
  await expect(manager).toHaveURL(/history\/loan\?id=701$/)
  await snap(manager, 'emprestimo-07-detalhe', 'Administrador', 'Conferir material, quantidade solicitada e solicitante no detalhe')
  await manager.goto(`${baseURL}/admin/loans-request`)
  await manager.getByRole('button', { name: `Aprovar ${mentor.nomeCompleto}` }).click()
  await expect.poll(() => loan.status).toBe('Aprovado')
  assert.equal(product.quantidade, 8)
  await manager.goto(`${baseURL}/admin/all-loans`)
  await expect(manager.getByText('Aprovado', { exact: true }).first()).toBeVisible()
  await snap(manager, 'emprestimo-08-aprovado', 'Administrador', 'Aprovação registrada e baixa de 2 unidades: saldo 8')
  await manager.goto(`${baseURL}/admin/search-material`)
  await expect(manager.getByText(product.nomeProduto, { exact: true }).first()).toBeVisible()
  await snap(manager, 'emprestimo-09-saldo', 'Administrador', 'Conferir o saldo após aprovação: 8 unidades')
  await manager.goto(`${baseURL}/admin/return?id=701`)
  await expect(manager.getByRole('button', { name: 'Registrar Devolução', exact: true })).toBeVisible()
  await snap(manager, 'emprestimo-10-devolucao', 'Administrador', 'Abrir a devolução do empréstimo aprovado')
  await manager.getByRole('button', { name: 'Registrar Devolução', exact: true }).click()
  await expect(manager.getByText('Devolvido', { exact: true })).toBeVisible()
  assert.equal(product.quantidade, 10)
  await snap(manager, 'emprestimo-11-devolvido', 'Administrador', 'Registrar devolução integral e conferir sua confirmação')
  await manager.goto(`${baseURL}/admin/search-material`)
  await expect(manager.getByText(product.nomeProduto, { exact: true }).first()).toBeVisible()
  await snap(manager, 'emprestimo-12-reposto', 'Administrador', 'Conferir recomposição do saldo: 10 unidades')
  await manager.goto(`${baseURL}/admin/history/loan?id=701`)
  await expect(manager.getByText('Empréstimo Devolvido', { exact: true })).toBeVisible()
  await snap(manager, 'emprestimo-13-historico', 'Administrador', 'Consultar histórico final e data de devolução')
  await writeFile(path.join(output, 'capturas.json'), JSON.stringify({ data: '2026-11-03', interface: `lab-solos ${revision}`, modoInterface: 'Build de produção local, servida por vite preview', arquivosInterface: interfaceAssets, ambiente: baseURL, natureza: 'Interface compilada local com API simulada e dados sintéticos. Não é validação real de backend ou produção.', capturas: captures, chamadas: requests, chamadasNaoPrevistas: [...unexpected], resultadoSimulado: { cadastro: student.status, emprestimo: loan.status, devolucaoRegistrada: Boolean(loan.dataDevolucao), saldoInicial: 10, saldoAprovado: 8, saldoFinal: product.quantidade } }, null, 2))
  for (const file of await readdir(output)) {
    if (/^diagnostico-\d+\.png$/.test(file)) await unlink(path.join(output, file))
  }
  console.log(JSON.stringify({ capturas: captures.length, chamadasNaoPrevistas: [...unexpected], saldoFinal: product.quantidade }))
} catch (error) {
  for (const [index, page] of browser.contexts().flatMap(context => context.pages()).entries()) {
    await page.screenshot({ path: path.join(output, `diagnostico-${index}.png`) }).catch(() => {})
    console.error(`Página ${index}: ${page.url()}\n${(await page.locator('body').innerText().catch(() => '')).slice(0, 3500)}`)
  }
  throw error
} finally {
  await browser.close()
}
