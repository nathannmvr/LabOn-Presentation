# Fluxos principais do LabOn atual

Preparado em 03/11/2026 para a apresentação de 15/10 a 04/11/2026.

## Divisão funcional

Esta divisão organiza as jornadas existentes para apresentação aos professores. Não representa módulos novos implementados.

| Fluxo | Participantes e entrada | Decisões e resultado |
| --- | --- | --- |
| 1. Acesso e cadastro | Visitante solicita uma conta; responsável analisa o vínculo. | Aprovar ou recusar; pessoa habilitada entra na área do seu perfil. |
| 2. Empréstimo e devolução | Mentor seleciona material e envia solicitação. | Administrador decide, estoque diminui na aprovação e a devolução integral recompõe o saldo. |
| 3. Materiais e estoque | Administrador cadastra ou edita químicos, vidrarias, outros materiais e lotes. | Manter características e saldos da operação interna. |
| 4. Consulta e acompanhamento | Perfis autorizados pesquisam materiais e consultam detalhes; administração acompanha alertas. | Identificar disponibilidade, informações e histórico no alcance do perfil. |
| 5. Equipe e turma | Administrador consulta usuários; mentor acompanha seus dependentes. | Consultar vínculos, perfis e habilitação dentro das permissões atuais. |
| 6. Conta e credenciais | Pessoa consulta seu perfil, altera ou recupera senha e encerra sessão. | Manter acesso e credenciais, com recuperação e troca conforme as regras atuais. |

A apresentação detalha os fluxos 1 e 2. Os demais aparecem no mapa funcional, sem sugerir uma demonstração completa de suas telas. Auditoria não é apresentada como jornada operacional completa apenas porque há uma entrada de menu.

## Natureza das capturas

Os prints mostram componentes reais do frontend atual do repositório `lab-solos`, compilados para produção e executados localmente com `vite preview` em 03/11/2026. A revisão exata e os arquivos compilados constam em `screenshots/2026-11-04/capturas.json`.

As mídias foram recapturadas com a build de produção para corrigir uma diferença em relação ao servidor de desenvolvimento, que ainda exibia a ilustração legada da Home. A apresentação acompanha o comportamento da versão publicada, na qual o caminho antigo dessa imagem não está disponível. O script impede novas capturas feitas pelo servidor de desenvolvimento; não há manipulação da imagem ou aplicação de estilos para ocultar a ilustração.

O serviço Docker não estava disponível no ambiente. As chamadas de API foram interceptadas por um cenário sintético com estado em memória, seguindo os contratos e os comportamentos encontrados no código e nos testes. Não foram criadas contas nem alterados estoques reais. As capturas não comprovam autorização do backend, persistência, concorrência ou funcionamento em produção.

Os GIFs são sequências animadas das capturas dos passos, com 2,2 segundos por quadro. Não são gravações contínuas de vídeo. A apresentação oferece reprodução explícita e parada para evitar movimento automático durante a explicação. Os PNGs originais podem ser ampliados.

Nomes, contatos, instituição, produto, quantidades e sessões são demonstrativos. E-mails usam `example.invalid`. As senhas sintéticas aparecem mascaradas nos formulários e não constam no manifesto das capturas.

## Fluxo 1 — Cadastro e aprovação de acesso

O caso demonstrado é o de um **Mentorado aprovado pelo Mentor responsável**. Não substituir essa regra atual pela proposta futura de admissão de equipes por laboratório.

| Passo | Participante e ação | Resultado esperado da interface | Print |
| --- | --- | --- | --- |
| 1 | Visitante abre o login e usa “Crie a sua agora.”. | Abre criação de conta. | `acesso-01-login.png` |
| 2 | Seleciona Mentorado, preenche dados pessoais/acadêmicos e e-mail do mentor, confirma senha e envia “Criar Conta”. | Submete o cadastro ao responsável. | `acesso-02-cadastro.png` |
| 3 | Observa a confirmação e aguarda aprovação. | Mensagem “Cadastro submetido à aprovação!” e retorno ao login. | `acesso-03-pendente.png` |
| 4 | Mentor entra e abre `/mentor/users-request`. Confere pessoa, e-mail e instituição. | Solicitação vinculada aparece na fila. | `acesso-04-analisar.png` |
| 5 | Mentor usa o controle de aprovar. | Confirmação “Solicitação aceita” e remoção da fila pendente. | `acesso-05-aprovado.png` |
| 6 | Mentorado volta ao login e entra com a conta aprovada. | Acesso a `/mentee/`, com opções do perfil. | `acesso-06-habilitado.png` |

Regras observadas: cadastro não habilita automaticamente a conta; responsável precisa existir; mentor decide solicitações vinculadas; autenticação aceita usuário habilitado. No roteiro, o login inicial dos operadores é preparação de cada papel. Não foi simulada uma aprovação institucional InterLab, que pertence ao planejamento futuro.

## Fluxo 2 — Solicitação, aprovação e devolução de empréstimo

Exemplo sintético: **10 béqueres de vidro de 250 mL, solicitação de 2 unidades, saldo 8 após aprovação e 10 após devolução integral**. Os números demonstram o comportamento encontrado no código, sem representar medição de estoque real.

| Passo | Participante e ação | Resultado da interface e cenário | Print |
| --- | --- | --- | --- |
| 1 | Mentor abre a pesquisa de materiais. | Material disponível com 10 unidades. | `emprestimo-01-catalogo.png` |
| 2 | Em `/mentor/loan/creation`, seleciona utilizador, Vidraria, item, quantidade 2 e Unidade. | Dados preparados no formulário. | `emprestimo-02-selecao.png` |
| 3 | Usa “Adicionar” e confere a lista de produtos selecionados. | Item revisável antes de enviar. | `emprestimo-03-revisao.png` |
| 4 | Usa “Solicitar Empréstimo”. | Confirmação de envio, estado pendente e saldo ainda 10. | `emprestimo-04-enviado.png` |
| 5 | Consulta o detalhe em `/mentor/history/loan?id=701`. | Tela “Histórico de Empréstimo - Pendente”, com solicitante, material e quantidade do pedido. | `emprestimo-05-pendente.png` |
| 6 | Administrador entra e abre `/admin/loans-request`. | Pedido na fila de decisões. | `emprestimo-06-analisar.png` |
| 7 | Abre o detalhe pela linha da solicitação. | Identificação, material e quantidade para conferência. | `emprestimo-07-detalhe.png` |
| 8 | Retorna à fila e aprova, depois consulta `/admin/all-loans`. | Estado aprovado, saldo reduzido em 2. | `emprestimo-08-aprovado.png` |
| 9 | Consulta a pesquisa administrativa de materiais. | Saldo de 8 unidades. | `emprestimo-09-saldo.png` |
| 10 | Abre `/admin/return?id=701`. | Tela de devolução com controle “Registrar Devolução”. | `emprestimo-10-devolucao.png` |
| 11 | Registra a devolução integral. | Confirmação “Devolvido” e data de devolução. | `emprestimo-11-devolvido.png` |
| 12 | Consulta novamente o catálogo. | Saldo recomposto de 10 unidades. | `emprestimo-12-reposto.png` |
| 13 | Abre `/admin/history/loan?id=701`. | Histórico final com identificação da devolução. | `emprestimo-13-historico.png` |

### Limites atuais conservados na demonstração

- O formulário exige selecionar um utilizador, mas o envio contém `diasParaDevolucao` e os produtos, sem identificador do utilizador selecionado. O backend registra o solicitante pela sessão. Por isso o exemplo registra a mentora autenticada como solicitante, e não atribui falsamente o empréstimo ao mentorado selecionado.
- A interface envia atualmente um prazo de cinco dias. Não foi demonstrado um seletor de prazo que não existe nesse formulário.
- A aprovação atual é administrativa e desconta estoque nesse momento. Não há demonstração de reserva InterLab nem baixa posterior na saída como funcionalidade já entregue.
- A tela de devolução possui chaves e justificativas por item, mas esses valores não seguem no método atual de devolução. O exemplo usa devolução integral e não promete devolução parcial ou tratamento persistido de avaria.
- Na tela específica `ReturnLoan`, a coluna Quantidade usa o saldo atual do produto, não a quantidade emprestada. No exemplo ela pode mostrar 8, enquanto o histórico do empréstimo registra 2. O slide expõe essa limitação.
- A devolução mantém o estado `Aprovado` e registra `dataDevolucao`; a interface identifica a situação como devolvida. Não foi inventado um estado persistido `Devolvido`.
- O backend também admite Mentor na devolução conforme suas condições de autorização. O caso demonstrado usa Administrador e não afirma exclusividade administrativa dessa ação na API.

Esses limites foram encontrados por leitura de código. Não foram corrigidos nesta tarefa, cujo escopo é a apresentação.

## Fontes locais

- `docs/manual/perfis-e-permissoes.md`, `docs/manual/acesso-e-conta.md`, `docs/manual/mentor.md`, `docs/manual/mentorado.md` e `docs/manual/administrador.md`.
- `frontend/src/pages/CreateAccount.tsx`, `RegistrationRequests.tsx`, `Login.tsx` e `frontend/src/integration/Auth.ts` e `Class.ts`.
- `frontend/src/pages/mentor/LoanCreation.tsx`, `frontend/src/pages/admin/LoansRequest.tsx`, `AllLoans.tsx`, `ReturnLoan.tsx`, `frontend/src/pages/loan/LoanHistory.tsx` e `frontend/src/integration/Loans.ts`.
- `backend/LabSolos-Server-DotNet8/Controllers/AuthController.cs`, `UsuariosController.cs` e `EmprestimosController.cs`.
- `frontend/e2e/critical/registration-approval.spec.ts`, `loans.spec.ts` e `frontend/e2e/responsive-layout.spec.ts`. A consulta desses testes não significa que eles tenham sido executados nesta tarefa.

## Reprodução

Com a build de produção do frontend local do `lab-solos` servida por `vite preview` em `127.0.0.1:4173` e as dependências dos dois repositórios disponíveis:

```bash
node scripts/capture-2026-11-04.mjs
python scripts/animate-2026-11-04.py
```

A primeira etapa captura as interações e gera o manifesto; a segunda codifica os GIFs a partir dos PNGs. Preparar antes o frontend com `npm run build` e `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`, no diretório `lab-solos/frontend`. O script de captura recusa um destino que não seja local e um frontend servido em modo de desenvolvimento. Para verificar a apresentação, execute `npm run lint`, `npm run build` e `node scripts/verify-presentation.mjs` com a apresentação em `127.0.0.1:5174`.
