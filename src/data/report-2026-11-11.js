import { Boxes, FilePlus2, PackageCheck, Pencil, Search, ShieldCheck } from 'lucide-react'

const assets = '/screenshots/2026-11-11'
const validation = '/reports/2026-11-11/validacao.md'
const flowGuide = '/reports/2026-11-11/fluxo-materiais.md'
const repository = 'https://github.com/ifpebj-ti/lab-solos'
const source = { href: validation, label: 'Consultar fontes, resultados e limites da entrega' }
const flowSource = { href: flowGuide, label: 'Consultar o roteiro e as evidências do fluxo 3' }
const caption = 'Interface real local · API simulada · dados sintéticos · sem alterações em produção.'
const screenshot = (filename, alt) => ({ src: `${assets}/${filename}.png`, alt, label: alt })
const material = (id, step, title, description, points, image, icon) => ({
  id, section: `Fluxo 3 · ${step}`, title, description, points, image, icon,
  accent: 'mint', caption, source: flowSource,
})

const slides = [
  {
    id: 'seguranca-main', section: 'Entrega da semana', icon: ShieldCheck, accent: 'mint',
    title: 'Segurança conferida na main',
    description: 'As correções chegaram à versão estável. A nova análise confirmou o resultado no código integrado.',
    points: ['31 achados de CodeQL corrigidos', '7 alertas de dependências resolvidos', 'Standard findings: duas notas Excellent'],
    metric: { before: '31', after: '0', label: 'achados abertos de code scanning' },
    evidence: {
      badge: 'Análise da main · 10/11/2026', headline: '0', subheadline: 'alertas abertos nas verificações apresentadas',
      href: `${repository}/actions/runs/42886365064`,
      items: [
        { label: 'CodeQL · C#', value: '0 achados' },
        { label: 'CodeQL · JavaScript/TypeScript', value: '0 achados' },
        { label: 'Dependabot', value: '0 alertas' },
        { label: 'Standard findings', value: '0 achados' },
      ],
      footer: 'As 2 sugestões de AI findings pertencem a uma lista separada e continuam pendentes.',
    },
    caption: 'Resultado do commit 09d9b41. Nenhuma regra foi desativada ou alerta dispensado.', source,
  },
  material('materiais-visao', 'jornada completa', 'Materiais e estoque',
    'O terceiro fluxo do mapa funcional acompanha o cadastro e a edição de um material pelo Administrador.',
    ['Acesso e cadastro foram apresentados na semana anterior', 'Empréstimo e devolução também já foram demonstrados', 'Agora: cadastrar, consultar, editar e conferir o saldo'],
    {
      src: `${assets}/fluxo-materiais.gif`, poster: `${assets}/materiais-01-tipo.png`, animated: true,
      alt: 'Sequência do cadastro e da edição de uma vidraria no LabOn', label: 'Fluxo 3 — cadastro e manutenção de material',
    }, Boxes),
  material('materiais-tipo', 'passo 1 de 6', 'Escolher o tipo de material',
    'Em Produtos > Adicionar, a administração escolhe Químicos, Vidrarias ou Outros antes de preencher o cadastro.',
    ['O caso demonstrado usa uma vidraria de 250 mL', 'Cada tipo possui campos próprios', 'Cadastrar e editar exigem perfil Administrador'],
    screenshot('materiais-01-tipo', 'Adicionar Bens com a aba Vidrarias selecionada'), FilePlus2),
  material('materiais-dados', 'passo 2 de 6', 'Revisar os dados antes de adicionar',
    'O exemplo registra um béquer de vidro com 10 unidades, quantidade mínima 2 e localização informada.',
    ['Nome e capacidade identificam o material', 'Saldo inicial e mínimo são dados distintos', 'Fornecedor e localização ajudam a organizar o estoque'],
    screenshot('materiais-02-dados', 'Cadastro da vidraria preenchido com dados de demonstração'), FilePlus2),
  material('materiais-catalogo', 'passo 3 de 6', 'Confirmar o cadastro no catálogo',
    'Depois do envio, a administração consulta Meus Produtos e pesquisa o material recém-cadastrado.',
    ['A confirmação do formulário é seguida de uma consulta', 'A linha permite conferir o nome e a quantidade', 'O exemplo inicia com 10 unidades disponíveis'],
    screenshot('materiais-03-catalogo', 'Material cadastrado aparece na pesquisa com saldo inicial de 10 unidades'), Search),
  material('materiais-detalhe', 'passo 4 de 6', 'Consultar antes de editar',
    'A linha do catálogo abre a verificação do material. O Administrador confere os dados e usa Editar Produto.',
    ['Identificar o material correto antes da alteração', 'Consultar fornecedor, localização e características', 'Editar somente os dados necessários'],
    screenshot('materiais-04-detalhe', 'Verificação do material com a ação Editar Produto'), Search),
  material('materiais-edicao', 'passo 5 de 6', 'Salvar a alteração autorizada',
    'Na demonstração, a administração ajusta o saldo para 12 unidades, o mínimo para 3 e a localização do material.',
    ['O formulário mostra os valores para revisão', 'Salvar envia as mudanças do material existente', 'A alteração não representa um empréstimo ou transferência InterLab'],
    screenshot('materiais-05-edicao', 'Modal Editar Produto com os novos dados antes do salvamento'), Pencil),
  material('materiais-confirmacao', 'passo 6 de 6', 'Conferir o resultado após salvar',
    'Uma nova consulta confirma o saldo de 12 unidades. O material permanece disponível no catálogo para as próximas operações.',
    ['Conferência após o salvamento e recarregamento', 'Jornada demonstrada com dados sintéticos', 'Terceiro dos seis fluxos principais apresentado'],
    screenshot('materiais-06-confirmacao', 'Catálogo recarregado confirma o saldo atualizado de 12 unidades'), PackageCheck),
]

export const report20261111 = {
  id: '2026-11-11', sequence: 10,
  period: '05 a 11 de novembro de 2026', selectorPeriod: '05/11 a 11/11/2026',
  title: 'Segurança\nvalidada',
  summary: 'Correções integradas à main e demonstração do fluxo 3: Materiais e estoque. Preparado em 10/11 para apresentação em 11/11, sem antecipar resultados de amanhã.',
  stats: [
    { label: 'CodeQL', value: '31 achados corrigidos', detail: 'nova análise da main sem achados' },
    { label: 'Dependabot', value: '7 alertas resolvidos', detail: 'painel atualizado após o merge' },
    { label: 'Demonstração', value: '1 fluxo apresentado', detail: 'materiais e estoque · fluxo 3 de 6' },
  ],
  documents: [validation, flowGuide],
  slides: slides.map((slide, index) => ({ ...slide, index: String(index + 1).padStart(2, '0') })),
  closing: {
    title: 'Três de seis fluxos',
    text: 'Acesso, empréstimo e materiais. Restam consulta e acompanhamento, equipe e turma, e conta e credenciais.',
  },
}
