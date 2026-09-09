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
do LabOn em execução local. Abre por padrão ou com `?week=2026-09-09`.

Os prints podem ser ampliados por clique ou toque. O slide responsivo compara
desktop e celular; os cenários de erro simulados estão identificados nas legendas.

Consulte o [roteiro e os resultados de validação](public/screenshots/2026-09/README.md).
As novas entregas também podem usar `images` para comparar prints e `source` para
ligar uma evidência complementar.
