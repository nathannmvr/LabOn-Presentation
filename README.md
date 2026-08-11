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
