# Entrega de 05 a 11/11/2026 — fontes e limites

Preparada em **10/11/2026**, para apresentação em **11/11/2026**. O recorte começa na quinta-feira posterior ao encerramento da entrega anterior, em 04/11. Não são afirmados resultados ocorridos em 11/11.

## Composição

A semana 10 possui 10 slides: capa, **um slide da entrega**, sete slides do fluxo 3 (uma visão animada e seis passos) e encerramento. A pedido do usuário, o resumo mantém somente “Segurança conferida na main”, seguido imediatamente pelos slides do fluxo, preservados integralmente.

O estilo, os controles, a ampliação de capturas e a reprodução/parada dos GIFs são os já utilizados pelo LabOn Presentation. As semanas anteriores foram preservadas.

## Entrega de segurança

| Afirmação | Evidência |
| --- | --- |
| Correções integradas em develop | [PR #458](https://github.com/ifpebj-ti/lab-solos/pull/458), merge `e0e1552395fa4a5b0160b9ccf3181ff8d2a7e61a`. |
| Promoção para main | [PR #459](https://github.com/ifpebj-ti/lab-solos/pull/459), merge `09d9b419d2df21cbc3c27e0704fa90d9ef621777`. |
| 31 achados CodeQL corrigidos | Comparação entre a análise anterior de main, commit `98990fa`, e a [análise concluída do commit 09d9b41](https://github.com/ifpebj-ti/lab-solos/actions/runs/42886365064): zero achados em C# e JavaScript/TypeScript. |
| Sete alertas Dependabot resolvidos | [Painel de vulnerabilidades](https://github.com/ifpebj-ti/lab-solos/security/dependabot) e consulta autenticada à API após o merge: zero alertas abertos. A atualização da dependência minimatch também está no lockfile. |
| Standard findings zerados | [Painel de qualidade](https://github.com/ifpebj-ti/lab-solos/security/quality), conferido após a análise do commit integrado: Maintainability e Reliability com nota Excellent e zero achados. |
| 18 checks aprovados | Conjunto de checks da revisão final do PR #458; [Container CI](https://github.com/ifpebj-ti/lab-solos/actions/runs/42881776130). O número não representa somente os jobs desse workflow. |
| Testes aprovados | 870 frontend, 438 backend, 239 E2E de autenticação/interface e 5 E2E de segurança no navegador. Os 438 casos incluem testes com PostgreSQL. |
| Imagens sem HIGH/CRITICAL | Quatro scans Trivy da revisão final: frontend/backend em amd64/arm64. Isso não significa ausência de achados de todas as severidades ou prova de ausência de vulnerabilidades desconhecidas. |
| Release publicada | [Release 2.7.5](https://github.com/ifpebj-ti/lab-solos/releases/tag/2.7.5), publicada em 10/11/2026. A publicação não comprova a atualização ou a homologação do ambiente de produção. |

As consultas de segurança são preservadas em [seguranca.json](seguranca.json), com data e referência. Nenhuma regra foi desativada e nenhum alerta foi dispensado para obter os resultados apresentados.

As **duas sugestões em AI findings** pertencem a uma lista separada e continuam pendentes. Por isso o texto não afirma que todas as áreas do GitHub Security estão vazias.

## Detalhamento complementar da entrega

- Validação de identificadores inteiros positivos Int32 nas URLs de produtos e empréstimos, inclusive mutações e identificador do aprovador.
- Consulta da identidade autenticada antes da validação do corpo em notificações, preservando a autorização por notificação no serviço.
- Atualização de follow-redirects, Zod, Vite, Vitest/Mocker e minimatch; runtime ASP.NET 8.0.34 e SDK 8.0.428 fixados com digests multiarch.
- Tratamento de achados de qualidade em filtros, condições, exceções e testes; uso de builder Buildx isolado para os E2E.

Detalhamento e relação dos 31 achados no [relatório versionado do LabOn](https://github.com/ifpebj-ti/lab-solos/blob/09d9b419d2df21cbc3c27e0704fa90d9ef621777/docs/security/2026-11-10.md).

## Continuação dos fluxos da semana anterior

O [mapa de 04/11](../2026-11-04/fluxos-atuais.md) organiza o sistema em seis fluxos. A apresentação anterior demonstrou **1. Acesso e cadastro** e **2. Empréstimo e devolução**. Esta apresentação continua com **3. Materiais e estoque**. Os fluxos 4, 5 e 6 ficam para próximas demonstrações.

Não se trata de um novo módulo de estoque implementado nesta semana. É a apresentação de uma jornada que já existe na interface atual, com roteiro e limites em [fluxo-materiais.md](fluxo-materiais.md).

## Procedência da demonstração

As seis capturas mostram a interface real do frontend, compilada para produção a partir do commit `09d9b419d2df21cbc3c27e0704fa90d9ef621777`, com sessão e dados sintéticos. As respostas de API são simuladas em memória, seguindo os contratos encontrados no código. O serviço Docker não ficou disponível durante a preparação.

O GIF é uma sequência das seis capturas, com reprodução explícita. Não é gravação contínua nem demonstra persistência, autorização de backend ou operação em produção. Nenhuma conta ou estoque de produção foi alterado.

Consulte o [manifesto e os hashes](../../screenshots/2026-11-11/capturas.json) e a [procedência das mídias](../../screenshots/2026-11-11/README.md).

## Verificação da apresentação

Com o servidor em `http://127.0.0.1:5174`:

```bash
npm run lint
npm run build
node scripts/verify-presentation.mjs
```

O verificador existente percorre as semanas, confere navegação, imagens, links de procedência, reprodução/parada do GIF e layout em desktop e celular. Os resultados da preparação são registrados no README do projeto.
