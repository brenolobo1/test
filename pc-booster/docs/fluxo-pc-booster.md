# PC Booster — especificação do fluxo (protótipo)

> Documento autocontido para análise. Descreve um protótipo clicável de baixa fidelidade,
> com dados 100% mockados, da seção **PC Booster** do app desktop da ExitLag.
> Nenhuma alteração real de sistema acontece — é simulação visual para validar o fluxo.

---

## 1. Contexto do produto

**ExitLag** é uma ferramenta desktop de otimização de conexão para gamers (reduz ping, jitter e
perda de pacotes roteando o tráfego). O **PC Booster** é uma seção nova, ainda em exploração, que
sai do escopo de rede e entra em otimização de máquina: detecta hardware, classifica os jogos
instalados e aplica otimizações por jogo.

O objetivo deste protótipo é validar **o fluxo**, não o acabamento visual. Toda a microcopy é
placeholder proposital.

### Contexto técnico que o fluxo precisa respeitar

Isso não está no protótipo (que é mockado), mas é o comportamento real já definido pela engenharia:

- **Ciclo de vida automático**: a otimização é aplicada quando o jogo abre e revertida quando o jogo
  fecha. Essa reversão automática é **invisível** para o usuário — não deve virar estado de interface.
- **Duas camadas que podem se sobrepor**:
  1. **Config de engine** — arquivos globais do Unreal/Unity; afeta *todos* os jogos que usam aquela engine.
  2. **Perfil de driver GPU** — via NVIDIA API / AMD ADL; aplicado por jogo ou globalmente.
  As duas disparam no mesmo momento e podem mexer no mesmo atributo (ex.: antialiasing).
  **Ainda não há decisão sobre qual prevalece em caso de conflito.**
- **Tiers de otimização de sistema operacional**: Tier 1 = prioridade de processo elevada (seguro);
  Tier 2 = sistema foca tudo no processo do jogo, tipo "game mode" agressivo (reversível, ganho maior).
- **Reversão em nível de sistema**: construída sobre snapshots transacionais e empilháveis — qualquer
  mudança pode ser revertida isoladamente, por sessão, ou até o estado anterior a qualquer otimização.
- **Fonte de comparação de hardware**: PCGamingWiki, que tem tiers estruturados por jogo
  (minimum / recommended / alt). No produto real precisaria ser cacheado localmente.

### Dados reais medidos (build de teste, não o protótipo)

Existe uma janela "Debug Control" com toggle de config de engine (Apply/Revert) e de perfil de GPU
(Apply/Reset). Resultados reais:

- **GPU Clock: 210 MHz → 2805 MHz** numa NVIDIA GeForce RTX 5060 Laptop, via perfil de driver.
- No **THE FINALS**, a otimização foi **seletiva**: baixou View Distance, Anti-Aliasing, Shadows,
  Post-Processing, Effects e Foliage para Low, Texture para Medium, mas **manteve Reflections em High**.
  Não é um downgrade geral de tudo.

---

## 2. Escopo do protótipo

### Entra
1. Detecção de hardware (mockada) — CPU, GPU, RAM.
2. Lista de jogos instalados (mockada) — 4 jogos, cada um com status.
3. Alerta de hardware abaixo do recomendado, com **3 níveis de gravidade**.
4. Toggle de otimização por jogo, cobrindo as duas camadas (engine + driver GPU).
5. "O que foi ajustado" — lista do que a otimização mudou.
6. Reversão **Direção A**: botão único "Restaurar configuração original", sem histórico nem timeline.

### Não entra
- Detecção real de hardware/jogos; qualquer alteração real no sistema.
- Navegação/chrome do restante do app ExitLag (protótipo standalone).
- Acabamento visual do design system real.
- **Direção B** (histórico por jogo) e **Direção C** (comparativo antes/depois).
- Simular o jogo abrindo/fechando como estado interativo.

---

## 3. Telas e estados

### Tela 1 — Home do PC Booster

Ordem vertical:

1. **Título da seção** + parágrafo de apoio (placeholder).
2. **Hardware detectado** — três blocos lado a lado: CPU, GPU, Memória. Cada bloco tem
   valor principal + linha de metadados. Marcado com tag `mock`. Rótulo "Detectado há 2 min".
3. **Jogos instalados** — 4 cards em lista vertical. Cada card:
   - thumbnail (placeholder "capa")
   - nome do jogo
   - metadados: engine · caminho de instalação
   - badges à direita, nesta ordem: *Otimização ativa* (só se ligada) → *Em execução* (só se rodando) → **status**
   - chevron indicando que abre
4. **Restaurar configuração original (global)** — card com título, texto de apoio e botão.
   Clicar pede confirmação inline (*Cancelar* / *Restaurar tudo*). Confirmado, desliga todos os
   toggles e exibe mensagem de sucesso.

#### Status possíveis na lista

| Status | Cor semântica | Significado |
|---|---|---|
| Roda bem | verde (breeze) | atende o tier recomendado |
| Otimização recomendada | amarelo (radiance) | roda, mas há ganho disponível |
| Abaixo do recomendado | vermelho (primary) | não atende o tier recomendado |

### Tela 2 — Detalhe do jogo

Mesmo conteúdo nos três modos de navegação (ver seção 5). Ordem vertical:

1. **Cabeçalho** — nome do jogo, badges (*Em execução*, status), engine · caminho.

2. **Alerta de hardware** — só aparece se o jogo tem gravidade atribuída. Contém:
   - rótulo do nível (Gravidade leve / moderada / severa)
   - título do alerta (placeholder)
   - parágrafo explicando o gap (placeholder)
   - **tabela comparativa** com 4 colunas: Componente · Mínimo · Recomendado · Seu PC
     - a coluna "Seu PC" recebe marcação por veredito: ✓ verde (atende), ! laranja (abaixo do
       recomendado mas acima do mínimo), ✕ vermelho (abaixo do mínimo)
   - nota de fonte: "Requisitos no formato de tiers do PCGamingWiki (minimum / recommended / alt)"
   - Se o jogo **atende** os requisitos, no lugar do alerta aparece uma mensagem de sucesso.

3. **Card de otimização** — o controle principal:
   - título + texto de apoio + **toggle Ligado/Desligado**
   - divisor
   - **"Camadas incluídas"** — duas linhas, cada uma com ícone, nome, descrição e badge de estado:
     - *Config de engine — [engine do jogo]* · "Arquivos globais da engine · afeta todos os jogos que usam [engine]"
       - badge: **Aplicada** / **Inativa** / **N/A** (quando a engine não tem camada mapeada)
     - *Perfil de driver GPU — NVIDIA* · "Perfil por jogo via API do driver"
       - badge: **Aplicada** / **Inativa**
     - Quando o toggle está desligado, as duas linhas ficam esmaecidas.
   - **mensagem de estado** (ver seção 4)

4. **"O que foi ajustado"** — só aparece com o toggle ligado:
   - lista de atributos, cada linha com: nome · tag (*reduzido* / *mantido*) · valor final
   - nota explicando que a otimização é seletiva (placeholder)
   - divisor
   - **"Perfil de driver GPU"** — métrica com valor anterior riscado → valor novo em destaque,
     e a linha "Medido em [GPU]"

5. **Restaurar configuração original (por jogo)** — mesmo padrão do global, escopo de um jogo só.
   Confirmação inline, mensagem de sucesso.

---

## 4. Regras de comportamento

### Toggle de otimização

Um único toggle liga/desliga as duas camadas juntas. Não há controle separado por camada.

| Ação | Jogo em execução | Jogo fechado |
|---|---|---|
| **Ligar** | "a otimização foi aplicada agora" | "a otimização será aplicada quando o jogo abrir" |
| **Desligar** | "a otimização foi revertida agora" | "a otimização não será aplicada no próximo launch" |

Estado neutro (toggle desligado, sem ação recente): "otimização desligada para este jogo".

### O que deliberadamente NÃO é estado de interface

- A **reversão automática ao fechar o jogo** não aparece em lugar nenhum. É invisível por definição.
- "Em execução" é um **atributo do dado mockado**, não uma simulação. O usuário não abre nem fecha
  jogo no protótipo — o badge existe apenas para diferenciar as duas mensagens do toggle acima.

### Reversão (Direção A)

- Dois escopos: **por jogo** (dentro do detalhe) e **global** (na home).
- Ambos pedem confirmação inline antes de executar.
- Não há histórico, timeline, nem reversão parcial — é o botão único da Direção A.
- Restaurar desliga o toggle e limpa as mensagens de estado do escopo afetado.

---

## 5. Modos de navegação (3 direções em teste)

O protótipo tem um **painel de teste fora da interface** (barra listrada no topo) que alterna entre
três direções de navegação, para comparação. O painel **não faz parte do produto**.

| Modo | Comportamento | Observação da comparação |
|---|---|---|
| **A · Tela cheia** | Clicar no jogo troca a tela inteira; botão *Voltar* | Único que dá espaço confortável para a tabela de requisitos + lista de ajustes |
| **B · Drawer lateral** | O jogo abre num painel lateral sobre a lista, com overlay escurecido | A tabela de 4 colunas fica apertada e quebra linha |
| **C · Card expansível** | O jogo expande inline; tudo numa tela só | Vira uma tela muito longa quando a otimização está ligada |

O painel também tem *Resetar protótipo*, que volta todos os toggles ao estado inicial.

---

## 6. Dados mockados

### Máquina do usuário

| Componente | Valor |
|---|---|
| CPU | Intel Core i5-13420H · 8C/12T · 4.6 GHz |
| GPU | NVIDIA GeForce RTX 5060 Laptop · 8 GB GDDR7 · driver 581.42 |
| Memória | **8 GB DDR5** · 1×8 GB · single channel · 4800 MHz |

**Por que a memória é o gargalo:** era preciso um gargalo crível para sustentar os 3 níveis de
gravidade sem contradizer o exemplo real de ganho de GPU, que foi medido numa RTX 5060. Com a GPU e a
CPU adequadas, a RAM sozinha produz os três níveis.

### Os 4 jogos

| Jogo | Engine | Status | Gravidade | Em execução | Camada de engine |
|---|---|---|---|---|---|
| Escape from Tarkov | Unity | Abaixo do recomendado | **severo** | não | sim |
| THE FINALS | Unreal Engine 5 | Abaixo do recomendado | **moderado** | **sim** | sim |
| Fortnite | Unreal Engine 5 | Otimização recomendada | **leve** | não | sim |
| Counter-Strike 2 | Source 2 | Roda bem | — | não | **não (N/A)** |

**Lógica das gravidades:**
- **severo** — algum componente está abaixo do **mínimo** (Tarkov pede 12 GB, a máquina tem 8)
- **moderado** — atende o mínimo, mas fica abaixo do **recomendado** (THE FINALS pede 16 GB)
- **leve** — gap pequeno, resto da máquina folgado (Fortnite)
- **sem alerta** — atende tudo (CS2)

O CS2 existe no mock para exercitar o caso em que a **camada de engine não se aplica** (Source 2 não
tem config global mapeada) e só o perfil de driver GPU entra — mostrando que as duas camadas são
independentes.

### Requisitos comparativos (formato PCGamingWiki, valores mockados)

**Escape from Tarkov** — CPU: i5-6600K / i7-9700K · GPU: GTX 1060 6 GB / RTX 2070 · RAM: 12 GB / 32 GB
**THE FINALS** — CPU: i5-6600K / i5-11600K · GPU: GTX 1050 Ti / RTX 2070 · RAM: 8 GB / 16 GB
**Fortnite** — CPU: i3-8100 / i5-7300U · GPU: Intel UHD 630 / GTX 960 4 GB · RAM: 8 GB / 16 GB
**Counter-Strike 2** — CPU: i5-750 / i5-9400 · GPU: GTX 660 / GTX 1060 6 GB · RAM: 8 GB / 8 GB

### Ajustes aplicados

**THE FINALS é o único jogo com conteúdo real** (medido no build de teste):

| Atributo | Resultado |
|---|---|
| View Distance | reduzido · Low |
| Anti-Aliasing | reduzido · Low |
| Shadows | reduzido · Low |
| Post-Processing | reduzido · Low |
| Effects | reduzido · Low |
| Foliage | reduzido · Low |
| Texture | reduzido · Medium |
| **Reflections** | **mantido · High** |

Perfil de driver GPU: **GPU Clock 210 MHz → 2805 MHz**.

Nos outros três jogos, a lista aparece como "Atributo 01…05 — conteúdo não mapeado", explicitamente
marcada como placeholder, para não inventar dados.

**Nota sobre os valores "antes":** o brief não informa de que valor cada atributo partiu, então a
lista mostra só o resultado, com a tag *reduzido* ou *mantido* — sem inventar o estado anterior.
A única exceção é o GPU Clock, cujo antes→depois é dado real.

---

## 7. Convenções de leitura do protótipo

- **Texto cinza com sublinhado pontilhado** = placeholder de copy. Nenhum microcopy é definitivo.
- Tag `mock` = dado que não vem do sistema.
- Tag `conteúdo não mapeado` = conteúdo que ainda não existe.
- O visual usa os tokens reais do design system da ExitLag (dark-first, vermelho #F52929 como
  primária, verde/amarelo/laranja para semântica de estado, Ubuntu como família tipográfica),
  mas o **layout é wireframe** — sem acabamento.

---

## 8. Pontos em aberto

1. **Conflito entre camadas** — config de engine e perfil de driver GPU podem mexer no mesmo atributo
   (ex.: antialiasing). Não há decisão sobre precedência, e o protótipo não expressa isso na UI.
2. **Tiers de sistema (Tier 1 / Tier 2)** ficaram fora da interface — não estavam no escopo das
   camadas do toggle. Falta decidir se ganham controle próprio, se entram no mesmo toggle, ou se
   nunca aparecem para o usuário.
3. **Efeito colateral da camada de engine** — ela é global por engine, ou seja, otimizar THE FINALS
   mexe em arquivos que afetam Fortnite também. O protótipo apenas *descreve* isso no texto da
   camada; não há tratamento de UI para o conflito entre dois jogos da mesma engine.
4. **Copy** — todos os textos de alerta, apoio e confirmação são placeholder, inclusive os nomes dos
   3 níveis de gravidade.
5. **Ganho percentual por jogo** — o time de games está testando o build real em hardware low/mid-range
   e vai reportar ganho percentual. Esse dado ainda não existe e pode enriquecer o "o que foi ajustado"
   depois.
6. **Direção de navegação** — A, B ou C ainda não foi escolhida.
