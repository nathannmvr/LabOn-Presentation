import { BookOpenText, KanbanSquare, ShieldCheck } from 'lucide-react'

export const reports = [
  {
    id: '2026-08-11',
    sequence: 1,
    period: '05 — 11 de agosto de 2026',
    eyebrow: 'Report semanal',
    title: 'Mais visibilidade.\nMenos trabalho manual.',
    summary: 'Nesta semana, estruturamos a gestão, automatizamos a documentação e zeramos o backlog de segurança do LabOn.',
    stats: [
      { label: 'GitHub Project', value: 'Centralizado', detail: 'gestão e qualidade' },
      { label: 'Automações', value: '2 fluxos ativos', detail: 'Project + Wiki' },
      { label: 'Dependabot', value: '112 → 0', detail: 'alertas abertos' },
    ],
    slides: [
      {
        id: 'github-projects',
        index: '01',
        section: 'Gestão e visibilidade',
        title: 'Um quadro vivo para acompanhar o LabOn',
        description: 'Criamos o GitHub Project “LabOn: Desenvolvimento e Qualidade” para reunir o andamento do produto em um único lugar.',
        icon: KanbanSquare,
        accent: 'mint',
        points: [
          'Issues organizadas por status e prioridade',
          'Visão única para desenvolvimento e qualidade',
          'Métricas atualizadas sem operação manual',
        ],
        automation: {
          label: 'GitHub Workflow',
          text: 'Sincroniza eventos de issues, execuções de CI e métricas do projeto diariamente.',
        },
        image: {
          src: '/screenshots/2026-08/github-project.png',
          alt: 'Quadro do GitHub Projects do LabOn',
          label: 'PRINT DO QUADRO',
          hint: 'github-project.png',
          position: 'center',
        },
      },
      {
        id: 'prds-wiki',
        index: '02',
        section: 'Documentação contínua',
        title: 'PRDs acessíveis e sempre atualizadas na Wiki',
        description: 'A Wiki ganhou uma área dedicada aos documentos de requisitos do produto, facilitando consulta, histórico e alinhamento.',
        icon: BookOpenText,
        accent: 'violet',
        points: [
          'Navegação dedicada para PRDs',
          'Requisitos centralizados com o restante da documentação',
          'Publicação rastreável a partir da branch develop',
        ],
        automation: {
          label: 'Publicação automática',
          text: 'Quando uma PRD nova entra na develop, o workflow gera e publica sua página na Wiki.',
        },
        image: {
          src: '/screenshots/2026-08/wiki-prds.png',
          alt: 'Barra lateral da Wiki com a área de PRDs',
          label: 'PRINT DA WIKI',
          hint: 'wiki-prds.png',
          position: 'left',
        },
      },
      {
        id: 'dependabot',
        index: '03',
        section: 'Segurança',
        title: 'O backlog de vulnerabilidades chegou a zero',
        description: 'Resolvemos os alertas acumulados do Dependabot e atualizamos as dependências vulneráveis do frontend e do backend.',
        icon: ShieldCheck,
        accent: 'lime',
        metric: { before: '112', after: '0', label: 'alertas abertos' },
        points: [
          'Remediação consolidada e revisada',
          'Dependências npm e NuGet atualizadas',
          'Base mais segura para as próximas entregas',
        ],
        image: {
          src: '/screenshots/2026-08/dependabot-zero.png',
          alt: 'Tela do Dependabot sem alertas abertos',
          label: 'PRINT DO DEPENDABOT',
          hint: 'dependabot-zero.png',
          position: 'center',
        },
      },
    ],
    closing: {
      title: 'Obrigado!',
    },
  },
]
