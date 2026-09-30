import { BookOpenText, FlaskConical, LayoutDashboard, MonitorSmartphone, ScanSearch, ShieldCheck } from 'lucide-react'

const repo = 'https://github.com/ifpebj-ti/lab-solos'
const screenshot = (file, alt, label) => ({
  src: `/screenshots/2026-09-29/${file}.png`, alt, label, hint: `${file}.png`,
})

export const report20260930 = {
  id: '2026-09-30',
  assetFolder: '2026-09-29',
  sequence: 6,
  period: '16 — 30 de setembro de 2026 · posição em 29/09',
  eyebrow: 'Entrega do período',
  title: 'LabOn renovado.\nEvidências à vista.',
  summary: 'O período reuniu a reformulação da interface, documentação da primeira entrega, remediações de qualidade e um modelo de ameaças. Esta apresentação reflete o histórico disponível até 29/09.',
  stats: [
    { label: 'Design', value: '63 superfícies', detail: '44 rotas no aceite' },
    { label: 'Regressão', value: '235 E2E', detail: 'aprovados em 23/09' },
    { label: 'Segurança', value: '25 ameaças', detail: 'registradas no modelo' },
  ],
  slides: [
    {
      id: 'design-login', index: '01', section: 'Reformulação visual',
      title: 'A nova interface começa no acesso',
      description: 'O login recebeu a nova linguagem visual, troca de tema e tratamento responsivo. Os prints mostram o código do período rodando localmente.',
      icon: MonitorSmartphone, accent: 'mint',
      points: [
        'Tema claro e escuro com preferência persistida',
        'Componentes e tokens visuais compartilhados',
        'Layout conferido em desktop e celular',
      ],
      images: [
        screenshot('login-desktop', 'Tela de login reformulada do LabOn em desktop', 'Login · desktop 1440 px'),
        { ...screenshot('login-mobile', 'Tela de login reformulada do LabOn em celular', 'Login · celular 375 px'), position: 'portrait' },
      ],
      caption: 'Build de produção local · sem dados de produção',
      source: { href: `${repo}/pull/415`, label: 'Ver PR da reformulação' },
    },
    {
      id: 'design-workspace', index: '02', section: 'Rotinas por perfil',
      title: 'Navegação e trabalho no mesmo padrão',
      description: 'A reformulação alcançou a home administrativa e o catálogo do mentor, com navegação por perfil e estados de consulta consistentes.',
      icon: LayoutDashboard, accent: 'lime',
      points: [
        'Home administrativa com atalhos de operação',
        'Catálogo do mentor com busca e leitura de produtos',
        'Aceite registra 63 superfícies e 44 rotas aplicáveis',
        'Suíte global concluiu 235 de 235 testes E2E',
      ],
      automation: { label: 'Limite do aceite', text: 'A matriz ainda registra achados axe de contraste e nome de botão. A aprovação E2E não elimina essas pendências.' },
      images: [
        screenshot('home-admin', 'Home administrativa reformulada com atalhos para as operações', 'Administrador · home'),
        screenshot('catalogo-mentor', 'Catálogo reformulado do mentor com produto sintético', 'Mentor · catálogo'),
      ],
      balancedImages: true,
      caption: 'Build de produção local · sessão e produtos sintéticos',
      source: { href: `${repo}/blob/a60ba64/.codex/docs/specs/reformulacao-design/aceites/final/aceite-final-2026-09-23.md`, label: 'Consultar aceite final' },
    },
    {
      id: 'documentation', index: '03', section: 'Primeira entrega documental',
      title: 'Documentos publicados com validação automática',
      description: 'A documentação da primeira entrega foi revisada na Wiki e recebeu uma esteira para checar estrutura, links e exemplos de execução.',
      icon: BookOpenText, accent: 'violet',
      points: [
        '12 critérios de aceite documentais aprovados',
        '24 testes documentais passaram na validação focada',
        'Manual, requisitos e guias mantidos na Wiki',
        'Exemplos de ambiente e Compose completados em 29/09',
      ],
      evidence: {
        badge: 'Validação documental · 22/09', headline: '12 / 12',
        subheadline: 'critérios aprovados',
        href: `${repo}/blob/7e38412/.codex/docs/specs/documentacao-primeira-entrega/validacao.md`,
        items: [
          { label: 'Testes focados', value: '24 / 24' },
          { label: 'Publicação', value: 'Wiki conferida' },
          { label: 'Revisão complementar', value: 'Issue #425' },
          { label: 'Exemplos', value: 'Dev e produção' },
        ],
        footer: 'A revisão de 29/09 acrescentou requisitos, convenções e correções de segurança.',
      },
      source: { href: `${repo}/wiki`, label: 'Abrir a Wiki' },
    },
    {
      id: 'code-quality', index: '04', section: 'Qualidade de código',
      title: 'CodeQL orientou correções no backend',
      description: 'O histórico do período registra remediações em auditoria, notificações, empréstimos e controladores, além de ajustes na análise de qualidade.',
      icon: ShieldCheck, accent: 'mint',
      points: [
        'Catches restringidos a falhas esperadas',
        'Leitores e cliente SMTP com descarte explícito',
        'Validações e filtros simplificados',
        'A correção Standard de 29/09 está em branch própria',
      ],
      evidence: {
        badge: 'Histórico Git · 20 a 29/09', headline: 'CodeQL',
        subheadline: 'remediações registradas',
        href: `${repo}/commit/305a8df`,
        items: [
          { label: 'Escopo', value: 'API e scripts' },
          { label: 'Integração', value: 'Remediação até T038' },
          { label: '29/09', value: 'Commit 305a8df' },
          { label: 'Estado local', value: 'Branch própria' },
        ],
        footer: 'A correção Standard estava fora de develop no checkout consultado em 29/09.',
      },
    },
    {
      id: 'threat-model', index: '05', section: 'Modelo de ameaças',
      title: 'Riscos do runtime e da publicação mapeados',
      description: 'O modelo STRIDE importável no OWASP Threat Dragon documenta os fluxos da aplicação e da cadeia de build e implantação.',
      icon: ScanSearch, accent: 'violet',
      points: [
        'Dois diagramas com fronteiras de confiança',
        '25 ameaças registradas: 19 abertas e 6 mitigadas',
        'Abrange acesso, API, dados, GHCR e OCI',
        'Base estática sujeita à revisão dos controles operacionais',
      ],
      evidence: {
        badge: 'Threat Dragon · issue #422', headline: '25',
        subheadline: 'ameaças registradas',
        href: `${repo}/blob/3e2be2d/security/threat-models/labon-threat-model.json`,
        items: [
          { label: 'Runtime', value: '17 registros' },
          { label: 'Build e deploy', value: '8 registros' },
          { label: 'Abertas', value: '19' },
          { label: 'Mitigadas no modelo', value: '6' },
        ],
        footer: 'A classificação decorre de análise estática e requer confirmação no ambiente de produção.',
      },
      source: { href: `${repo}/wiki/Modelo-de-Ameacas-Threat-Dragon`, label: 'Ler o modelo na Wiki' },
    },
    {
      id: 'container-security', index: '06', section: 'Imagem e política de scan',
      title: 'O scan completo expôs a lacuna da imagem da API',
      description: 'A revisão de 29/09 incluiu vulnerabilidades sem correção na política e trocou a base do backend para ASP.NET Chiseled Extra.',
      icon: FlaskConical, accent: 'lime',
      points: [
        'Imagem backend 2.7.1: 4 críticas e 52 altas por arquitetura',
        'Nova base isolada: zero críticas e zero altas no scan',
        'Dockerfile atualizado com ICU e fusos horários',
        'Imagem final ainda precisa de build e scan na CI',
      ],
      evidence: {
        badge: 'Trivy 0.72.0 · 29/09', headline: '4 + 52',
        subheadline: 'achados na imagem backend 2.7.1 por arquitetura',
        href: `${repo}/blob/317487d/docs/entregas/unidade-1/validacao.md`,
        items: [
          { label: 'Frontend 2.7.1', value: '0 críticas / 0 altas' },
          { label: 'Backend 2.7.1', value: '4 críticas / 52 altas' },
          { label: 'Nova base Chiseled', value: '0 críticas / 0 altas' },
          { label: 'Pendente', value: 'Scan da imagem final' },
        ],
        footer: 'A análise da base não comprova a imagem final nem implantação em produção.',
      },
    },
  ],
  closing: { title: 'Obrigado!' },
}
