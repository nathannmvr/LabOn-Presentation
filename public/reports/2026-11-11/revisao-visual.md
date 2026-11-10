# Revisão visual — entrega de 11/11/2026

Conferência em **10/11/2026**. Extensão ordinária da apresentação existente, em modo Read, para professores e avaliadores em projetor. **Veredito: conforme ao sistema “Pôster de Congresso”; disposição final da revisão independente: SHIP.**

## Escopo e fontes conferidas

- `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, o brief de apresentação e `.impeccable/surfaces/src-app-jsx.md`.
- O novo `src/data/report-2026-11-11.js`, seu registro, os componentes e estilos existentes e o report anterior de 04/11 como referência de continuidade.
- `validacao.md`, `fluxo-materiais.md`, o manifesto `public/screenshots/2026-11-11/capturas.json` e a procedência adjacente do GIF.
- Montagens finais `.impeccable/review/desktop-montage-20261111.png` e `mobile-montage-20261111.png`, inspecionadas nesta conferência.

O período é **05 a 11/11/2026**, preparado em **10/11** sem antecipar resultados do dia seguinte. São **12 slides**: capa, três da entrega de segurança, sete de Materiais e estoque (visão geral e seis passos) e encerramento.

## Continuidade visual

A extensão reutiliza a paleta existente: papel `#f8f8f8`, carvão `#182727`, verde `#135b2d`, tinta secundária `#52605b` e linha `#c8d1cb`. Albert Sans, títulos de peso 800, métricas verdes, regras finas e campo claro mantêm a hierarquia acadêmica aprovada. Não foi criado outro tema ou componente.

Capa, painel de evidência, tabela, moldura de captura e encerramento usam os componentes existentes. A composição desktop mantém texto e prova lado a lado; no celular, o conteúdo empilha e conserva a navegação inferior. As capturas preservam proporções, ampliação e legendas; o GIF começa pelo poster e oferece reprodução explícita. A sombra continua restrita à moldura de evidência.

As montagens confirmam a continuidade com o report anterior. O único achado material da revisão independente foi o recorte do título de encerramento no celular. O texto final **“Três de seis fluxos”** aparece inteiro nas duas montagens; a revisão independente confirmou a correção nas capturas finais de desktop e celular, sem alteração do CSS global.

## Evidência e validação

Os slides de Materiais declaram **interface real local, API simulada e dados sintéticos** e vinculam o roteiro. Não alegam operação em produção, persistência real ou validação da autorização do backend. O manifesto registra revisão, ambiente, rotas, etapas e hashes das seis capturas e do GIF. A origem dos PNGs está embutida; a sequência animada tem procedência em `fluxo-materiais.gif.json` e não é apresentada como gravação contínua.

Na integração, o responsável executou lint e build com sucesso e `scripts/verify-presentation.mjs`, cuja saída foi `{"reports":10,"slidesPerViewport":121,"viewports":2,"layoutFindings":[]}` para **1440 × 900 e 375 × 812**. Informou também reprodução/parada do GIF por teclado, detector sem achados e conferência de metadados em seis rasters, sem origem ausente. Esses resultados são evidências recebidas da integração; este passe documental leu fontes e inspecionou as montagens, sem executar navegador ou testes.

## Limites preservados

O sidecar de design já estava desatualizado antes desta extensão, conforme registro anterior; sua data de geração e cobertura parcial confirmam o drift preexistente. A escala de capa documentada também difere do CSS atual. Nenhuma dessas diferenças foi promovida a nova regra nem corrigida neste escopo.

`PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, briefs, componentes, estilos e reports anteriores permanecem sem alterações nesta extensão. O único arquivo criado neste passe documental é este registro; não há necessidade material de atualizar o sistema normativo para o novo conteúdo.
