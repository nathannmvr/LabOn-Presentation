# LabOn Presentation

## Entrega de 05/11 a 11/11/2026

A décima entrega abre por padrão ou em `?week=2026-11-11`. Foi preparada em
10/11 para apresentação em 11/11, sem antecipar resultados de uma data futura.

São 10 slides: capa, **um slide da entrega de segurança**, sete slides do
fluxo 3 e encerramento. O resumo registra a integração das correções à main,
31 achados de CodeQL e sete alertas Dependabot resolvidos. As duas sugestões
de AI findings continuam identificadas como pendentes.

O terceiro dos seis fluxos é **Materiais e estoque**: cadastrar uma vidraria,
consultar o catálogo, editar e conferir o saldo. São seis capturas e um GIF da
interface real local, com dados sintéticos e respostas de API simuladas,
condição indicada nos slides. Os dois fluxos apresentados anteriormente
permanecem na entrega de 04/11.

Conteúdo em `src/data/report-2026-11-11.js`. Consulte as
[fontes e limites](public/reports/2026-11-11/validacao.md), o
[roteiro do fluxo](public/reports/2026-11-11/fluxo-materiais.md) e a
[procedência das capturas](public/screenshots/2026-11-11/README.md).

Para reproduzir as mídias com a build de produção do frontend local em
`127.0.0.1:4173`:

```bash
node scripts/capture-2026-11-11.mjs
python scripts/animate-2026-11-11.py
```

Verificação local: lint e build aprovados; dez reports e 119 slides por
resolução, em 1440 × 900 e 375 × 812, com `layoutFindings: []`. O GIF tem
reprodução e parada verificadas por teclado. A identidade visual e os
componentes existentes foram preservados.

## Entrega de 15/10 a 04/11/2026

A nona entrega abre por padrão ou em `?week=2026-11-04`. O período começa no
dia seguinte ao fim da entrega anterior, em 14/10. O conteúdo foi preparado em
03/11 para apresentação até 04/11, sem afirmar resultados de uma data futura.

São 42 slides, incluindo capa e encerramento. O primeiro bloco apresenta o
PRD InterLab como planejamento para validação com o cliente, com oito
fluxogramas e tabelas de regras, permissões, estoque e exceções. Uma cópia
integral do PRD acompanha a apresentação para consulta.

O segundo bloco divide o sistema atual em seis fluxos e demonstra dois:
cadastro/aprovação de acesso e empréstimo/devolução. Os 19 prints e dois GIFs
mostram a interface atual com dados sintéticos e respostas de API simuladas,
condição indicada em cada slide. Os GIFs são sequências de capturas com
reprodução e parada explícitas. Os originais podem ser ampliados.

Conteúdo em `src/data/report-2026-11-04.js`. Consulte o
[roteiro dos fluxos](public/reports/2026-11-04/fluxos-atuais.md), as
[fontes e limites](public/reports/2026-11-04/validacao.md) e a
[procedência das capturas](public/screenshots/2026-11-04/README.md).

Para reproduzir as mídias com a build de produção do frontend local em
`127.0.0.1:4173` (usar `npm run build` e `npm run preview`, não o servidor de
desenvolvimento):

```bash
node scripts/capture-2026-11-04.mjs
python scripts/animate-2026-11-04.py
```

Para executar e conferir a apresentação, use os comandos abaixo e
`node scripts/verify-presentation.mjs` com o servidor em `127.0.0.1:5174`.

Verificação local: lint e build aprovados; nove reports e 109 slides por
resolução, em 1440 × 900 e 375 × 812, com `layoutFindings: []`. Os dois GIFs
têm reprodução e parada verificadas por teclado. A revisão visual confirmou
a correção da legibilidade das três alternativas no celular.

## Entrega de 08/10 a 14/10/2026

A oitava entrega está em `?week=2026-10-14`. São dez slides,
incluindo capa e encerramento, sobre as cinco correções de segurança, testes,
documentação e publicação da release 2.7.4. O conteúdo usa a identidade visual
e os componentes existentes.

As PRs #441 e #442 foram integradas e as issues #436–#440 estão encerradas
no GitHub. O aceite do ambiente publicado (T030/CA-027) ainda consta pendente
no plano, distinção preservada na apresentação.

Conteúdo em `src/data/report-2026-10-14.js`, com
[fontes e limites](public/reports/2026-10-14/validacao.md).

Apresentação web dos reports semanais do LabOn, construída com React e Vite.

## Executar

```bash
npm install
npm run dev
```

Use as setas, Page Up/Page Down ou espaço para navegar. O botão no rodapé ativa
o modo de tela cheia.

## Adicionar os prints desta semana

Coloque os arquivos em `public/screenshots/2026-08/`:

- `github-project.png`
- `wiki-prds.png`
- `dependabot-zero.png`

Enquanto não existirem, o slide mostra espaços reservados com o nome de cada
arquivo.

## Adicionar uma nova semana

1. Copie o objeto de uma semana em `src/data/reports.js`.
2. Incremente `sequence` (2, 3, 4...), e altere `id`, período, resumo, métricas e slides.
3. Crie uma pasta em `public/screenshots/AAAA-MM/` e ajuste os caminhos das imagens.

O seletor de semanas, a paginação, o progresso e as URLs são gerados
automaticamente a partir de `reports`.

Os slides podem usar `image` para prints ou `evidence` para painéis de evidência
com métricas, resultados e link verificável. A aplicação abre por padrão o report
mais recente.

## Entrega de 26/08 a 09/09/2026

A quarta entrega reúne as quatro frentes concluídas, 55 tarefas e oito capturas
do LabOn em execução local. Está disponível em `?week=2026-09-09`.

Os prints podem ser ampliados por clique ou toque. O slide responsivo compara
desktop e celular; os cenários de erro simulados estão identificados nas legendas.

Consulte o [roteiro e os resultados de validação](public/screenshots/2026-09/README.md).
As novas entregas também podem usar `images` para comparar prints e `source` para
ligar uma evidência complementar.

## Entrega de 10/09 a 16/09/2026

A quinta semana reúne visibilidade das funcionalidades, navegação após o login,
manual do usuário e fundação de qualidade. São nove slides, incluindo capa e
encerramento, com oito prints ampliáveis. Abre por padrão ou com
`?week=2026-09-16`.

A adição reutiliza a identidade visual, o CSS e os componentes existentes;
o conteúdo da semana está em `src/data/report-2026-09-16.js`.

As capturas mostram a aplicação local com dados sintéticos, o manual publicado
na Wiki e as execuções reais RED/GREEN no GitHub Actions. O slide do manual
registra a validação com participantes humanos ainda pendente.

Consulte a [procedência e o roteiro de captura](public/screenshots/2026-09-16/README.md).
Para reproduzir, use `node scripts/capture-2026-09-16.mjs`; para verificar todas
as semanas em desktop e celular, use `node scripts/verify-presentation.mjs`.

Validação concluída: lint e build aprovados; cinco reports e 37 slides
verificados por viewport (1440 × 900 e 375 × 812), com `layoutFindings: []`.
A revisão visual independente aprovou os 18 screenshots da semana 5 com
veredito **SHIP**, incluindo a rolagem dos slides 3–7 no celular. A captura
mobile do próprio LabOn conserva alguns rótulos truncados; essa limitação
está registrada no roteiro de captura.

## Entrega de 16/09 a 30/09/2026

A sexta entrega está em `?week=2026-09-30`. O report reúne a reformulação
visual, a documentação da primeira entrega, remediações CodeQL, o modelo de
ameaças e a revisão do scan de imagens. São seis slides de conteúdo, além da
capa e do encerramento. O recorte reflete o histórico disponível em 29/09;
eventos de 30/09 devem ser acrescentados após ocorrerem.

Quatro capturas da interface reformulada podem ser ampliadas no report. Elas
vieram do frontend local com sessão e dados sintéticos. Consulte a
[procedência das capturas](public/screenshots/2026-09-29/README.md).

## Entrega de 30/09 a 07/10/2026

A sétima semana abre por padrão ou em `?week=2026-10-07`. São 12 slides,
incluindo capa e encerramento, sobre a validação dos dois relatórios de
segurança e as cinco issues criadas no LabOn: #436 a #440.

O conteúdo distingue seis falsos positivos, três problemas confirmados e os
enquadramentos de CORS, IDs sequenciais e identificação do servidor. A issue
de recuperação de senha trata da falta de controle de abuso, preservando a
resposta genérica 202. As issues continuam abertas no recorte de 07/10 e não
representam correções já implementadas.

Esta semana usa os painéis de evidência existentes e links para cada issue,
sem prints de dados pessoais ou credenciais. A [validação completa e suas
limitações](public/reports/2026-10-07/validacao.md) acompanha a apresentação.
O IDOR está confirmado no código revisado, com reprodução autenticada atual
em produção pendente porque a credencial fornecida retornou 401.

O conteúdo está em `src/data/report-2026-10-07.js`. Para conferir a navegação
de todas as semanas e capturar a nova entrega em desktop e celular, execute
`node scripts/verify-presentation.mjs` com o servidor em `127.0.0.1:5174`.

Validação da nova entrega: lint e build aprovados, sete reports e 57 slides
por viewport (1440 × 900 e 375 × 812), com `layoutFindings: []`.
