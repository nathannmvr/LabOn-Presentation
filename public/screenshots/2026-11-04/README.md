# Capturas dos fluxos atuais para 04/11/2026

## Origem

Interface atual do frontend `lab-solos`, compilada e executada localmente em 03/11/2026 com `vite preview`. O manifesto `capturas.json` identifica a revisão do código, os arquivos compilados e cada etapa.

As capturas foram refeitas com a build de produção após a identificação de uma diferença no servidor de desenvolvimento: ele exibia uma ilustração legada da Home que não aparece na versão publicada. A referência antiga usa `/public/images/laboratory.png`, caminho indisponível na publicação. As capturas não removem elementos por edição de imagem ou sobreposição de estilos. O script exige arquivos compilados e recusa o servidor de desenvolvimento.

As telas são reais; os dados e as respostas de API são sintéticos. O serviço Docker não estava disponível. Nenhuma conta ou movimentação foi enviada à produção. A demonstração não comprova funcionamento real do backend, persistência, concorrência ou autorização em produção.

## Conteúdo

- `acesso-01` a `acesso-06`: entrada, cadastro, espera, análise pelo mentor, aprovação e acesso do mentorado.
- `emprestimo-01` a `emprestimo-13`: consulta do material, preparação, revisão, envio, acompanhamento, decisão administrativa, baixa de saldo e devolução integral.
- `fluxo-acesso.gif`: sequência animada dos seis prints do acesso.
- `fluxo-emprestimo.gif`: sequência animada dos treze prints do empréstimo.

Os GIFs usam os PNGs na ordem do roteiro, com 2,2 segundos por etapa. Não são vídeos contínuos. A reprodução pode ser iniciada ou parada na apresentação. Os prints originais não recebem redesenho ou substituição dos componentes do sistema.

O passo 5 do empréstimo mostra o detalhe do pedido pendente em `/mentor/history/loan?id=701`. A captura anterior havia aberto indevidamente o acompanhamento de mentorados; o print e o quadro correspondente do GIF foram substituídos. O script confere o título “Histórico de Empréstimo - Pendente” antes de capturar.

## Leitura e limites

O cenário representa 10 unidades de um béquer, empréstimo de 2, saldo 8 na aprovação e saldo 10 após devolução integral. Esses saldos são respostas do cenário simulado, coerentes com a leitura do código, e não medições do backend.

Os limites atuais da seleção de utilizador, quantidade na devolução e controles por item estão descritos no [roteiro completo](../../reports/2026-11-04/fluxos-atuais.md).

## Reprodução

```bash
node scripts/capture-2026-11-04.mjs
python scripts/animate-2026-11-04.py
```

Requer build de produção do frontend local em `http://127.0.0.1:4173`, dependências Playwright já utilizadas pelo projeto e Pillow para codificar os GIFs. No repositório `lab-solos/frontend`, executar primeiro `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. O script impede captura contra destino remoto e contra o servidor de desenvolvimento.
