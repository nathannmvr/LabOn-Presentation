---
name: LabOn Presentation
description: Pôster acadêmico claro para apresentar entregas verificáveis em projetor.
colors:
  institutional-green: "#135b2d"
  charcoal-ink: "#182727"
  paper: "#f8f8f8"
  muted-ink: "#52605b"
  hairline: "#c8d1cb"
typography:
  display:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "clamp(60px, 11.6vw, 194px)"
    fontWeight: 800
    lineHeight: 0.99
    letterSpacing: "-0.048em"
  headline:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "clamp(42px, 4.2vw, 72px)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "clamp(17px, 1.25vw, 22px)"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Albert Sans, sans-serif"
    fontSize: "clamp(13px, 1vw, 17px)"
    fontWeight: 700
    letterSpacing: "0.045em"
components:
  nav-button:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    padding: "8px"
  nav-button-hover:
    textColor: "{colors.institutional-green}"
  report-selector:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal-ink}"
    padding: "6px 2px"
---

# Design System: LabOn Presentation

## Overview

**Creative North Star: "Pôster de Congresso"**

O sistema trata cada entrega como um pôster acadêmico projetado: assunto, números e evidência recebem escala, enquanto o campo claro dá tempo para a leitura à distância. A voz visual é precisa e sóbria, com hierarquia forte e poucos sinais institucionais.

O conteúdo se organiza por espaço e regras finas. O verde marca números, fontes e ação; as capturas mantêm suas cores e ocupam uma grande área útil. O painel escuro com cartões e bordas luminosas foi abandonado na direção aprovada.

**Key Characteristics:**

- Campo claro contínuo, tinta carvão e verde institucional com uso contido.
- Títulos pesados, números grandes e linhas curtas de texto para projeção.
- Evidências amplas, com fonte verificável e opção de ampliar capturas.
- Navegação discreta, contador legível e movimento horizontal breve.

## Colors

A paleta usa um único acento institucional sobre papel quase branco; as capturas preservam suas cores próprias.

### Primary

- **Verde institucional** (`#135b2d`): números de capa e evidência, indicadores, links de fonte, regras de destaque, controles em hover e foco visível.

### Neutral

- **Carvão** (`#182727`): texto principal, marca e controles em repouso.
- **Papel claro** (`#f8f8f8`): campo contínuo da apresentação e painéis de evidência.
- **Tinta secundária** (`#52605b`): legendas, contexto e texto de apoio.
- **Linha suave** (`#c8d1cb`): divisórias e borda do seletor, sem formar cartões decorativos.

**The One Accent Rule.** Reserve o verde para hierarquia, prova e interação; ele não preenche grandes blocos.

## Typography

**Display Font:** Albert Sans (fallback sans-serif)  
**Body Font:** Albert Sans (fallback sans-serif)

**Character:** Uma família sem serifa sustenta tanto a escala de cartaz quanto os detalhes. Peso alto e números tabulares criam leitura estável no projetor.

### Hierarchy

- **Display** (800, `clamp(60px, 11.6vw, 194px)`, 0.99): título de capa no layout acima de 640px; no celular, `clamp(37px, 9.6vw, 62px)` e altura de linha 1.04.
- **Headline** (800, `clamp(42px, 4.2vw, 72px)`, 1.02): título de detalhe; reduz para `clamp(34px, 9vw, 50px)` no celular.
- **Body** (400, `clamp(17px, 1.25vw, 22px)`, 1.4): descrição do detalhe, limitada a 38ch.
- **Label** (700, `clamp(13px, 1vw, 17px)`, espaçamento 0.045em): seção e índice antes do título.
- **Metric** (800, `clamp(80px, 10vw, 170px)` na capa acima de 640px): números verdes alinhados, com algarismos tabulares.

**The Projected Readability Rule.** Títulos e métricas dominam a distância; explicações permanecem curtas e subordinadas à evidência.

## Layout

O palco ocupa 100dvh e cada slide ocupa a largura e a altura disponíveis. Uma regra verde vertical fica perto da borda esquerda. Marca e seletor ficam no topo; contador e controles ficam no canto inferior direito. A capa usa título largo na metade superior e três números separados por linhas na metade inferior.

Slides de detalhe usam duas colunas, `minmax(0, .86fr) minmax(0, 1.14fr)`, com vão de 4.3vw: texto à esquerda, captura ou painel de evidência à direita. A captura comum tem altura máxima de 61vh; comparações chegam a 53vh. A coluna de texto pode rolar quando necessário.

Até 900px, títulos e textos de detalhe diminuem e o vão passa a 3vw. Até 640px, detalhes empilham texto e visual, o palco deixa 62px para uma barra de controles inferior e a página pode rolar. A capa empilha as métricas em linhas e permite quebra no título. A tela cheia some dos controles móveis. A transição horizontal usa 420ms com `cubic-bezier(.2,.8,.2,1)` e desaparece com preferência por movimento reduzido.

## Elevation & Depth

O sistema é plano por padrão. Espaço, escala e linhas finas separam regiões; apenas capturas de tela ganham uma elevação suave para distingui-las do papel.

### Shadow Vocabulary

- **Captura elevada** (`0 13px 35px rgba(26,49,31,.12)`): sombra exclusiva da moldura de screenshot.

**The Evidence Lift Rule.** A elevação identifica a captura; texto, métricas e painel de evidência permanecem planos.

## Shapes

A geometria é retangular: controles transparentes, painéis sem cantos arredondados e linhas de 1px. A moldura de captura tem borda fina (`#cbd2ce`) e uma faixa de navegador; os pequenos pontos dessa faixa são círculos. Recortes vêm do palco e da moldura da imagem, sem ornamentação adicional.

## Components

### Buttons

- **Shape:** Controles de navegação sem fundo e sem borda, com área interna de 8px.
- **Default:** Ícone em carvão sobre o papel.
- **Hover / Focus:** Hover verde; foco visível com contorno verde de 3px e afastamento de 4px.
- **Disabled:** Opacidade 0.3 e cursor padrão. O botão de tela cheia desaparece até 640px.

### Inputs / Fields

- **Style:** Seletor de relatório transparente, texto carvão, apenas borda inferior suave e padding `6px 2px`; largura máxima de 270px no desktop e 174px no celular.
- **Focus:** Contorno verde global de 3px com afastamento de 4px.

### Navigation

- **Style:** Marca pequena à esquerda, seletor de entrega à direita, contador com algarismos tabulares e setas discretas no rodapé.
- **Mobile:** Barra inferior de 62px separada por uma linha suave; navegação mantém avanço e retorno.

### Screenshot Frame

Moldura branca com borda fina, faixa de navegador de 24px e sombra suave. A imagem conserva proporções (`object-fit: contain`) e pode ser aberta para ampliação. Legenda, dica de ampliação e link de fonte acompanham o visual.

### Evidence Panel

Painel plano com regra verde superior e linha suave inferior. O número principal cresce até `clamp(68px, 7.5vw, 125px)` e os detalhes formam duas colunas com separadores finos; o link para a fonte fica na linha superior.

## Do's and Don'ts

### Do:

- **Do** dar ao título, às métricas e à captura escala suficiente para uma apresentação projetada.
- **Do** manter links de fonte e legendas junto da evidência apresentada.
- **Do** usar verde em números, regras e estados interativos com moderação.
- **Do** respeitar o empilhamento e a barra de navegação de 62px até 640px.

### Don't:

- **Don't** reintroduzir o painel escuro com cartões ou bordas luminosas rejeitado na direção aprovada.
- **Don't** colocar sombras em painéis de texto ou métricas; a sombra observada pertence à captura.
- **Don't** comprimir as capturas em miniaturas quando houver espaço útil para exibi-las amplamente.
