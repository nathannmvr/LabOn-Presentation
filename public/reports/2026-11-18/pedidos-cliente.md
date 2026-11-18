# Pedidos do cliente — cadastro, listagem e alertas

Apresentação da semana de 12 a 18 de novembro de 2026. Este documento registra os pedidos recebidos; não indica se já foram implementados.

## Cadastro de produtos

### Químicos

- Oferecer a opção de aplicar subscrito à fórmula química, escolhida pelo usuário. Não converter números automaticamente.
- Substituir CATMAT por peso molecular.
- Renomear Fornecedor para Marca.
- Remover “Indefinido” das opções do grupo.
- Melhorar a seleção do ano nas datas de fabricação e validade e permitir digitar a data.
- Exibir datas no padrão `dd/mm/aaaa`.
- Permitir registrar uma validade anterior ao dia atual. Quando o produto for identificado como vencido, perguntar em uma confirmação se o usuário deseja adicioná-lo mesmo assim.

### Vidrarias

- Remover o campo de altura.
- Trocar Formato por Categoria.

## Listagem e alertas

- Alertar quando a quantidade atual estiver abaixo da quantidade mínima.
- Exibir na lista de produtos um indicador de alerta com triângulo e exclamação.
- Mostrar na aba Alertas apenas produtos em alerta por validade ou por estoque abaixo do mínimo.
- Exibir quantidades de vidraria na unidade, sem convertê-las para litros.
- Montar o nome exibido da vidraria com seu nome e capacidade em mL.
