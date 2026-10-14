# Entrega de 08 a 14/10/2026 — fontes e limites

Recorte: quinta-feira, 08/10, até quarta-feira, 14/10/2026. Horários em America/Sao_Paulo. Consulta ao GitHub realizada em 14/10. O conteúdo reúne implementação, validação, documentação e publicação da proteção de acesso e autenticação.

## Integração e publicação

- [PR #441](https://github.com/ifpebj-ti/lab-solos/pull/441): integrada à develop em 13/10 às 21h01. O merge local é 8296787.
- [PR #442](https://github.com/ifpebj-ti/lab-solos/pull/442): integrada à main em 13/10 às 21h06.
- [Release 2.7.4](https://github.com/ifpebj-ti/lab-solos/releases/tag/2.7.4): publicada em 13/10 às 21h15min59s (14/10 às 00h15min59s UTC), apontando para 98990fa97cfa9628410569daf1a9357cd39fd2c8.
- Issues [#436](https://github.com/ifpebj-ti/lab-solos/issues/436), [#437](https://github.com/ifpebj-ti/lab-solos/issues/437), [#438](https://github.com/ifpebj-ti/lab-solos/issues/438), [#439](https://github.com/ifpebj-ti/lab-solos/issues/439) e [#440](https://github.com/ifpebj-ti/lab-solos/issues/440): estado CLOSED na consulta, encerradas em 13/10 por volta de 21h07. Não tratar o estado histórico OPEN dos documentos locais como estado atual do GitHub.

## Fontes técnicas fixadas

Os links abaixo usam o commit integrado à develop, preservando a evidência do período.

- [Runbook operacional e matriz de acesso](https://github.com/ifpebj-ti/lab-solos/blob/8296787/.codex/docs/specs/protecao-acesso-autenticacao/operacao.md): regras por papel/vínculo, limites padrão, fila, códigos, chaves, proxy e implantação.
- [Aceite local](https://github.com/ifpebj-ti/lab-solos/blob/8296787/.codex/docs/specs/protecao-acesso-autenticacao/aceite-local.md): rastreabilidade dos 44 IDs (11 RF, 5 RNF e 28 CA), resultados locais e limites.
- [Correções da PR #441](https://github.com/ifpebj-ti/lab-solos/blob/8296787/.codex/docs/specs/protecao-acesso-autenticacao/evidencias/PR441/correcoes-ci.md): testes locais, revisões de CI, CodeQL, dependências, Tailwind, foco, temas e imagens.
- [Plano de tarefas, incluindo T030](https://github.com/ifpebj-ti/lab-solos/blob/8296787/.codex/docs/specs/protecao-acesso-autenticacao/tasks.md): T001–T029 registradas como concluídas, T030 pendente.
- [Manual de permissões](https://github.com/ifpebj-ti/lab-solos/blob/8296787/docs/manual/perfis-e-permissoes.md).
- [Revisão da Wiki](https://github.com/ifpebj-ti/lab-solos.wiki/commit/f2c211c81e463d39929874260ae3829860f9eebc): exemplos Compose e formato binário da chave HMAC, em 13/10.

## Validações apresentadas

- Frontend completo local final: 852/852, 149 arquivos, lint e build aprovados. Backend remoto: suíte de 435 casos aprovada no candidato 80f1f4c, conforme registro de revisão. Os números evoluem durante a PR e não devem ser somados entre execuções.
- [Container CI do candidato final ebcddc5](https://github.com/ifpebj-ti/lab-solos/actions/runs/38485194851): Frontend quality, Backend quality, Authentication E2E, Browser security E2E, Workflow contracts, Code quality baseline, quatro scans de imagens e Quality gate concluídos com SUCCESS.
- Autenticação E2E: 17 cenários reais e 222 de interface, totalizando 239. Segurança de navegador local: 5/5 em pilha sintética. O job remoto correspondente também passou.
- [CodeQL](https://github.com/ifpebj-ti/lab-solos/actions/runs/38485194888), [dependências](https://github.com/ifpebj-ti/lab-solos/actions/runs/38485194976) e [documentação](https://github.com/ifpebj-ti/lab-solos/actions/runs/38485194801): checks do candidato final aprovados.
- O rollup da PR também contém uma falha da sincronização de métricas do GitHub Project após o merge. Portanto, a apresentação afirma aprovação dos checks de qualidade citados, sem afirmar que todas as automações passaram. Execuções posteriores de sincronização em 14/10 aparecem aprovadas.

## Limites e próximo passo

O GitHub confirma publicação e encerramento das issues. Os documentos fixados registram apenas aceite local e mantêm T030/CA-027 pendente. Não foi localizado nesse plano um aceite concluído do ambiente publicado.

Esta apresentação não executa deployment, teste autenticado em produção ou envio SMTP real. Publicar a release não comprova que a versão está implantada. O próximo passo documentado é confirmar URL e versão do deployment e validar com contas dedicadas a matriz de acesso, cotas, recuperação e cabeçalhos efetivos.

Os limites de login e recuperação são valores padrão de configuração, não resultados de carga. As suítes locais usam dados sintéticos e SMTP simulado. Não há afirmação de SLO, latência de produção ou cobertura de todos os navegadores.
