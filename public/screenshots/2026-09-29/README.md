# Capturas da entrega 16–30/09/2026

Capturas refeitas a partir do build de produção local do `lab-solos`, na revisão
`2105328` da branch `develop`. O conteúdo visual corresponde à reformulação
integrada em 23/09. As telas autenticadas usam sessão e respostas de API
sintéticas, sem dados de produção. O script de captura está em
`scripts/capture-2026-09-29.mjs`.

| Arquivo | Tela | Condição |
|---|---|---|
| `login-desktop.png` | Login | 1440 × 900, sem sessão |
| `login-mobile.png` | Login | 375 × 812, sem sessão |
| `home-admin.png` | Home do administrador | 1440 × 900, sessão sintética |
| `catalogo-mentor.png` | Catálogo do mentor | 1440 × 900, sessão e produto sintéticos |

Para reproduzir, execute `npm.cmd run build` e depois
`npm.cmd run preview -- --host 127.0.0.1 --port 4173` em
`../lab-solos/frontend`. Então execute `node scripts/capture-2026-09-29.mjs`
neste repositório. O script rejeita o servidor de desenvolvimento.

A ilustração `laboratory.png` não aparece no print da home porque o caminho
`../../public/images/laboratory.png` usado no CSS não resolve no build de
produção. O servidor de desenvolvimento exibe a imagem. A apresentação usa
agora o comportamento do build publicado.

As métricas e situações dos slides técnicos vêm dos documentos de validação e
do histórico Git. O scan da base Chiseled ainda não substitui o scan da imagem
final do backend. A correção Standard do CodeQL em 29/09 estava na branch
`fix/codeql-standard-findings` no checkout consultado.
