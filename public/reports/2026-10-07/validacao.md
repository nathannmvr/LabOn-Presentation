# Validação dos relatórios de segurança do LabON

Data: 07/10/2026 (America/Sao_Paulo).
Alvo avaliado: https://labon.nmvr.me/.
Relatórios de origem: avaliação sem autenticação de 01/10/2026 e avaliação autenticada de 02/10/2026, fornecidos pelo solicitante.

Repositório correto: [ifpebj-ti/lab-solos](https://github.com/ifpebj-ti/lab-solos). A pasta inicialmente aberta, MakerVerse-Vite, pertence a outro produto e não recebeu issues nem alterações de código.

Código de referência: main no commit `8497a95716cf0c00cbf9b3ef9371c2a845c26856`, consultado no remoto em 07/10/2026. A correspondência exata entre esse commit e o deployment não foi comprovada.

## Resultado

Foram abertas cinco issues com evidências, prioridade ajustada e critérios de aceite. Há três problemas principais confirmados no escopo: autorização por recurso, ausência de limitação de login no código e ausência de CSP. Além deles, foram registrados proteção contra abuso do reset, identificada na revisão, e restrição de CORS como defesa em profundidade de baixa prioridade.

| Issue | Correção | Prioridade | Base da confirmação |
| --- | --- | --- | --- |
| [#436](https://github.com/ifpebj-ti/lab-solos/issues/436) | Autorizar leitura, listagem e alteração de usuários por recurso | Alta | Código atual e evidência histórica do relatório; reprodução autenticada atual pendente |
| [#437](https://github.com/ifpebj-ti/lab-solos/issues/437) | Limitar tentativas de login | Alta | Ausência de controle no código; amostra limitada de produção compatível |
| [#438](https://github.com/ifpebj-ti/lab-solos/issues/438) | Limitar solicitações e tentativas de recuperação | Média | Código atual; sem teste de inundação ou envio para contas reais |
| [#439](https://github.com/ifpebj-ti/lab-solos/issues/439) | Adicionar CSP compatível com o frontend | Média | Ausência confirmada no HTML/headers de produção e no Caddyfile |
| [#440](https://github.com/ifpebj-ti/lab-solos/issues/440) | Restringir origens CORS | Baixa | Wildcard reproduzido; roubo de token da vítima não demonstrado |

## Classificação de cada achado original

N = relatório sem autenticação; A = relatório autenticado.

| Achado | Veredito | Justificativa e tratamento |
| --- | --- | --- |
| N 3.1 — segredos em /env.js | **Falso positivo na evidência atual** | GET retornou somente `window.env = { VITE_API_URL: 'https://labon.nmvr.me/api/' };`. O template versionado também contém apenas a URL. Não há credenciais, chaves privadas ou URL interna no arquivo observado. Usar configuração pública em runtime é válido. Isso não prova que todas as demais superfícies estejam livres de segredos. |
| N 3.2 — ausência de CSP | **Confirmado, severidade exagerada** | O header e uma meta CSP estão ausentes. É defesa em profundidade faltante; não demonstra injeção de script nem XSS explorável. Issue #439, média. |
| N 3.3 — ausência de X-XSS-Protection | **Falso positivo como vulnerabilidade** | Header obsoleto; habilitar o filtro legado pode introduzir problemas. Priorizar CSP; não implementar a sugestão `1; mode=block` por padrão. |
| N 3.4 — Via revela Caddy | **Informativo** | Header observado, sem versão. Não há exploração ou segredo demonstrado. Remoção opcional, sem issue de correção. |
| A 3.1 — IDOR em GET /api/Usuarios/{id} | **Confirmado no código atual** | Só há autorização genérica e busca pelo ID recebido; falta verificação de proprietário/relacionamento. A evidência de produção do relatório é histórica. A conta fornecida retorna 401 atualmente. Issue #436 também cobre listagem por tipo e PATCH com a mesma falha. |
| A 3.2 — CORS wildcard | **Configuração confirmada; exploração alta não comprovada** | Origem arbitrária recebeu wildcard no preflight. Isso não disponibiliza automaticamente o bearer de outra pessoa, nem permite ler cookies de outra origem. Sem prova de exposição cross-origin de dados da vítima, é reforço de segurança de prioridade baixa, issue #440. |
| A 3.3 — falta de rate limiting de login | **Confirmado no código; alcance externo não determinado** | Controller e pipeline não têm limiter, throttling ou lockout equivalente. Três tentativas inválidas receberam 401 sem atraso perceptível, mas amostra pequena não exclui controles externos ou limites maiores. Issue #437. |
| A 3.4 — ausência de proteção CSRF | **Falso positivo para a API bearer descrita** | Backend autentica pelo header Authorization, sem autenticação via cookie configurada. O navegador não copia um JWT de cookie/armazenamento para esse header por usar `credentials: 'include'`. Ausência de token anti-CSRF não demonstra ataque nesse fluxo. Reavaliar se a API passar a aceitar cookies como credencial. |
| A 3.5 — IDs sequenciais | **Facilitador da falha de autorização; não independente** | IDs previsíveis simplificam enumeração quando o endpoint já revela terceiros. UUIDs não resolvem autorização ausente. Tratar com #436; não abrir migração de IDs como requisito de segurança. Lacunas na sequência também impedem inferir contagem exata de usuários. |
| A 3.6 — claims legíveis no JWT | **Falso positivo como apresentado** | JWT assinado normalmente é legível. Role, sub, session_version, jti e datas não são senhas/segredos. Email é dado pessoal e pode ser minimizado, mas o relatório não mostra acesso indevido ao token. Não remover iss/aud: o backend os valida. Não há evidência de bypass de assinatura. |
| A 3.7 — rotas SPA retornam 200 | **Falso positivo como apresentado** | /admin entrega o mesmo shell da SPA, sem dados privados embutidos. Código de interface público não demonstra acesso à API. Existem rotas privadas por papel no frontend e políticas no backend; os erros reais de autorização são os endpoints da #436. SSR e code splitting não são requisitos para corrigir autorização. |
| A 3.8 — reset retorna 202 para inexistentes | **Falso positivo na alegação de enumeração por status** | Status e mensagem neutros são intencionais. O código já verifica conta habilitada antes de emitir token/enviar. Não foi demonstrada diferença de resposta que identifique contas pelo status. Encontrou-se, separadamente, falta de controle de abuso, issue #438. Timing e fluxo completo por e-mail não foram validados. |

## Evidências coletadas em produção

Testes de baixo volume, em 07/10/2026:

- GET /: 200, HTML da SPA, sem Content-Security-Policy e sem meta CSP. HSTS, X-Frame-Options, X-Content-Type-Options e Referrer-Policy presentes.
- GET /env.js: 200, 64 bytes, somente a URL pública da API. Nenhum segredo no conteúdo observado.
- GET /admin: 200 com o shell HTML da SPA; isso não constitui leitura de dados administrativos.
- GET /api/Usuarios/1 sem Authorization: 401.
- Login com a credencial fornecida: 401. Não houve token válido disponível para repetir acessos autenticados a perfis de terceiros.
- OPTIONS /api/auth/login com origem `https://security-validation.invalid`, método POST e headers content-type/authorization: 204, Access-Control-Allow-Origin: *, métodos/headers solicitados permitidos.
- Três logins inválidos para identificador fictício: 401, cerca de 0,17 s por tentativa, sem Retry-After. Não foi executado brute force.
- Uma solicitação de reset para endereço fictício inexistente: 202 com mensagem neutra. Nenhum reset de conta real foi solicitado.
- Bundle JavaScript público contém uso de cookie doorKey, definição de cookie e Authorization/Bearer. O código-fonte confirma armazenamento via js-cookie, com SameSite Strict e Secure em HTTPS.

Nenhum perfil, senha ou permissão foi alterado. Não foram feitas varreduras de IDs, testes de carga, manipulação de contas reais ou disparos de e-mail em massa.

## Correções às recomendações dos relatórios

1. **Ausência de Set-Cookie não significa ausência de cookies.** O frontend define doorKey, rankID e level via JavaScript. Portanto, a afirmação de token somente em memória é incorreta. O backend, porém, usa bearer no header e não extrai token desses cookies, mantendo a conclusão de CSRF acima.
2. **Não diferenciar usuário inexistente e senha incorreta.** Isso facilitaria enumeração. Preservar mensagens genéricas.
3. **Não remover issuer/audience do JWT sem redesenhar a validação.** O código atual usa ambos como critérios de aceitação.
4. **Não exigir remoção de env.js ou troca para import.meta.env para ocultar valores públicos.** Ambos chegam ao navegador; o critério é não incluir segredos.
5. **Não confundir CSP ausente com XSS comprovado.** Há uma proteção complementar faltante, com prioridade proporcional.
6. **Não adicionar AllowCredentials como parte automática da correção CORS.** O fluxo atual usa bearer explícito; permitir cookies cross-origin requer análise própria.
7. **Refresh tokens, UUIDs, SSR, code splitting e Permissions-Policy não são falhas comprovadas nestes relatórios.** Podem ser decisões de produto/arquitetura ou melhorias independentes.
8. **Timing de recuperação permanece não comprovado.** O código executa caminhos diferentes e envio síncrono; a issue #438 pede avaliação sem classificar enumeração temporal como confirmada.

## Referências técnicas

- [OWASP IDOR Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html): autorização por objeto continua necessária mesmo com identificadores difíceis de adivinhar.
- [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html): proteção de login e mensagens genéricas.
- [OWASP Forgot Password](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html): respostas consistentes e proteção contra solicitações excessivas.
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html): credenciais automáticas e proteção de APIs.
- [OWASP HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html): recomendações atuais, incluindo limitações de X-XSS-Protection.
- [OWASP CSP](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html): defesa complementar e implantação de políticas.
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS): origens, preflight e credenciais.
- [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html): estrutura de JWT e claims registradas.
- [Vite — Env Variables and Modes](https://vite.dev/guide/env-and-mode): variáveis expostas ao cliente permanecem visíveis no bundle.

As issues publicadas não contêm credenciais, tokens ou dados pessoais dos relatórios. Este documento também omite esses dados.
