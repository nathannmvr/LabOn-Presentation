# Fontes e limites da apresentação de 15/10 a 04/11/2026

## Período e situação

A oitava entrega termina em 14/10/2026. A nona entrega começa no dia seguinte, **15/10/2026**, e termina em **04/11/2026**, conforme solicitado. O termo “semana” conserva a organização do seletor, embora o período tenha mais de sete dias.

Conteúdo preparado em **03/11/2026**. A data final é a data prevista para a apresentação. Não há afirmação de reunião, aceite, implementação ou piloto ocorridos em 04/11.

## Planejamento InterLab

O PRD local `.codex/docs/specs/integracao-laboratorios/prd.md`, no repositório `lab-solos`, é a fonte do bloco de planejamento. Uma cópia integral acompanha a apresentação em `reports/2026-11-04/prd.md` para consulta, inclusive antes de o arquivo ser versionado ou publicado no repositório remoto.

O documento contém 27 requisitos funcionais, 7 não funcionais, 45 critérios de aceitação e o registro das 40 rodadas de descoberta e confirmação. A descoberta foi confirmada pelo usuário; a validação com o cliente permanece pendente. O documento não representa implementação de InterLab nem resultado de piloto.

Os fluxogramas e as tabelas traduzem as regras para discussão. Exemplos de volumes são ilustrativos. Os números de requisitos são contagens do documento, não métricas de resultados em produção.

As perguntas PA-001 a PA-006 permanecem visíveis, incluindo complementação durante suspensão, retorno físico de material recusado, articulação das aprovações atuais, administração inicial da rede, participantes do piloto e expectativas de operação.

## Sistema atual

A divisão em seis fluxos organiza funcionalidades existentes para apresentação. Os dois detalhados são cadastro/aprovação de mentorado e empréstimo/devolução integral.

Os prints mostram a build de produção da interface atual local, servida por `vite preview`, com dados sintéticos e respostas de API simuladas. O ambiente não dispunha do serviço Docker, portanto não foi feita execução real local do backend nem alterada produção. O manifesto `screenshots/2026-11-04/capturas.json` registra revisão do código, arquivos compilados, etapas, papéis e rotas.

As mídias foram refeitas após a correção do usuário sobre a ilustração legada da Home. O servidor de desenvolvimento resolvia uma referência antiga que a publicação não disponibiliza. A build local e a publicação utilizam o CSS `index-CMI32W4H.css`; a consulta pública ao caminho antigo `/public/images/laboratory.png` retornou 404. O script agora exige a build compilada para impedir a mesma divergência. Não houve edição do conteúdo das capturas nem mudança no código da Home; o print e o GIF refletem a interface compilada.

Os GIFs apresentam sequências de capturas das interações. Os controles de reprodução são manuais. As imagens originais permitem ampliação. O roteiro `fluxos-atuais.md` descreve os passos e as limitações reais do formulário e da devolução, sem atribuir à API comportamentos que ela não recebe.

O passo 5 do empréstimo foi corrigido para abrir o detalhe do pedido em `/mentor/history/loan?id=701`, com o título “Histórico de Empréstimo - Pendente”. A captura anterior usava indevidamente a tela de acompanhamento de mentorados para o próprio mentor. Foram atualizados o print, o quadro do GIF, a descrição do slide e a rota no roteiro. O script exige o título correto e verifica a ausência do título da tela anterior antes da captura.

## Verificação desta entrega

Verificação local concluída em 03/11/2026:

- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- `node scripts/verify-presentation.mjs`: nove reports e 109 slides por resolução, em 1440 × 900 e 375 × 812, com `layoutFindings: []`.
- A verificação percorreu as entregas anteriores e a nova, conferiu navegação, URLs diretas, imagens carregadas, ampliação e documentos de apoio.
- Os dois GIFs foram verificados com reprodução por teclado, parada e retomada das setas de navegação. A preferência por movimento reduzido conserva o estado inicial parado.
- A nova entrega contém 42 slides, oito fluxogramas, onze tabelas, 19 PNGs e dois GIFs. O GIF de acesso possui seis quadros e o de empréstimo, treze.
- Os arquivos e seus resumos SHA-256 conferem com o manifesto. A cópia pública do PRD é idêntica à fonte local.
- A revisão visual independente apontou uma correção material: empilhar as três alternativas do fluxograma no celular para evitar quebra interna de palavra. A confirmação pelas três recapturas do slide afetado classificou essa correção como resolvida, com disposição `ship` no escopo desse ajuste.
- A conferência documental classificou a extensão como conforme à identidade existente, preservando os arquivos normativos de design. O índice auxiliar de design já apresentava desatualização anterior à tarefa e foi preservado.

As capturas da revisão da apresentação ficam em `.impeccable/review/`, separadas das mídias dos fluxos que acompanham o site. A verificação da apresentação não substitui a homologação funcional do LabOn nem a validação do PRD com o cliente.
