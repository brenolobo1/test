# PC Booster — protótipo clicável

Protótipo de baixa fidelidade da seção **PC Booster** do app desktop da ExitLag.
Dados 100% mockados, nenhuma alteração real de sistema. Serve para validar o **fluxo**,
não o acabamento visual.

## Como rodar

Abra `index.html` no navegador (duplo clique já funciona), ou sirva a pasta:

```bash
python3 -m http.server 8000   # http://localhost:8000/pc-booster/
```

## Fluxo coberto

1. Resumo de hardware detectado (CPU / GPU / Memória), com badge **Otimizado / Não otimizado** e
   entrada para o drawer de **otimização de sistema** (escopo: máquina inteira — tier de otimização
   do sistema + perfil de driver GPU global, com seu próprio toggle e reversão)
2. Lista de 4 jogos instalados com status: *roda bem* / *otimização recomendada* / *abaixo do recomendado*
3. Alerta de hardware com **3 níveis de gravidade** (leve / moderado / severo) + tabela comparativa no formato de tiers do PCGamingWiki
4. Toggle de otimização por jogo, cobrindo as **duas camadas**: config de engine (Unreal/Unity) e perfil de driver GPU
5. "O que foi ajustado" — conteúdo real do THE FINALS + ganho de GPU Clock (210 MHz → 2805 MHz)
6. Reversão — **Direção A**: botão "Restaurar configuração original", por jogo e global (sem histórico/timeline)

## Painel de teste (fora do protótipo)

A barra listrada no topo **não faz parte da interface**. Serve para comparar as 3 direções de navegação:

| Modo | Como funciona |
|---|---|
| **A · Tela cheia** | Clicar no jogo troca a tela inteira, com botão *Voltar* |
| **B · Drawer lateral** | O jogo abre num painel lateral sobre a lista |
| **C · Card expansível** | O jogo expande inline, tudo numa tela só |

O seletor **Visão** alterna entre o **Protótipo** (o fluxo com dados mockados) e o **Wireframe**
(estudo de estrutura em escala de cinza). No modo Wireframe aparece um segundo seletor:

- **Telas separadas** — as 3 telas lado a lado, 3 alternativas cada, para comparar disposição
- **Conjunto A / B / C** — as três telas montadas na mesma janela: Tela 1 é a base e as Telas 2 e 3
  abrem por cima como drawers. Botões acima da janela abrem e fecham cada drawer.

O seletor de navegação fica desabilitado no modo Wireframe, já que os 3 modos A/B/C estão fora daquele escopo.

O botão *Resetar protótipo* volta todos os toggles ao estado inicial.

## Estudo de wireframe

Estrutura em escala de cinza, com **dois níveis de configuração** explícitos:

- **nível sistema** — vale para a máquina inteira (perfil de GPU global, tiers de sistema operacional)
- **nível jogo** — vale só para aquele jogo (perfil de driver por jogo)
- **config de engine** — global *por engine*, atravessa os dois níveis; cada alternativa a resolve de um jeito

Tela 1 é horizontal; Telas 2 e 3 são verticais. Três disposições por tela:

| Tela 1 · horizontal | Onde vive o nível sistema |
|---|---|
| **1A · Duas faixas** | Sistema é uma faixa acima da lista de jogos — hierarquia explícita |
| **1B · Coluna de sistema** | Coluna de escopo à esquerda, sempre visível; lista à direita |
| **1C · Sistema na lista** | Sistema é a primeira linha da lista, irmão dos jogos |

| Tela 2 · vertical | Como a herança do sistema aparece |
|---|---|
| **2A · Herança etiquetada** | Cada camada carrega a etiqueta do seu escopo, herdadas com fundo hachurado |
| **2B · Dois blocos de escopo** | "Específico deste jogo" separado de "vem do sistema" (read-only) |
| **2C · Escopo sob demanda** | Herança escondida atrás de um bloco expansível |

| Tela 3 · vertical (nova) | Detalhe de hardware |
|---|---|
| **3A · Leitura e depois ajuste** | Specs → configurações de sistema → reversão |
| **3B · Painel de controle** | Controles no topo, specs recolhidas no fim, reversão fixa no rodapé |
| **3C · Config acoplada ao componente** | Cada componente carrega seus próprios controles |

Cada letra também forma um **conjunto coerente** (1A+2A+3A, 1B+2B+3B, 1C+2C+3C), visível na visão de
conjunto com os drawers empilhados sobre a base.

Blocos condicionais têm borda tracejada e chip `condicional`; blocos herdados de outro escopo têm
fundo hachurado; pontos de ação — toggle, botões, chevron — são marcados com chip preenchido; o chip
de contorno indica o **escopo** do bloco.

## Convenções

- **Texto em cinza com sublinhado pontilhado** = placeholder de copy. Nenhum microcopy é definitivo.
- Tag `mock` / `conteúdo não mapeado` = dado que ainda não existe.
- Visual usa os tokens reais do design system (base-700, primary #F52929, breeze, radiance, eclipse, Ubuntu),
  mas o layout é wireframe — sem acabamento.

## Dados mockados

- **Máquina**: i5-13420H · RTX 5060 Laptop 8 GB · **8 GB DDR5** (a memória é o gargalo que gera os 3 níveis de alerta)
- **Jogos**: Escape from Tarkov (severo), THE FINALS (moderado, em execução), Fortnite (leve), Counter-Strike 2 (roda bem)
- **Requisitos**: valores plausíveis no formato minimum/recommended, não extraídos do PCGamingWiki real
- **Ajustes de THE FINALS e GPU Clock**: dados reais do build de teste, os únicos números não inventados

## Decisões de escopo

- O ciclo de vida (aplica ao abrir / reverte ao fechar o jogo) **não** é estado de interface. "Em execução" é
  apenas um atributo dos dados mockados, não uma simulação interativa — o usuário não abre/fecha jogo no protótipo.
- Desligar o toggle produz mensagens diferentes conforme o jogo esteja em execução (reverte agora) ou não
  (não aplica no próximo launch).
- Tiers de otimização de sistema (Tier 1 / Tier 2) não têm controle na UI — não estavam no escopo.

## Estrutura

- `index.html` — shell, tokens e componentes CSS
- `assets/js/data.js` — todos os dados mockados
- `assets/js/app.js` — estado, render e os 3 modos de navegação
- `assets/js/wireframe.js` — estudo de wireframe (blocos, artboards, as 6 disposições)
- `docs/fluxo-pc-booster.md` — especificação do fluxo, autocontida para análise
