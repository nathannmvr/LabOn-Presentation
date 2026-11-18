import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

// Captura somente a interface local. Todas as chamadas de API são simuladas.
const root = path.resolve(process.env.LAB_SOLOS_ROOT ?? '../lab-solos')
const revision = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0
const require = createRequire(path.join(root, 'frontend/package.json'))
const { chromium, expect } = require('@playwright/test')
const baseURL = process.env.LABON_URL ?? 'http://127.0.0.1:4173'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(baseURL).hostname), 'Capturar somente ambiente local')

const output = path.resolve('public/screenshots/2026-11-18')
await mkdir(output, { recursive: true })
const now = '2026-11-17T15:00:00Z'
const password = 'Senha Sintetica Demonstracao 2026!'
const mentor = {
  id: 110, nomeCompleto: 'Marina Mentora · demonstração', email: 'mentora@example.invalid',
  nivelUsuario: 'Mentor', tipoUsuario: 'Academico', status: 'Habilitado',
  telefone: null, dataIngresso: '2026-11-17', cidade: 'Belo Jardim',
  instituicao: 'Instituição demonstrativa', curso: 'Química', responsavel: null,
}
const admin = {
  id: 101, nomeCompleto: 'Ana Gestão · demonstração', email: 'gestao@example.invalid',
  nivelUsuario: 'Administrador', tipoUsuario: 'Comum', status: 'Habilitado',
  telefone: null, dataIngresso: '2026-11-17', cidade: 'Belo Jardim',
  instituicao: 'Instituição demonstrativa', curso: null, responsavel: null,
}
const products = [
  {
    id: 901, catmat: 'DEMO-901', nomeProduto: 'Ácido cítrico', tipoProduto: 'Quimico',
    fornecedor: 'Reagentes demonstrativos', grupo: 'Ácidos orgânicos', formulaQuimica: 'C6H8O7', pesoMolecular: 192.124,
    quantidade: 4, quantidadeMinima: 10, unidadeMedida: 'g', localizacaoProduto: 'Armário A · prateleira 2',
    dataFabricacao: '2026-09-17', dataValidade: '2027-09-17', ultimaModificacao: now,
    status: 'Disponível', loteId: 901, lote: 'AC-2026-01', material: null, formato: null,
    capacidade: null, altura: null, graduada: null, densidade: 1.665, grauPureza: 'P.A.',
    estadoFisico: 'Sólido', cor: 'Branco', odor: 'Inodoro', emprestimo: null,
  },
  {
    id: 902, catmat: 'DEMO-902', nomeProduto: 'Ácido clorídrico diluído', tipoProduto: 'Quimico',
    fornecedor: 'Soluções demonstrativas', grupo: 'Ácidos inorgânicos', formulaQuimica: 'HCl', pesoMolecular: 36.46,
    quantidade: 8, quantidadeMinima: 2, unidadeMedida: 'mL', localizacaoProduto: 'Armário B · prateleira 1',
    dataFabricacao: '2026-08-01', dataValidade: '2026-11-10', ultimaModificacao: now,
    status: 'Vencido', loteId: 902, lote: 'HCL-2026-02', material: null, formato: null,
    capacidade: null, altura: null, graduada: null, densidade: 1.02, grauPureza: '10%',
    estadoFisico: 'Líquido', cor: 'Incolor', odor: 'Característico', emprestimo: null,
  },
]
const mentorHistory = {
  produtoId: 901, nomeProduto: products[0].nomeProduto, tipoProduto: 'Quimico', unidadeMedida: 'g',
  historico: [
    { emprestimoId: 701, dataSaida: '2026-10-20T14:00:00-03:00', quantidadeEmprestada: 3, unidadeMedida: 'g', lote: 'AC-2026-01', solicitanteNome: mentor.nomeCompleto },
    { emprestimoId: 690, dataSaida: '2026-09-15T14:00:00-03:00', quantidadeEmprestada: 5, unidadeMedida: 'g', lote: 'AC-2026-01', solicitanteNome: mentor.nomeCompleto },
  ],
  totalEmprestimos: 2,
  totalQuantidadeEmprestada: 8,
}

const actors = new Map([[mentor.id, mentor], [admin.id, admin]])
const tokenFor = user => `eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.${Buffer.from(JSON.stringify({ sub: String(user.id), role: user.nivelUsuario, password_change_required: false })).toString('base64url')}.`
const calls = []
const forbiddenCalls = []
const captures = []
const pageErrors = []
const browser = await chromium.launch({ headless: true })

async function mockApi(route) {
  const request = route.request()
  const endpoint = new URL(request.url()).pathname.split('/api/')[1]?.replace(/\/$/, '') ?? ''
  const method = request.method()
  calls.push({ method, endpoint })
  const reply = (json, status = 200) => route.fulfill({ status, json, headers: { 'access-control-allow-origin': '*' } })
  if (method === 'OPTIONS') return reply({})
  if (endpoint === 'Auth/login' && method === 'POST') {
    const { email } = request.postDataJSON()
    const user = [...actors.values()].find(item => item.email === email)
    assert.ok(user, `Conta sintética inesperada: ${email}`)
    return reply({ token: tokenFor(user), requiresPasswordChange: false })
  }
  if (/^Usuarios\/\d+$/.test(endpoint)) {
    return reply(actors.get(Number(endpoint.split('/')[1])) ?? null)
  }
  if (endpoint === 'Notificacoes/minhas') return reply([])
  if (endpoint === 'Notificacoes/count-nao-lidas') return reply({ count: 0 })
  if (endpoint === 'Produtos/emAlerta') return reply([products[0], products[1]])
  if (endpoint === 'Produtos/901/historico-saida') return reply(mentorHistory)
  if (endpoint === 'Produtos/901') return reply(products[0])
  if (endpoint === 'Produtos') return reply(products)
  if (endpoint === 'System/quantities') {
    return reply({ produtos: { Vidraria: 0, Quimico: 2, Outro: 0, Total: 2 }, usuarios: { Mentor: 1, Mentorado: 0 } })
  }
  forbiddenCalls.push({ method, endpoint })
  return reply([])
}

async function newActor(user) {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 1000 },
    locale: 'pt-BR', timezoneId: 'America/Sao_Paulo', reducedMotion: 'reduce', colorScheme: 'light',
  })
  await context.addInitScript(() => localStorage.setItem('labon.theme.v1', 'light'))
  await context.route('**/api/**', mockApi)
  const page = await context.newPage()
  await page.clock.setFixedTime(new Date(now))
  page.on('pageerror', error => pageErrors.push(error.message))
  await page.goto(baseURL)
  assert.equal(await page.locator('script[src*="/assets/index-"]').count(), 1, 'Use a build de produção local')
  await page.locator('input[name="email"]').fill(user.email)
  await page.locator('input[name="password"]').fill(password)
  await page.getByRole('button', { name: 'Submeter Login' }).click()
  await expect(page).toHaveURL(new RegExp(`/${user.nivelUsuario === 'Administrador' ? 'admin' : 'mentor'}/?$`))
  return { context, page }
}

async function snap(page, filename, actor, step) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)
  const destination = path.join(output, `${filename}.png`)
  await page.screenshot({ path: destination, animations: 'disabled' })
  captures.push({
    arquivo: `${filename}.png`, etapa: step, papel: actor,
    rota: new URL(page.url()).pathname + new URL(page.url()).search,
    sha256: createHash('sha256').update(await readFile(destination)).digest('hex'),
  })
}

try {
  const mentorSession = await newActor(mentor)
  const mentorPage = mentorSession.page
  await mentorPage.goto(`${baseURL}/mentor/search-material`)
  await expect(mentorPage.getByRole('heading', { name: 'Pesquisa - Mentor' })).toBeVisible()
  const typeFilter = mentorPage.getByRole('combobox').first()
  await typeFilter.click()
  await mentorPage.getByRole('option', { name: 'Químicos', exact: true }).click()
  await mentorPage.getByRole('textbox', { name: 'Pesquisar' }).fill(products[0].nomeProduto)
  await expect(mentorPage.getByText(products[0].nomeProduto, { exact: true })).toBeVisible()
  await expect(mentorPage.getByText(products[1].nomeProduto, { exact: true })).toHaveCount(0)
  await snap(mentorPage, 'consulta-01-catalogo', 'Mentor', 'Filtrar o catálogo por tipo e localizar Ácido cítrico')

  await mentorPage.getByText(products[0].nomeProduto, { exact: true }).first().click()
  await expect(mentorPage).toHaveURL(/\/mentor\/verification\?id=901$/)
  await expect(mentorPage.getByRole('heading', { name: 'Informações do Produto' })).toBeVisible()
  await expect(mentorPage.getByRole('heading', { name: 'Verificação - Mentor' })).toBeVisible()
  await expect(mentorPage.getByText('192,124', { exact: true })).toBeVisible()
  await snap(mentorPage, 'consulta-02-detalhe', 'Mentor', 'Consultar as informações disponíveis ao perfil')

  await mentorPage.getByRole('heading', { name: 'Histórico de Movimentações', exact: true }).scrollIntoViewIfNeeded()
  await expect(mentorPage.getByText(mentor.nomeCompleto, { exact: true }).last()).toBeVisible()
  await snap(mentorPage, 'consulta-03-historico', 'Mentor', 'Consultar movimentações incluídas no escopo do perfil')
  await mentorSession.context.close()

  const adminSession = await newActor(admin)
  const adminPage = adminSession.page
  await adminPage.goto(`${baseURL}/admin/follow-up`)
  await expect(adminPage.getByRole('heading', { name: 'Acompanhamento', exact: true })).toBeVisible()
  await expect(adminPage.getByText(products[0].nomeProduto, { exact: true })).toBeVisible()
  await expect(adminPage.getByText(products[1].nomeProduto, { exact: true })).toBeVisible()
  await snap(adminPage, 'consulta-04-alertas', 'Administrador', 'Acompanhar um alerta de estoque e um de validade')

  assert.deepEqual(pageErrors, [])
  assert.deepEqual(forbiddenCalls, [])
  const assets = await adminPage.locator('script[src*="/assets/"], link[rel="stylesheet"]').evaluateAll(elements => elements.map(element => element.getAttribute('src') ?? element.getAttribute('href')))
  const manifest = {
    data: '2026-11-17',
    interface: `lab-solos ${revision}${dirty ? ' + alterações locais não commitadas' : ''}`,
    modoInterface: 'Build local de produção servida por vite preview; chamadas de API simuladas em memória',
    arquivosInterface: assets,
    ambiente: baseURL,
    natureza: 'Interface real do frontend no worktree atual, dados sintéticos e API simulada; não comprova persistência no backend ou operação em produção.',
    capturas: captures,
    chamadas: calls,
    chamadasNaoPrevistas: forbiddenCalls,
    errosDePagina: pageErrors,
    resultadoSimulado: {
      pesquisa: { papel: 'Mentor', material: products[0].nomeProduto, filtro: 'Químicos' },
      detalhe: { produtoId: 901, totalEmprestimos: mentorHistory.totalEmprestimos, totalQuantidadeEmprestada: mentorHistory.totalQuantidadeEmprestada, unidade: mentorHistory.unidadeMedida },
      alertas: { papel: 'Administrador', estoqueAbaixoDoMinimo: products[0].quantidade < products[0].quantidadeMinima, validadeVencida: products[1].status === 'Vencido' },
    },
  }
  await writeFile(path.join(output, 'capturas.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  await writeFile(path.join(output, 'README.md'), `# Capturas do fluxo 4 — Consulta e acompanhamento\n\nPreparadas em 17/11/2026 para a apresentação da semana de 12 a 18/11/2026.\n\n## Procedência\n\nAs imagens vieram de interações Playwright com a interface real compilada do frontend local em \`${baseURL}\`. A revisão base é \`${revision}\`; ${dirty ? 'o worktree também tinha alterações locais não commitadas.' : 'o worktree estava limpo.'} As chamadas da API foram respondidas por um cenário sintético em memória. Nomes, contas, estoque, movimentações e alertas são demonstrativos. Nenhum dado de produção foi acessado ou alterado.\n\nO manifesto [capturas.json](capturas.json) contém os papéis, etapas, rotas, hashes, chamadas observadas e limitações da evidência.\n\n## Arquivos\n\n- \`consulta-01-catalogo.png\`: Mentor filtra o catálogo por tipo e localiza o material.\n- \`consulta-02-detalhe.png\`: informações disponíveis ao perfil de Mentor.\n- \`consulta-03-historico.png\`: histórico de movimentações retornado ao perfil.\n- \`consulta-04-alertas.png\`: Administrador acompanha alertas simulados de estoque e validade.\n- \`fluxo-consulta.gif\`: sequência animada desses quatro quadros; não é vídeo contínuo.\n`)
  console.log(JSON.stringify({ capturas: captures.length, chamadasNaoPrevistas: forbiddenCalls.length, errosDePagina: pageErrors.length, worktreeDirty: dirty }))
  await adminSession.context.close()
} catch (error) {
  console.error(error)
  throw error
} finally {
  await browser.close()
}
