import { Atom, Boxes, CalendarDays, GlassWater, Search } from 'lucide-react'

const requestsDoc = '/reports/2026-11-18/pedidos-cliente.md'
const flowDoc = '/reports/2026-11-18/fluxo-4-consulta.md'
const flowAssets = '/screenshots/2026-11-18'
const mediaVersion = '?v=fluxo4-20261117'

const requested = (id, title, description, points, icon, visual) => ({
  id,
  section: 'Pedidos do cliente',
  title,
  description,
  points,
  icon,
  accent: 'mint',
  caption: 'Pedido do cliente · permanece em aberto.',
  ...visual,
  source: { href: requestsDoc, label: 'Consultar a lista de pedidos do cliente' },
})

const capturedFlow = (id, title, description, points, icon, image) => ({
  id,
  section: 'Fluxo principal 4 · demonstração',
  title,
  description,
  points,
  icon,
  accent: 'mint',
  caption: 'Interface local · APIs e dados sintéticos; capturas não demonstram operação em produção.',
  image,
  source: { href: flowDoc, label: 'Consultar roteiro e procedência das capturas' },
})

const still = (filename, alt, label) => ({
  src: `${flowAssets}/${filename}.png${mediaVersion}`,
  alt,
  label,
})

const slides = [
  requested(
    'quimicos-campos',
    'Cadastro de químicos',
    'Ajustes solicitados para a fórmula e para os campos de identificação do produto.',
    [
      'Oferecer o subscrito da fórmula como opção escolhida pelo usuário.',
      'Substituir CATMAT por peso molecular.',
      'Renomear Fornecedor para Marca e retirar “Indefinido” do grupo.',
    ],
    Atom,
    {
      table: {
        title: 'Campos solicitados',
        columns: ['Campo', 'Alteração'],
        rows: [
          ['Fórmula química', 'Subscrito opcional'],
          ['CATMAT', 'Peso molecular'],
          ['Fornecedor', 'Marca'],
          ['Grupo', 'Remover “Indefinido”'],
        ],
      },
    },
  ),
  requested(
    'quimicos-datas',
    'Datas de fabricação e validade',
    'Facilitar o preenchimento das datas e tratar produtos cuja validade já passou.',
    [
      'Exibir as datas no padrão dd/mm/aaaa.',
      'Melhorar a seleção do ano e permitir digitar a data.',
      'Permitir registrar validade anterior ao dia atual.',
      'Quando identificar um produto vencido, perguntar se deseja adicioná-lo mesmo assim.',
    ],
    CalendarDays,
    {
      flow: {
        title: 'Confirmação de produto vencido',
        rows: [
          { nodes: [{ title: 'Informar validade passada', detail: 'Data anterior ao dia atual' }] },
          { nodes: [{ title: 'Perguntar se deseja continuar', detail: 'Produto identificado como vencido' }] },
          {
            label: 'Escolha do usuário',
            nodes: [
              { title: 'Adicionar mesmo assim', detail: 'Confirmar inclusão', terminal: true },
              { title: 'Cancelar inclusão', detail: 'Não adicionar o produto', terminal: true },
            ],
          },
        ],
      },
      source: { href: requestsDoc, label: 'Consultar o pedido de confirmação de validade' },
    },
  ),
  requested(
    'vidrarias-campos',
    'Cadastro de vidrarias',
    'Simplificar os campos e usar uma classificação adequada para as vidrarias.',
    [
      'Remover o campo de altura.',
      'Trocar o campo Formato por Categoria.',
    ],
    GlassWater,
    {
      table: {
        title: 'Campos solicitados',
        columns: ['Campo atual', 'Pedido'],
        rows: [
          ['Altura', 'Remover'],
          ['Formato', 'Categoria'],
        ],
      },
    },
  ),
  requested(
    'listagem-alertas',
    'Listagem, alertas e vidrarias',
    'Deixar visíveis os alertas relevantes e apresentar as quantidades e os nomes das vidrarias corretamente.',
    [
      'Indicar alerta quando a quantidade atual ficar abaixo da quantidade mínima.',
      'Exibir na lista de produtos o triângulo com exclamação como indicador de alerta.',
      'Na aba Alertas, mostrar somente validade e estoque abaixo do mínimo.',
      'Em vidrarias, mostrar a unidade correta e concatenar o nome com a capacidade em mL.',
    ],
    Boxes,
    {
      table: {
        title: 'O que deve aparecer',
        columns: ['Área', 'Pedido do cliente'],
        rows: [
          ['Lista de produtos', 'Triângulo com exclamação; alerta para quantidade atual abaixo do mínimo'],
          ['Aba Alertas', 'Somente produtos em alerta por validade ou estoque mínimo'],
          ['Vidrarias', 'Quantidade na unidade; nome da vidraria + capacidade em mL'],
        ],
      },
    },
  ),
  {
    id: 'fluxo-4-consulta',
    section: 'Fluxo principal 4 de 6',
    title: 'Consulta e acompanhamento',
    description: 'Perfis autorizados pesquisam materiais e consultam detalhes; a administração acompanha alertas.',
    points: [
      'Pesquisar materiais no catálogo conforme o perfil.',
      'Conferir disponibilidade, informações e histórico no escopo autorizado.',
      'Acompanhar alertas de validade e quantidade abaixo do mínimo.',
    ],
    icon: Search,
    accent: 'mint',
    flow: {
      title: 'Fluxo 4 · Consulta e acompanhamento',
      rows: [
        { nodes: [{ actor: 'Perfis autorizados', title: 'Pesquisar materiais', detail: 'Localizar o material no catálogo' }] },
        { nodes: [{ actor: 'Perfis autorizados', title: 'Consultar detalhes', detail: 'Conferir informações, disponibilidade e histórico autorizado' }] },
        { nodes: [{ actor: 'Administração', title: 'Acompanhar alertas', detail: 'Validade e quantidade abaixo do mínimo', terminal: true }] },
      ],
    },
    source: { href: flowDoc, label: 'Consultar o roteiro do fluxo 4' },
    caption: 'Mapa funcional apresentado em 04/11/2026 · fluxo 4 de 6.',
  },
  capturedFlow(
    'fluxo4-percurso',
    'Do catálogo aos alertas',
    'A sequência percorre a pesquisa de materiais, a consulta de informações e histórico e o acompanhamento administrativo de alertas.',
    [
      'O Mentor filtra o catálogo e abre um material.',
      'O detalhe e o histórico respeitam o escopo consultado pelo perfil.',
      'A Administração acompanha alertas de validade e estoque.',
    ],
    Search,
    {
      ...still('consulta-01-catalogo', 'Catálogo filtrado pelo Mentor durante a sequência do fluxo', 'Reproduzir a sequência do fluxo 4'),
      src: `${flowAssets}/fluxo-consulta.gif${mediaVersion}`,
      poster: `${flowAssets}/consulta-01-catalogo.png${mediaVersion}`,
      animated: true,
    },
  ),
  capturedFlow(
    'fluxo4-catalogo',
    'Pesquisar materiais no catálogo',
    'O Mentor restringe a busca por tipo e localiza o material que deseja consultar.',
    [
      'Filtrar o catálogo pelo tipo de material.',
      'Pesquisar pelo nome do item.',
      'Abrir o registro correspondente para consultar seus detalhes.',
    ],
    Search,
    still('consulta-01-catalogo', 'Pesquisa de materiais do Mentor filtrada por tipo e nome', 'Catálogo filtrado por nome e tipo'),
  ),
  capturedFlow(
    'fluxo4-detalhes',
    'Consultar informações do material',
    'A tela de verificação apresenta os dados disponíveis para o perfil autenticado.',
    [
      'Conferir identificação, características e situação do material.',
      'Consultar o status atual após localizar o item no catálogo.',
      'Voltar à pesquisa sem alterar os dados.',
    ],
    Atom,
    still('consulta-02-detalhe', 'Verificação do material com informações permitidas ao Mentor', 'Detalhes do material'),
  ),
  capturedFlow(
    'fluxo4-historico',
    'Conferir o histórico autorizado',
    'O histórico reúne as movimentações que a consulta retorna para o perfil.',
    [
      'Conferir datas, identificadores, solicitantes, lotes e quantidades.',
      'Usar os totais e o gráfico como resumo das movimentações retornadas.',
      'O conjunto exibido é sintético e limitado ao cenário de demonstração.',
    ],
    CalendarDays,
    still('consulta-03-historico', 'Histórico de movimentações do material no perfil de Mentor', 'Histórico de movimentações'),
  ),
  capturedFlow(
    'fluxo4-alertas',
    'Acompanhar os alertas operacionais',
    'Na área administrativa, a tela reúne produtos sinalizados para conferência de estoque ou validade.',
    [
      'Consultar os contadores de alertas por tipo.',
      'Conferir quantidade atual, quantidade mínima, validade e status.',
      'A captura mostra um caso sintético de estoque e outro de validade.',
    ],
    Boxes,
    still('consulta-04-alertas', 'Painel administrativo de acompanhamento com alertas sintéticos', 'Administração consulta alertas'),
  ),
]

export const report20261118 = {
  id: '2026-11-18',
  sequence: 11,
  period: '12 a 18 de novembro de 2026',
  selectorPeriod: '12/11 a 18/11/2026',
  title: 'Pedidos do cliente\nCadastro e consulta',
  summary: 'Solicitações para cadastro de produtos, listagem e alertas, com inclusão do fluxo 4 dos seis fluxos principais.',
  stats: [
    { label: 'Cadastro', value: '2 tipos', detail: 'Químicos e vidrarias' },
    { label: 'Listagem', value: 'alertas e unidades', detail: 'Estoque e validade' },
    { label: 'Fluxo principal', value: '4 de 6', detail: 'Consulta e acompanhamento' },
  ],
  documents: [requestsDoc, flowDoc, `${flowAssets}/README.md`],
  slides: slides.map((slide, index) => ({ ...slide, index: String(index + 1).padStart(2, '0') })),
  closing: {
    title: 'Pedidos do cliente',
    text: 'Cadastro de químicos e vidrarias, listagem, alertas e consulta de materiais.',
  },
}
