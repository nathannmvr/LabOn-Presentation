# Entrega de 26/08 a 09/09/2026 — evidências

Capturas realizadas em **09/09/2026** com o LabOn executado localmente, a partir do commit
`c243e2e106292fdc5a25072756c21cb5fff5a423` de `lab-solos`.
São evidências atuais da implementação apresentada no período, não fotos históricas de produção.

Frontend Vite em `http://127.0.0.1:5173`, API .NET em `http://127.0.0.1:18080/api`,
PostgreSQL e Mailpit na stack Docker exclusiva `labon-report-20260909`.
Somente dados sintéticos; e-mails entregues ao Mailpit local (`http://127.0.0.1:28025`).
Nenhum dado ou serviço de produção foi usado.

## Atividades e fontes

| Frente | Tarefas concluídas | Implementação | Plano local em lab-solos |
| --- | ---: | --- | --- |
| Ciclo de vida de autenticação e credenciais | 16 | [PR #321](https://github.com/ifpebj-ti/lab-solos/pull/321) | `.codex/docs/specs/ciclo-vida-autenticacao-credenciais/tasks.md` |
| Contratos de dados de usuário | 10 | [PR #323](https://github.com/ifpebj-ti/lab-solos/pull/323) | `.codex/docs/specs/contratos-dados-usuario/tasks.md` |
| Frontend responsivo | 16 | [PR #329](https://github.com/ifpebj-ti/lab-solos/pull/329), [PR #330](https://github.com/ifpebj-ti/lab-solos/pull/330) | `.codex/docs/specs/frontend-responsivo/tasks.md` |
| Experiência de erros no frontend | 13 | [PR #332](https://github.com/ifpebj-ti/lab-solos/pull/332) | `.codex/docs/specs/experiencia-erros-frontend/tasks.md` |

Total: **55 tarefas**, conferidas nos quatro planos e no histórico Git local.

## Capturas e alcance da evidência

| Arquivo | Origem e comportamento observado |
| --- | --- |
| [primeiro-acesso.png](primeiro-acesso.png) | Login real redirecionou para `/change-password-required`. API retornou `requiresPasswordChange: true` e negou consulta de usuários com 403 antes da troca. |
| [recuperacao-senha.png](recuperacao-senha.png) | Solicitação real retornou 202 e abriu a redefinição com confirmação neutra. Nenhum token de recuperação aparece no print. |
| [cadastro-usuario.png](cadastro-usuario.png) | Formulário preenchido. Após a captura, envio retornou 201; payload normalizado para `Belo Jardim`/`ES` e data civil `YYYY-MM-DD` confirmados por assertions. |
| [usuarios-desktop.png](usuarios-desktop.png) | Lista da API real com usuários sintéticos, data civil, perfil e status. Viewport 1280 × 800, captura da página inteira. |
| [usuarios-mobile.png](usuarios-mobile.png) | Mesma lista em 375 × 812, página rolada até os cartões. Assertion verificou ausência de transbordamento horizontal. |
| [erro-recuperavel.png](erro-recuperavel.png) | **HTTP 500 simulado pelo Playwright** somente em `GET /api/Usuarios`; sessão e demais consultas reais. Interface mostra orientação, referência e nova tentativa; detalhes internos sentinela não são renderizados. |
| [consulta-recuperada.png](consulta-recuperada.png) | Após “Tentar novamente”, a consulta voltou à API real: lista reapareceu e alerta foi removido sem novo login. Acessível pelo link no slide de erros. |
| [acesso-negado.png](acesso-negado.png) | **HTTP 403 simulado pelo Playwright** na mesma consulta. Interface explica a falta de permissão, preserva rota e cookie de sessão. |

São PNGs diretos do Chromium, sem montagem ou retoque. O print mobile registra o viewport após rolagem;
os demais usam a página inteira. As molduras pertencem à apresentação.
[capturas.json](capturas.json) e [primeiro-acesso.json](primeiro-acesso.json) registram contexto e dimensões;
[validacao.json](validacao.json) registra os resultados desta execução.

## Validação realizada

- Frontend `npm run test -- --run`: **89 arquivos, 387 testes aprovados**.
- Playwright completo contra Vite dev: **149 aprovados e 18 falhas**. Todas eram contagens de requisições:
  efeitos duplicados do React StrictMode em desenvolvimento divergiam da execução compilada esperada pela suíte.
- Após `npm run build` e execução com `npm run preview`, reexecução com `--last-failed`: **18/18 aprovados**.
  Os **167 cenários passaram em duas etapas**, não em uma única rodada de 167/167.
- `credential-lifecycle.spec.ts`: troca inicial, troca própria, recuperação via SMTP e revogação de sessões.
- `user-data-contract.spec.ts`: cadastro, Problem Details por campo e valores legados/ausentes sem escrita.
- `responsive-layout.spec.ts`: cinco larguras principais, 320, 375, 767, 768 e 1440 px.
- `error-experience.spec.ts`: 401, 403, retomada de rota e rejeição de destinos externos ou de outro perfil.
- Apresentação: `npm run lint` e `npm run build` aprovados.
- `node scripts/verify-presentation.mjs`: quatro entregas, 28 slides por viewport, desktop 1440 × 900 e mobile 375 × 812;
  imagens carregadas, URLs e navegação funcionando, sem overflow horizontal ou controles fora do viewport nos slides novos.
- Revisão visual confirmou correção dos controles mobile e orientação para ampliar os prints.

O build do aplicativo apresentou avisos preexistentes de `/env.js`, referência de imagem e tamanho do bundle.
Não houve mudança no código funcional de `lab-solos`, execução remota de CI, deploy ou teste em dispositivo físico.
Os prints mostram estados da interface; afirmações sobre contratos e revogação dependem também das assertions e testes acima.

## Reproduzir

Pré-requisitos: projetos em pastas irmãs, dependências instaladas, Chromium do Playwright instalado em
`lab-solos/frontend` e Docker iniciado. Use banco novo e exclusivo: a primeira captura e o teste de credenciais
dependem da senha inicial. Não use um ambiente com dados importantes.

Em `lab-solos`:

```powershell
$env:E2E_SMTP_PORT='28025'
docker compose -p labon-report-20260909 -f docker-compose-e2e.yml up -d --build --wait backend
```

Em outro terminal, em `lab-solos/frontend`, sirva a versão compilada para evitar os efeitos duplicados do dev:

```powershell
$env:VITE_API_URL='http://127.0.0.1:18080/api/'
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Em `LabOn-Presentation`, capture o primeiro acesso **antes** do teste que altera a senha:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:4173'
node scripts/capture-2026-09-09.mjs --first-access
```

Em `lab-solos/frontend`, execute a suíte no mesmo ambiente:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:4173'
$env:E2E_SMTP_API_URL='http://127.0.0.1:28025'
npm run test:e2e -- --workers=4
```

Em `LabOn-Presentation`, capture o restante:

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:4173'
node scripts/capture-2026-09-09.mjs
npm run build
```

O script reutiliza o Playwright do frontend; `LAB_SOLOS_ROOT` pode apontar para outro caminho.
`E2E_API_URL` personaliza a API. `--lists-only` refaz listas/erros depois de uma captura completa, sem criar outro usuário.
O roteiro cadastra usuário sintético e solicita recuperação no Mailpit.

Para conferir a apresentação, mantenha `npm run dev -- --host 127.0.0.1 --port 5174 --strictPort` em execução e rode
`node scripts/verify-presentation.mjs`. `PRESENTATION_URL` personaliza a porta.
As capturas de revisão ficam em `.impeccable/review/` e não são versionadas.

A stack exclusiva pode ser parada sem apagar dados com
`docker compose -p labon-report-20260909 -f docker-compose-e2e.yml stop`, executado em `lab-solos`.
