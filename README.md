# LabOn Presentation

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
