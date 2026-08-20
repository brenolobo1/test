/* ==========================================================================
   PC Booster — estudo de wireframe
   Estrutura pura: sem cor, sem microcopy, sem dado. Apenas blocos nomeados,
   posição, marcação de CTA e sinalização de bloco condicional.

   MODELO DE DOIS NÍVEIS DE CONFIGURAÇÃO
   ─────────────────────────────────────
   nível SISTEMA  → vale para a máquina inteira (perfil de GPU global, tiers de
                    sistema operacional). Não pertence a jogo nenhum.
   nível JOGO     → vale só para aquele jogo (perfil de driver por jogo).
   zona cinzenta  → config de engine: é global POR ENGINE, então atravessa os dois
                    níveis. Cada conjunto abaixo resolve isso de um jeito.

   DUAS VISÕES
   ───────────
   Estudo   → as 3 telas separadas, 3 alternativas cada, para comparar disposição.
   Conjunto → A, B ou C montados na mesma janela: Tela 1 é a base, Telas 2 e 3
              abrem por cima como drawers.
   Fora de escopo: os 3 modos de navegação do protótipo (A/B/C de navegação).
   ========================================================================== */

const wfState = {
  set: 'estudo',                        // estudo | A | B | C
  drawers: { game: true, hw: true }     // quais drawers estão abertos na visão de conjunto
};

/* ---------- primitivas ---------- */

const wf = {
  block: (name, o = {}) => `
    <div class="wf-block ${o.cond ? 'wf-block--cond' : ''} ${o.cta ? 'wf-block--cta' : ''} ${o.inherit ? 'wf-block--inherit' : ''}"
         style="${o.h ? `min-height:${o.h}px` : ''}${o.grow ? ';flex:1' : ''}">
      <span class="wf-block__name">${name}</span>
      <span class="wf-block__tags">
        ${o.scope ? `<span class="wf-chip wf-chip--scope">${o.scope}</span>` : ''}
        ${o.cond ? '<span class="wf-chip wf-chip--cond">condicional</span>' : ''}
        ${o.cta ? `<span class="wf-chip wf-chip--cta">${o.cta === true ? 'CTA' : o.cta}</span>` : ''}
      </span>
    </div>`,

  list: (name, rows = 4, o = {}) => `
    <div class="wf-block wf-block--list" style="${o.grow ? 'flex:1' : ''}">
      <div class="wf-block__head"><span class="wf-block__name">${name}</span></div>
      ${o.first ? `
        <div class="wf-row wf-row--named">
          <span class="wf-row__name">${o.first}</span>
          <span class="wf-block__tags">
            <span class="wf-chip wf-chip--cta">toggle</span>
            <span class="wf-chip wf-chip--cta">chevron</span>
          </span>
        </div>` : ''}
      ${Array.from({ length: rows }, () => `
        <div class="wf-row">
          <span class="wf-row__slot"></span>
          <span class="wf-chip wf-chip--cta">chevron</span>
        </div>`).join('')}
    </div>`,

  toggle: (name, o = {}) => `
    <div class="wf-block wf-block--stack ${o.cond ? 'wf-block--cond' : ''} ${o.inherit ? 'wf-block--inherit' : ''}">
      <div class="wf-block__head">
        <span class="wf-block__name">${name}</span>
        <span class="wf-block__tags">
          ${o.scope ? `<span class="wf-chip wf-chip--scope">${o.scope}</span>` : ''}
          <span class="wf-chip wf-chip--cta">toggle</span>
        </span>
      </div>
      ${o.sub ? `<div class="wf-sub">${o.sub}</div>` : ''}
    </div>`,

  group: (name, inner, o = {}) => `
    <div class="wf-group" style="${o.grow ? 'flex:1' : ''}">
      <span class="wf-group__name">${name}</span>
      ${inner}
    </div>`,

  bar: (name) => `
    <div class="wf-bar">
      <span class="wf-block__name">${name}</span>
      <span class="wf-chip wf-chip--cta">botão</span>
    </div>`,

  cols: (defs) => `
    <div class="wf-hsplit">
      ${defs.map(d => `
        <div class="wf-hcol" style="flex:${d.w || 1}">
          ${d.label ? `<span class="wf-col__label">${d.label}</span>` : ''}
          ${d.body}
        </div>`).join('')}
    </div>`
};

/* ==========================================================================
   AS TRÊS TELAS × TRÊS ALTERNATIVAS
   Cada entrada é só dado: título, nota e corpo. As duas visões consomem daqui.
   ========================================================================== */

/* Tela 1 · PC Booster — a base, horizontal.
   Pergunta: onde vive o nível sistema em relação à lista de jogos? */
const TELA1 = {
  A: {
    title: 'Duas faixas',
    note: 'Os dois níveis viram faixas horizontais. Sistema em cima com toggle próprio e entrada para o detalhe de hardware; jogos embaixo. A hierarquia fica explícita: o que vale para tudo vem antes do que vale para um jogo.',
    body:
      wf.group('nível sistema',
        wf.cols([
          { w: 2, body: wf.block('hardware detectado', { h: 64, cta: 'chevron', scope: 'sistema' }) },
          { w: 1, body: wf.toggle('otimização de sistema', { scope: 'sistema' }) }
        ])
      ) +
      wf.group('nível jogo', wf.list('jogos instalados', 3)) +
      wf.block('restaurar configuração original', { cta: true, h: 44 })
  },
  B: {
    title: 'Coluna de sistema',
    note: 'O formato deitado vira duas colunas de escopo. Coluna estreita à esquerda concentra tudo que é da máquina e permanece visível enquanto o usuário percorre a lista. Reversão global mora junto do sistema.',
    body: wf.cols([
      { w: 1, label: 'nível sistema', body:
        wf.block('hardware detectado', { h: 72, cta: 'chevron', scope: 'sistema' }) +
        wf.toggle('otimização de sistema', { scope: 'sistema' }) +
        wf.block('restaurar configuração original', { cta: true, h: 44 }) },
      { w: 2, label: 'nível jogo', body: wf.list('jogos instalados', 4, { grow: true }) }
    ])
  },
  C: {
    title: 'Sistema na lista',
    note: 'Um fluxo só: o sistema é a primeira linha da lista, com o mesmo toggle e o mesmo chevron dos jogos. Trata os dois níveis como irmãos em vez de hierarquia — mais simples, mas o escopo global fica menos evidente.',
    body: wf.cols([
      { w: 3, body:
        wf.block('cabeçalho da seção', { h: 40 }) +
        wf.list('alvos de otimização', 3, { first: 'sistema (máquina inteira)' }) },
      { w: 1, label: 'apoio', body:
        wf.block('hardware detectado', { h: 72, cta: 'chevron', scope: 'sistema' }) +
        wf.block('restaurar configuração original', { cta: true, h: 44 }) }
    ])
  }
};

/* Tela 2 · Detalhe do jogo — drawer, vertical.
   Pergunta: como mostrar o que é herdado do sistema? */
const TELA2 = {
  A: {
    title: 'Herança etiquetada',
    note: 'Um toggle só, e cada camada dentro dele carrega a etiqueta do seu escopo. O que vem do sistema aparece hachurado e é somente leitura aqui.',
    body:
      wf.block('cabeçalho do jogo', { h: 48, cta: 'fechar' }) +
      wf.block('alerta de hardware', { cond: true, h: 84 }) +
      wf.toggle('otimização deste jogo', { scope: 'jogo' }) +
      wf.group('camadas',
        wf.block('perfil de driver GPU', { h: 40, scope: 'jogo' }) +
        wf.block('config de engine', { h: 40, scope: 'engine', inherit: true }) +
        wf.block('otimização de sistema', { h: 40, scope: 'sistema', inherit: true, cta: 'chevron' })
      ) +
      wf.block('o que foi ajustado', { cond: true, h: 72 }) +
      wf.block('restaurar configuração original', { cta: true, h: 48 })
  },
  B: {
    title: 'Dois blocos de escopo',
    note: 'Separa fisicamente o que o usuário controla aqui do que é herdado. O bloco de sistema é read-only e leva para a Tela 3. O custo é uma tela mais longa e dois lugares para procurar.',
    body:
      wf.block('cabeçalho do jogo', { h: 48, cta: 'fechar' }) +
      wf.block('alerta de hardware', { cond: true, h: 76 }) +
      wf.group('específico deste jogo',
        wf.toggle('otimização deste jogo', { scope: 'jogo' }) +
        wf.block('o que foi ajustado', { cond: true, h: 64 })
      ) +
      wf.group('vem do sistema',
        wf.block('otimização de sistema', { h: 40, scope: 'sistema', inherit: true }) +
        wf.block('config de engine', { h: 40, scope: 'engine', inherit: true, cta: 'chevron' })
      ) +
      wf.block('restaurar configuração original', { cta: true, h: 48 })
  },
  C: {
    title: 'Escopo sob demanda',
    note: 'A tela assume o nível jogo como padrão e esconde a herança atrás de um bloco expansível. Mais enxuta, mas o usuário só descobre o efeito global se abrir.',
    body:
      wf.block('cabeçalho do jogo', { h: 48, cta: 'fechar' }) +
      wf.block('alerta de hardware', { cond: true, h: 84 }) +
      wf.toggle('otimização deste jogo', { scope: 'jogo', sub: 'o que foi ajustado' }) +
      wf.block('ver escopo e herança', { cta: 'expandir', h: 44 }) +
      wf.block('detalhamento por escopo', { cond: true, h: 96 }) +
      wf.block('restaurar configuração original', { cta: true, h: 48 })
  }
};

/* Tela 3 · Detalhe de hardware — drawer, vertical.
   É aqui que moram as configurações de nível sistema. */
const TELA3 = {
  A: {
    title: 'Leitura e depois ajuste',
    note: 'Linear: specs primeiro como diagnóstico, controles de sistema depois, reversão de escopo sistema no fim. A tela se lê como um relatório que termina em ação.',
    body:
      wf.block('cabeçalho + fechar', { h: 44, cta: 'fechar' }) +
      wf.block('specs completas', { h: 110, scope: 'sistema' }) +
      wf.group('configurações de sistema',
        wf.toggle('tier de otimização', { scope: 'sistema' }) +
        wf.toggle('perfil de GPU global', { scope: 'sistema' }) +
        wf.toggle('config de engine', { scope: 'engine' })
      ) +
      wf.block('jogos afetados por estas configurações', { cond: true, h: 60 }) +
      wf.block('restaurar configuração original', { cta: true, h: 48 })
  },
  B: {
    title: 'Painel de controle',
    note: 'Inverte: a tela é de configuração, não de leitura. Controles no topo, specs viram referência recolhida no fim. Reversão fixa no rodapé, sempre alcançável.',
    body:
      wf.block('cabeçalho + fechar', { h: 44, cta: 'fechar' }) +
      wf.group('configurações de sistema',
        wf.toggle('tier de otimização', { scope: 'sistema' }) +
        wf.toggle('perfil de GPU global', { scope: 'sistema' }) +
        wf.toggle('config de engine', { scope: 'engine' })
      ) +
      wf.block('jogos afetados por estas configurações', { cond: true, h: 64 }) +
      wf.block('specs completas', { cta: 'expandir', h: 52, scope: 'sistema' }),
    footer: wf.bar('restaurar configuração original')
  },
  C: {
    title: 'Config acoplada ao componente',
    note: 'Agrupa por peça de hardware em vez de por tipo de ajuste: cada componente carrega seus próprios controles. Liga causa e efeito, mas dispersa a config de engine, que não pertence a componente nenhum.',
    body:
      wf.block('cabeçalho + fechar', { h: 44, cta: 'fechar' }) +
      ['01', '02', '03'].map(n => wf.group(`componente ${n}`,
        wf.block('specs', { h: 30 }) + wf.toggle('ajustes do componente', { scope: 'sistema' })
      )).join('') +
      wf.block('config de engine (sem componente)', { h: 40, scope: 'engine' }) +
      wf.block('restaurar configuração original', { cta: true, h: 44 })
  }
};

/* ---------- artboard (visão Estudo) ---------- */

function wfBoard(id, screen, o = {}) {
  return `
    <div class="wf-board ${o.wide ? 'wf-board--wide' : ''}">
      <div class="wf-board__label">
        <span class="wf-board__id">${id}</span>
        <span class="wf-board__title">${screen.title}</span>
      </div>
      <div class="wf-board__note">${screen.note}</div>
      <div class="wf-board__frame">
        <div class="wf-board__chrome"></div>
        <div class="wf-board__body">${screen.body}</div>
        ${screen.footer || ''}
      </div>
    </div>`;
}

/* ---------- legenda ---------- */

const wfLegend = `
  <div class="wf-legend">
    <span class="wf-legend__item"><span class="wf-swatch"></span>bloco</span>
    <span class="wf-legend__item"><span class="wf-swatch wf-swatch--cond"></span>condicional</span>
    <span class="wf-legend__item"><span class="wf-swatch wf-swatch--inherit"></span>herdado de outro escopo</span>
    <span class="wf-legend__item"><span class="wf-chip wf-chip--cta">CTA</span>ponto de ação</span>
    <span class="wf-legend__item"><span class="wf-chip wf-chip--scope">escopo</span>nível de configuração</span>
    <span class="wf-legend__note">estrutura e posição apenas — sem cor, sem copy, sem dado</span>
  </div>`;

/* ==========================================================================
   VISÃO 1 · Estudo — as telas separadas
   ========================================================================== */

function renderEstudo() {
  const keys = ['A', 'B', 'C'];
  return `
    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 1 · PC Booster <span class="wf-screen__fmt">horizontal · base</span></h2>
      <div class="wf-boards wf-boards--stack">
        ${keys.map(k => wfBoard('1' + k, TELA1[k], { wide: true })).join('')}
      </div>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 2 · Detalhe do jogo <span class="wf-screen__fmt">vertical · drawer</span></h2>
      <div class="wf-boards">${keys.map(k => wfBoard('2' + k, TELA2[k])).join('')}</div>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 3 · Detalhe de hardware <span class="wf-screen__fmt">vertical · drawer</span></h2>
      <div class="wf-boards">${keys.map(k => wfBoard('3' + k, TELA3[k])).join('')}</div>
    </div>`;
}

/* ==========================================================================
   VISÃO 2 · Conjunto — Tela 1 como base, Telas 2 e 3 como drawers por cima
   ========================================================================== */

const CONJUNTO_NOTA = {
  A: 'Hierarquia declarada em toda parte: a base separa os níveis em faixas, o drawer do jogo etiqueta cada camada com seu escopo, e o drawer de hardware se lê como relatório que termina em ação. É o conjunto mais explícito e o mais verboso.',
  B: 'Escopo vira geografia: coluna de sistema à esquerda na base, blocos de escopo separados no drawer do jogo, painel de controle no drawer de hardware. O usuário aprende uma regra espacial e ela vale nas três telas.',
  C: 'Aposta na simplicidade: sistema é só mais um item da lista, a herança fica atrás de um expansível e o hardware agrupa config por componente. Menos blocos à vista, mais coisa escondida — e a config de engine fica sem lugar natural em nenhuma das três telas.'
};

function wfDrawer(id, screen, kind, origem, open) {
  if (!open) return '';
  return `
    <aside class="wf-drawer wf-drawer--${kind}">
      <div class="wf-drawer__tab">
        <span class="wf-board__id">${id}</span>
        <span class="wf-drawer__title">${screen.title}</span>
        <span class="wf-drawer__from">abre a partir de: ${origem}</span>
      </div>
      <div class="wf-drawer__frame">
        <div class="wf-drawer__body">${screen.body}</div>
        ${screen.footer || ''}
      </div>
    </aside>`;
}

function renderConjunto(k) {
  const d = wfState.drawers;
  return `
    <div class="wf-screen">
      <h2 class="wf-screen__title">
        Conjunto ${k}
        <span class="wf-screen__fmt">1${k} base · 2${k} e 3${k} em drawer</span>
      </h2>

      <div class="wf-setbar">
        <span class="wf-setbar__label">drawers abertos:</span>
        <button class="wf-setbtn" data-action="wf-drawer" data-id="game" aria-pressed="${d.game}">
          2${k} · detalhe do jogo
        </button>
        <button class="wf-setbtn" data-action="wf-drawer" data-id="hw" aria-pressed="${d.hw}">
          3${k} · detalhe de hardware
        </button>
        <span class="wf-setbar__note">${CONJUNTO_NOTA[k]}</span>
      </div>

      <div class="wf-window">
        <div class="wf-board__chrome"></div>
        <div class="wf-window__stack">
          <div class="wf-window__base ${d.game || d.hw ? 'is-covered' : ''}">
            <div class="wf-board__label wf-board__label--inset">
              <span class="wf-board__id">1${k}</span>
              <span class="wf-board__title">${TELA1[k].title}</span>
            </div>
            ${TELA1[k].body}
          </div>
          ${wfDrawer('3' + k, TELA3[k], 'back', 'bloco de hardware', d.hw)}
          ${wfDrawer('2' + k, TELA2[k], 'front', 'linha de jogo', d.game)}
        </div>
      </div>

      <div class="wf-notes">
        <div class="wf-note"><span class="wf-board__id">1${k}</span> ${TELA1[k].note}</div>
        <div class="wf-note"><span class="wf-board__id">2${k}</span> ${TELA2[k].note}</div>
        <div class="wf-note"><span class="wf-board__id">3${k}</span> ${TELA3[k].note}</div>
      </div>
    </div>`;
}

/* ---------- ações do painel ---------- */

function wfAction(action, id) {
  if (action === 'wf-drawer') { wfState.drawers[id] = !wfState.drawers[id]; return true; }
  if (action === 'wf-set')    { wfState.set = id; return true; }
  return false;
}

/* ---------- render ---------- */

function renderWireframe() {
  const body = wfState.set === 'estudo' ? renderEstudo() : renderConjunto(wfState.set);
  return `<div class="wf">${wfLegend}${body}</div>`;
}
