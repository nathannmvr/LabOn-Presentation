# Fluxo 3 — Materiais e estoque

Preparado em 10/11/2026 para a apresentação de 05 a 11/11/2026. Continuação do mapa funcional da semana anterior, cujos fluxos 1 e 2 já foram apresentados.

## Objetivo e participantes

O Administrador cadastra uma vidraria, confirma sua presença no catálogo, consulta os detalhes, edita os dados e confere o resultado. Mentor e Mentorado possuem consultas próprias; a demonstração não lhes atribui permissão administrativa de cadastro ou edição.

## Exemplo sintético

- Material: **Béquer de vidro 250 mL**, do tipo Vidraria.
- Fornecedor: Fornecedor demonstrativo.
- Cadastro: quantidade 10, mínimo 2, localização Armário A · prateleira 2.
- Edição: quantidade 12, mínimo 3, localização Armário B · prateleira 1.

As quantidades ilustram os campos da interface e o estado da API simulada. Não representam movimentação de estoque real, contagem física, empréstimo ou transferência InterLab.

## Roteiro dos seis passos

| Passo | Ação observada na interface | Evidência |
| --- | --- | --- |
| 1 | Produtos > Adicionar; selecionar a aba Vidrarias. | `materiais-01-tipo.png` |
| 2 | Preencher nome, fornecedor, quantidade, mínimo, capacidade e localização; selecionar o material e revisar antes de Adicionar. | `materiais-02-dados.png` |
| 3 | Após a confirmação de cadastro, consultar Produtos > Meus Produtos e conferir a linha com quantidade 10. | `materiais-03-catalogo.png` |
| 4 | Abrir a linha do material e conferir os detalhes e a ação Editar Produto. | `materiais-04-detalhe.png` |
| 5 | No modal, ajustar quantidade, mínimo e localização; revisar antes de Salvar Alterações. | `materiais-05-edicao.png` |
| 6 | Após a confirmação, abrir e recarregar a pesquisa; conferir a quantidade 12 retornada pelo cenário simulado. | `materiais-06-confirmacao.png` |

## Regras e limites preservados

- A interface oferece Químicos, Vidrarias e Outros. Este caso detalha somente Vidrarias, com capacidade de 250 mL.
- O código do backend exige autorização administrativa nos endpoints de criação e atualização de produtos. A captura não executa esse backend nem constitui teste dessa autorização.
- O formulário envia o cadastro e, após sucesso, é limpo. A consulta posterior permite conferir o resultado; uma falha de rede não autoriza repetir cegamente o cadastro.
- A edição envia operações JSON Patch somente para os campos alterados. O roteiro verifica quantidade, mínimo e localização.
- A consulta após recarregar verifica o estado mantido pelo cenário de API em memória; não comprova persistência no PostgreSQL.
- A edição direta de quantidade não é apresentada como uma jornada completa de movimentação de lotes, nem como entrada de uma transferência InterLab. Lotes não são detalhados nesta demonstração.
- O botão Cancelar não faz parte do roteiro. Não se afirma um comportamento de cancelamento ou navegação que não foi demonstrado.

## Fontes do código

Revisão da interface: `09d9b419d2df21cbc3c27e0704fa90d9ef621777`, já integrada à main.

- `frontend/src/pages/insert/Register.tsx`.
- `frontend/src/components/global/forms/create/FormVidraria.tsx`.
- `frontend/src/components/screens/SearchMaterialComponent.tsx` e `VerificationPage.tsx`.
- `frontend/src/components/modals/ProductEditModal.tsx`.
- `frontend/src/integration/Product.ts`.
- `backend/LabSolos-Server-DotNet8/Controllers/ProdutosController.cs`.
- `backend/LabSolos-Server-DotNet8/DTOs/Produtos/AddProdutoDTO.cs` e `ProdutoDTOPatchRequest.cs`.
- `docs/manual/administrador.md`, jornada J07.

## Reprodução das mídias

Prepare uma cópia do frontend na revisão indicada e execute sua build de produção em `127.0.0.1:4173`. No repositório da apresentação, configure `LAB_SOLOS_ROOT` para essa cópia e rode:

```bash
node scripts/capture-2026-11-11.mjs
python scripts/animate-2026-11-11.py
```

O script de captura só aceita endereço local, intercepta as chamadas de API e verifica o cadastro, as operações de edição e o saldo final do cenário. A senha sintética de preparação não é salva no manifesto.
