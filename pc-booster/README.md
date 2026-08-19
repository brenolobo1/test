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

1. Resumo de hardware detectado (CPU / GPU / Memória)
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

O botão *Resetar protótipo* volta todos os toggles ao estado inicial.

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
