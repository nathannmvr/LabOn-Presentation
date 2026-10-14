import { BookOpenText, GitPullRequest, KeyRound, LockKeyhole, MailCheck, Rocket, ShieldCheck, Workflow } from 'lucide-react'

const repo = 'https://github.com/ifpebj-ti/lab-solos'
const code = `${repo}/blob/8296787/.codex/docs/specs/protecao-acesso-autenticacao`
const validation = '/reports/2026-10-14/validacao.md'

export const report20261014 = {
  id: '2026-10-14',
  sequence: 8,
  period: '08 a 14 de outubro de 2026',
  eyebrow: 'Report semanal',
  title: 'Segurança\nno LabOn',
  summary: 'Implementamos as cinco correções da revisão de segurança, validamos as jornadas e publicamos a release 2.7.4. O aceite do ambiente publicado segue pendente no plano.',
  stats: [
    { label: 'Segurança', value: '5 correções', detail: 'issues #436 a #440 encerradas' },
    { label: 'Jornadas', value: '239 E2E', detail: '17 reais e 222 de interface' },
    { label: 'Release', value: '2.7.4 publicada', detail: '13/10, no horário de Brasília' },
  ],
  documents: [validation],
  slides: [
    {
      id: 'entrega-seguranca', index: '01', section: 'Entrega da semana',
      title: 'Cinco correções implementadas',
      description: 'A revisão da semana anterior virou código, testes e documentação. A PR #441 entrou em develop e a #442 levou a entrega à main.',
      icon: GitPullRequest, accent: 'mint',
      points: ['Autorização por recurso e proteção de login e recuperação', 'Políticas CSP e CORS com validação pelo proxy'],
      evidence: {
        badge: 'PR #441 · integrada em 13/10', headline: '5', subheadline: 'issues de segurança tratadas', href: `${repo}/pull/441`,
        items: [
          { label: '#436', value: 'Acesso por perfil e vínculo' },
          { label: '#437 e #438', value: 'Login e recuperação' },
          { label: '#439 e #440', value: 'CSP e origens permitidas' },
          { label: 'Integração à main', value: 'PR #442 em 13/10' },
        ],
        footer: 'Issues encerradas no GitHub. O plano ainda registra T030/CA-027 como pendente.',
      },
      source: { href: validation, label: 'Consultar fontes e limites da entrega' },
    },
    {
      id: 'autorizacao-recursos', index: '02', section: 'Issue #436 · acesso aos dados',
      title: 'Acesso conforme perfil e vínculo',
      description: 'O backend passou a conferir quem solicita o recurso e sua relação com o usuário ou empréstimo consultado.',
      icon: LockKeyhole, accent: 'mint',
      points: ['Mentor acessa os Mentorados diretamente vinculados', 'Perfil próprio exige senha atual para mudar o e-mail', 'Respostas de acompanhamento expõem apenas os dados necessários'],
      evidence: {
        badge: 'Matriz de acesso · backend e interface', headline: '3', subheadline: 'perfis com regras de acesso', href: `${code}/operacao.md`,
        items: [
          { label: 'Administrador', value: 'Gestão autorizada' },
          { label: 'Mentor', value: 'Próprio perfil e vinculados' },
          { label: 'Mentorado', value: 'Dados próprios autorizados' },
          { label: 'Recurso fora do alcance', value: 'Resposta de não encontrado' },
        ],
        footer: 'Testes cobrem acesso cruzado e alterações de perfil. Troca de e-mail não confirma propriedade da nova caixa.',
      },
    },
    {
      id: 'limites-login', index: '03', section: 'Issue #437 · autenticação',
      title: 'Login com limites compartilhados',
      description: 'As tentativas passaram a consumir cotas por conta e IP, persistidas no PostgreSQL e compartilhadas entre instâncias.',
      icon: KeyRound, accent: 'lime',
      points: ['Excesso recebe 429 e tempo de espera na interface', 'Falha no armazenamento da proteção recusa a autenticação', 'Proxy confiável impede uso de IP encaminhado forjado'],
      evidence: {
        badge: 'Configuração padrão · não é medição de carga', headline: '5', subheadline: 'falhas por conta em uma janela', href: `${code}/operacao.md`,
        items: [
          { label: 'Janela do login', value: '15 minutos' },
          { label: 'Cota por IP', value: '30 falhas' },
          { label: 'Tentativa após a cota', value: '429 com Retry-After' },
          { label: 'Falha da proteção', value: '503 genérico' },
        ],
        footer: 'Uma autenticação bem-sucedida não apaga cotas ativas. Pessoas na mesma rede compartilham a cota de IP.',
      },
    },
    {
      id: 'recuperacao-protegida', index: '04', section: 'Issue #438 · recuperação de senha',
      title: 'Recuperação com fila e controle de abuso',
      description: 'A solicitação mantém a resposta neutra e a entrega passa por uma fila persistente, com dados cifrados e tentativas limitadas.',
      icon: MailCheck, accent: 'violet',
      points: ['Rotas atuais e aliases usam o mesmo controle', 'Pedidos repetidos são agrupados enquanto há trabalho ativo', 'Troca de e-mail cancela pedidos ligados ao endereço antigo'],
      evidence: {
        badge: 'Recuperação · solicitação e validação', headline: '202', subheadline: 'resposta neutra preservada', href: `${code}/operacao.md`,
        items: [
          { label: 'Por destinatário', value: '3 pedidos por hora' },
          { label: 'Por IP', value: '20 pedidos por hora' },
          { label: 'Intervalo mínimo de emissão', value: '60 segundos' },
          { label: 'Código', value: 'Uso único, válido por 15 min' },
        ],
        footer: '202 não confirma envio. Os testes usam SMTP simulado e não comprovam entrega de e-mail em produção.',
      },
    },
    {
      id: 'politicas-navegador', index: '05', section: 'Issues #439 e #440 · navegador e proxy',
      title: 'CSP e origens restritas',
      description: 'Aplicamos a política de conteúdo no Caddy e restringimos as origens por ambiente, com testes pela borda HTTPS real da pilha de teste.',
      icon: ShieldCheck, accent: 'mint',
      points: ['Navegador verifica bloqueios da política de conteúdo', 'Jornadas incluem login, recuperação e exportações', 'CORS cobre mesma origem, origem externa e origem nula'],
      evidence: {
        badge: 'Browser security E2E · pilha sintética', headline: '5/5', subheadline: 'cenários locais aprovados', href: `${code}/evidencias/PR441/correcoes-ci.md`,
        items: [
          { label: 'CSP', value: 'Política efetiva no proxy' },
          { label: 'CORS', value: 'Origens necessárias' },
          { label: 'IP encaminhado', value: 'Teste de falsificação' },
          { label: 'Esteira', value: 'Job obrigatório no quality gate' },
        ],
        footer: 'O job remoto Browser security E2E também passou no candidato final da PR #441.',
      },
    },
    {
      id: 'qualidade-esteira', index: '06', section: 'Regressão e segurança contínua',
      title: 'Testes e bloqueios da esteira',
      description: 'Corrigimos falhas de portabilidade, dependências e alertas CodeQL. As validações de IDs passaram a rejeitar entradas inválidas antes de montar URLs.',
      icon: Workflow, accent: 'lime',
      points: ['Frontend local completo: 852 testes aprovados', 'Backend remoto: suíte de 435 casos aprovada', 'Axios atualizado e migração para Tailwind 4 com foco e temas revisados'],
      evidence: {
        badge: 'Container CI · candidato final da PR #441', headline: '239', subheadline: 'cenários de autenticação aprovados no CI', href: `${repo}/actions/runs/38485194851`,
        items: [
          { label: 'Jornadas reais', value: '17/17' },
          { label: 'Interface', value: '222/222' },
          { label: 'Imagens finais', value: '4 scans aprovados' },
          { label: 'Arquiteturas', value: 'AMD64 e ARM64' },
        ],
        footer: 'CodeQL e quality gate aprovados. Alertas foram corrigidos sem descartar achados nem relaxar as regras.',
      },
      source: { href: `${code}/evidencias/PR441/correcoes-ci.md`, label: 'Ler as evidências das correções' },
    },
    {
      id: 'documentacao-operacao', index: '07', section: 'Manual e operação',
      title: 'Documentação para uso e implantação',
      description: 'Atualizamos o manual de perfis e permissões e registramos como configurar, migrar e operar os novos controles de autenticação.',
      icon: BookOpenText, accent: 'violet',
      points: ['Manual explica acesso aos dados e espera temporária', 'Runbook cobre fila, chaves, migração e diagnóstico', 'Wiki recebeu exemplos Compose com as variáveis obrigatórias'],
      evidence: {
        badge: 'Documentação revisada em 13/10', headline: '44', subheadline: 'IDs de requisitos e critérios rastreados', href: `${code}/aceite-local.md`,
        items: [
          { label: 'Requisitos funcionais', value: '11' },
          { label: 'Requisitos não funcionais', value: '5' },
          { label: 'Critérios de aceitação', value: '28' },
          { label: 'Aceite publicado', value: 'T030 pendente no plano' },
        ],
        footer: 'Rastreabilidade documental não equivale a aceite de todos os critérios no ambiente publicado.',
      },
    },
    {
      id: 'release-proximos-passos', index: '08', section: 'Situação em 14/10',
      title: 'Release publicada e aceite pendente',
      description: 'A release 2.7.4 saiu em 13/10 às 21h15, no horário de Brasília. O GitHub encerrou as cinco issues após a integração à main.',
      icon: Rocket, accent: 'mint',
      points: ['Confirmar versão efetivamente implantada e URL do ambiente', 'Executar T030 com contas dedicadas e registrar os resultados'],
      evidence: {
        badge: 'GitHub Release · 13/10/2026', headline: '2.7.4', subheadline: 'release publicada no GitHub', href: `${repo}/releases/tag/2.7.4`,
        items: [
          { label: 'PR #441', value: 'Integrada à develop' },
          { label: 'PR #442', value: 'Integrada à main' },
          { label: 'Issues #436–#440', value: 'Encerradas no GitHub' },
          { label: 'Aceite T030/CA-027', value: 'Sem registro concluído' },
        ],
        footer: 'A publicação da release não comprova o deployment nem o aceite autenticado em produção.',
      },
      source: { href: validation, label: 'Consultar o estado das evidências' },
    },
  ],
  closing: { title: 'Obrigado!' },
}
