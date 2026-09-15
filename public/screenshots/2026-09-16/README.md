# Entrega de 10 a 16 de setembro de 2026

Semana 5 da apresentação, disponível em `?week=2026-09-16`.
Conteúdo consolidado e capturas realizados em 15/09; o período solicitado termina em 16/09.

São nove slides, incluindo capa e encerramento, e oito PNGs de evidência.
A semana reutiliza a identidade visual, o CSS e os componentes da apresentação.

## O que foi entregue

| Frente | Conteúdo apresentado | Fonte no repositório LabOn |
| --- | --- | --- |
| Visibilidade e posicionamento | Menus e conta com funções operacionais; retirada de protótipos | `.codex/docs/specs/visibilidade-posicionamento-funcionalidades/tasks.md` |
| Navegação pós-autenticação | Atalhos por perfil, IDs na URL, recarga, retorno seguro e erros contextuais | `.codex/docs/specs/navegacao-pos-autenticacao/tasks.md` e `validacao.md` |
| Manual do usuário | Sete páginas e nove imagens publicadas na Wiki; validação documental | `.codex/docs/specs/manual-usuario/tasks.md`, `evidencias/T019.md` e `docs/manual/manual.json` |
| Fundação de qualidade e testes | Regressão, correção da devolução e proteção efetiva da branch | `.codex/docs/specs/fundacao-qualidade-testes/evidencias/T029.md`, `T030.md`, `T031.md` e `aceite.md` |

A entrega consolida as quatro frentes indicadas pelo usuário. A implementação de
visibilidade tem registros de 09/09, anteriores à janela desta semana, e seu
plano ainda registra o bloqueio histórico da T006 por Docker. A navegação foi
validada posteriormente com a pilha Docker e a fundação registra regressão
completa de 211 E2E. Não foi alterado o estado de nenhum plano de origem.

O manual foi publicado, mas as sessões com participantes humanos e o aceite
editorial correspondente (T015–T018) continuam pendentes. Essa ressalva aparece
no slide do manual. Publicação não foi tratada como prova de autonomia de uso.

## Prints e procedência

Os oito PNGs são capturas de navegador, sem montagem ou geração de imagem.
`capturas.json` registra URL, viewport, descrição, modo e data da coleta.

| Arquivo | Evidência |
| --- | --- |
| `conta-menu.png` | Conta administrativa e menu abertos, sem importação, InterLab ou Labon Pro |
| `home-admin.png` | Seis atalhos administrativos e contador com dados de demonstração |
| `home-mentor.png` | Home do Mentor no desktop, rolada para exibir os atalhos |
| `home-mentor-mobile.png` | Mesma home em 375 px, rolada até os atalhos |
| `detalhe-apos-recarregar.png` | Empréstimo aberto por link e recarregado com `id=701`; retorno à lista verificado |
| `manual-wiki.png` | Página pública do manual no GitHub Wiki |
| `qualidade-green.png` | Container CI real aprovado, execução `35008036822` |
| `qualidade-red.png` | Falha controlada da prova de proteção, execução `35000986662` |

As cinco capturas de produto usam o frontend real local, revisão `85c5bb3`, com
sessões e respostas HTTP sintéticas baseadas nas fixtures E2E do próprio LabOn.
Elas comprovam a interface e a navegação observadas; não representam novas
execuções de integração com o backend. As legendas dos slides explicitam isso.
O script não altera o DOM para modificar o resultado fotografado.

A captura `home-mentor-mobile.png` preserva alguns rótulos truncados na
interface mobile do próprio LabOn. A limitação já existe no produto capturado;
esta entrega registra a evidência e não inclui uma correção desses rótulos.

As três capturas remotas mostram páginas públicas reais. Os totais de testes
foram extraídos da validação final T029/T031 de 15/09: **605 frontend + 183
backend + 197 UI + 14 E2E reais = 999 testes**. São resultados registrados na
entrega, não uma nova execução dessas suítes durante a montagem da apresentação.

Fontes públicas:

- [Manual publicado](https://github.com/ifpebj-ti/lab-solos/wiki/Manual-do-Usuario)
- [Container CI GREEN](https://github.com/ifpebj-ti/lab-solos/actions/runs/35008036822)
- [Prova RED](https://github.com/ifpebj-ti/lab-solos/actions/runs/35000986662)
- [PR da fundação](https://github.com/ifpebj-ti/lab-solos/pull/346)

A consulta somente de leitura ao ruleset `9464959` foi salva em
`protecao-branch.json`: regra ativa com nove checks obrigatórios, incluindo
`Code quality baseline` e `Quality gate`.

## Reproduzir as capturas

Com as dependências instaladas nos dois projetos e o LabOn em execução local:

```powershell
# Em D:/lab-solos/frontend
npm run dev -- --host 127.0.0.1 --port 5173

# Em D:/LabOn-Presentation
node scripts/capture-2026-09-16.mjs
```

O script reaproveita Chromium, Playwright e fixtures de `../lab-solos/frontend`.
As variáveis `LAB_SOLOS_ROOT` e `E2E_BASE_URL` permitem outros caminhos/endereço.
`--app-only` e `--remote-only` limitam a coleta. As capturas remotas exigem acesso
às páginas públicas do GitHub. Nenhuma credencial ou token é incluído nos PNGs.

## Validar a apresentação

```powershell
npm run lint
npm run build
npm run dev -- --host 127.0.0.1 --port 5174
node scripts/verify-presentation.mjs
```

A verificação percorre todas as semanas em desktop e celular, confere imagens,
URLs, navegação por teclado e abertura dos prints ampliados. Os registros da
inspeção visual ficam em `.impeccable/review/`.

### Resultados da validação atual

- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- `node scripts/verify-presentation.mjs`: cinco reports e 37 slides por
  viewport, em desktop (1440 × 900) e celular (375 × 812), com
  `layoutFindings: []` nos dois viewports.
- Revisão visual independente: **SHIP** nos 18 screenshots da semana 5
  (nove slides em cada viewport), incluindo a inspeção por rolagem dos
  slides 3–7 no celular.
