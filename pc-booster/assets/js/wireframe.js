/* ==========================================================================
   PC Booster — estudo de wireframe
   Estrutura pura: sem cor, sem microcopy, sem dado. Apenas blocos nomeados,
   posição, marcação de CTA e sinalização de bloco condicional.

   MODELO DE DOIS NÍVEIS DE CONFIGURAÇÃO
   ─────────────────────────────────────
   nível SISTEMA  → vale para a máquina inteira (perfil de GPU global, tiers de
                    sistema operacional, plano de energia). Não pertence a jogo nenhum.
   nível JOGO     → vale só para aquele jogo (perfil de driver por jogo).
   zona cinzenta  → config de engine: é global POR ENGINE, então atravessa os dois
                    níveis. Cada alternativa abaixo resolve isso de um jeito.

   Tela 1 é horizontal (retangular deitada); Telas 2 e 3 são verticais.
   Fora de escopo aqui: os 3 modos de navegação (A/B/C).
   ========================================================================== */

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

  /* lista de linhas clicáveis; a primeira pode ser nomeada (nível sistema) */
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

  /* divisão horizontal — usada nos artboards deitados */
  cols: (defs) => `
    <div class="wf-hsplit">
      ${defs.map(d => `
        <div class="wf-hcol" style="flex:${d.w || 1}">
          ${d.label ? `<span class="wf-col__label">${d.label}</span>` : ''}
          ${d.body}
        </div>`).join('')}
    </div>`,

  board: (id, title, note, body, o = {}) => `
    <div class="wf-board ${o.wide ? 'wf-board--wide' : ''}">
      <div class="wf-board__label">
        <span class="wf-board__id">${id}</span>
        <span class="wf-board__title">${title}</span>
      </div>
      <div class="wf-board__note">${note}</div>
      <div class="wf-board__frame">
        <div class="wf-board__chrome"></div>
        <div class="wf-board__body">${body}</div>
        ${o.footer || ''}
      </div>
    </div>`
};

/* ==========================================================================
   TELA 1 · PC Booster — artboards HORIZONTAIS
   A pergunta de cada alternativa: onde vive o nível SISTEMA em relação à lista de jogos?
   ========================================================================== */

function wireTela1() {
  /* 1A — duas faixas empilhadas: o nível sistema é uma faixa própria acima da lista */
  const a = wf.board('1A', 'Duas faixas',
    'Os dois níveis viram faixas horizontais. Sistema em cima com toggle próprio e entrada para o detalhe de hardware; jogos embaixo. A hierarquia fica explícita: o que vale para tudo vem antes do que vale para um jogo.',
    wf.group('nível sistema',
      wf.cols([
        { w: 2, body: wf.block('hardware detectado', { h: 64, cta: 'chevron', scope: 'sistema' }) },
        { w: 1, body: wf.toggle('otimização de sistema', { scope: 'sistema' }) }
      ])
    ) +
    wf.group('nível jogo',
      wf.list('jogos instalados', 3)
    ) +
    wf.block('restaurar configuração original', { cta: true, h: 44 }),
    { wide: true });

  /* 1B — coluna de sistema à esquerda, lista à direita */
  const b = wf.board('1B', 'Coluna de sistema',
    'O formato deitado vira duas colunas de escopo. Coluna estreita à esquerda concentra tudo que é da máquina e permanece visível enquanto o usuário percorre a lista. Reversão global mora junto do sistema.',
    wf.cols([
      { w: 1, label: 'nível sistema', body:
        wf.block('hardware detectado', { h: 72, cta: 'chevron', scope: 'sistema' }) +
        wf.toggle('otimização de sistema', { scope: 'sistema' }) +
        wf.block('restaurar configuração original', { cta: true, h: 44 }) },
      { w: 2, label: 'nível jogo', body: wf.list('jogos instalados', 4, { grow: true }) }
    ]),
    { wide: true });

  /* 1C — sistema como primeira linha da própria lista */
  const c = wf.board('1C', 'Sistema na lista',
    'Um fluxo só: o sistema é a primeira linha da lista, com o mesmo toggle e o mesmo chevron dos jogos. Trata os dois níveis como irmãos em vez de hierarquia — mais simples, mas o escopo global fica menos evidente.',
    wf.cols([
      { w: 3, body:
        wf.block('cabeçalho da seção', { h: 40 }) +
        wf.list('alvos de otimização', 3, { first: 'sistema (máquina inteira)' }) },
      { w: 1, label: 'apoio', body:
        wf.block('hardware detectado', { h: 72, cta: 'chevron', scope: 'sistema' }) +
        wf.block('restaurar configuração original', { cta: true, h: 44 }) }
    ]),
    { wide: true });

  return a + b + c;
}

/* ==========================================================================
   TELA 2 · Detalhe do jogo — artboards VERTICAIS
   A pergunta de cada alternativa: como mostrar o que é herdado do sistema?
   ========================================================================== */

function wireTela2() {
  const a = wf.board('2A', 'Herança etiquetada',
    'Um toggle só, e cada camada dentro dele carrega a etiqueta do seu escopo. O que vem do sistema aparece com fundo hachurado e é somente leitura aqui.',
    wf.block('cabeçalho do jogo', { h: 48 }) +
    wf.block('alerta de hardware', { cond: true, h: 84 }) +
    wf.toggle('otimização deste jogo', { scope: 'jogo' }) +
    wf.group('camadas',
      wf.block('perfil de driver GPU', { h: 40, scope: 'jogo' }) +
      wf.block('config de engine', { h: 40, scope: 'engine', inherit: true }) +
      wf.block('otimização de sistema', { h: 40, scope: 'sistema', inherit: true, cta: 'chevron' })
    ) +
    wf.block('o que foi ajustado', { cond: true, h: 72 }) +
    wf.block('restaurar configuração original', { cta: true, h: 48 }));

  const b = wf.board('2B', 'Dois blocos de escopo',
    'Separa fisicamente o que o usuário controla aqui do que é herdado. O bloco de sistema é read-only e leva para a Tela 3. O custo é uma tela mais longa e dois lugares para procurar.',
    wf.block('cabeçalho do jogo', { h: 48 }) +
    wf.block('alerta de hardware', { cond: true, h: 76 }) +
    wf.group('específico deste jogo',
      wf.toggle('otimização deste jogo', { scope: 'jogo' }) +
      wf.block('o que foi ajustado', { cond: true, h: 64 })
    ) +
    wf.group('vem do sistema',
      wf.block('otimização de sistema', { h: 40, scope: 'sistema', inherit: true }) +
      wf.block('config de engine', { h: 40, scope: 'engine', inherit: true, cta: 'chevron' })
    ) +
    wf.block('restaurar configuração original', { cta: true, h: 48 }));

  const c = wf.board('2C', 'Escopo sob demanda',
    'A tela assume o nível jogo como padrão e esconde a herança atrás de um bloco expansível. Mais enxuta, mas o usuário só descobre o efeito global se abrir.',
    wf.block('cabeçalho do jogo', { h: 48 }) +
    wf.block('alerta de hardware', { cond: true, h: 84 }) +
    wf.toggle('otimização deste jogo', { scope: 'jogo', sub: 'o que foi ajustado' }) +
    wf.block('ver escopo e herança', { cta: 'expandir', h: 44 }) +
    wf.block('detalhamento por escopo', { cond: true, h: 96 }) +
    wf.block('restaurar configuração original', { cta: true, h: 48 }));

  return a + b + c;
}

/* ==========================================================================
   TELA 3 · Detalhe de hardware — artboards VERTICAIS
   Drill-down do bloco de sistema. É aqui que moram as configurações de máquina.
   ========================================================================== */

function wireTela3() {
  const a = wf.board('3A', 'Leitura e depois ajuste',
    'Linear: specs primeiro como diagnóstico, controles de sistema depois, reversão de escopo sistema no fim. A tela se lê como um relatório que termina em ação.',
    wf.block('cabeçalho + voltar', { h: 44, cta: 'voltar' }) +
    wf.block('specs completas', { h: 110, scope: 'sistema' }) +
    wf.group('configurações de sistema',
      wf.toggle('tier de otimização', { scope: 'sistema' }) +
      wf.toggle('perfil de GPU global', { scope: 'sistema' }) +
      wf.toggle('config de engine', { scope: 'engine' })
    ) +
    wf.block('jogos afetados por estas configurações', { cond: true, h: 60 }) +
    wf.block('restaurar configuração original', { cta: true, h: 48 }));

  const b = wf.board('3B', 'Painel de controle',
    'Inverte: a tela é de configuração, não de leitura. Controles no topo, specs viram referência recolhida no fim. Reversão fixa no rodapé, sempre alcançável.',
    wf.block('cabeçalho + voltar', { h: 44, cta: 'voltar' }) +
    wf.group('configurações de sistema',
      wf.toggle('tier de otimização', { scope: 'sistema' }) +
      wf.toggle('perfil de GPU global', { scope: 'sistema' }) +
      wf.toggle('config de engine', { scope: 'engine' })
    ) +
    wf.block('jogos afetados por estas configurações', { cond: true, h: 64 }) +
    wf.block('specs completas', { cta: 'expandir', h: 52, scope: 'sistema' }),
    { footer: wf.bar('restaurar configuração original') });

  const c = wf.board('3C', 'Config acoplada ao componente',
    'Agrupa por peça de hardware em vez de por tipo de ajuste: cada componente carrega seus próprios controles. Liga causa e efeito, mas dispersa a config de engine, que não pertence a componente nenhum.',
    wf.block('cabeçalho + voltar', { h: 44, cta: 'voltar' }) +
    wf.group('componente 01',
      wf.block('specs', { h: 34 }) + wf.toggle('ajustes do componente', { scope: 'sistema' })
    ) +
    wf.group('componente 02',
      wf.block('specs', { h: 34 }) + wf.toggle('ajustes do componente', { scope: 'sistema' })
    ) +
    wf.group('componente 03',
      wf.block('specs', { h: 34 }) + wf.toggle('ajustes do componente', { scope: 'sistema' })
    ) +
    wf.block('config de engine (sem componente)', { h: 44, scope: 'engine' }) +
    wf.block('restaurar configuração original', { cta: true, h: 48 }));

  return a + b + c;
}

/* ---------- render do estudo ---------- */

function renderWireframe() {
  return `
  <div class="wf">
    <div class="wf-legend">
      <span class="wf-legend__item"><span class="wf-swatch"></span>bloco</span>
      <span class="wf-legend__item"><span class="wf-swatch wf-swatch--cond"></span>condicional</span>
      <span class="wf-legend__item"><span class="wf-swatch wf-swatch--inherit"></span>herdado de outro escopo</span>
      <span class="wf-legend__item"><span class="wf-chip wf-chip--cta">CTA</span>ponto de ação</span>
      <span class="wf-legend__item"><span class="wf-chip wf-chip--scope">escopo</span>nível de configuração</span>
      <span class="wf-legend__note">estrutura e posição apenas — sem cor, sem copy, sem dado</span>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 1 · PC Booster <span class="wf-screen__fmt">horizontal</span></h2>
      <div class="wf-boards wf-boards--stack">${wireTela1()}</div>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 2 · Detalhe do jogo <span class="wf-screen__fmt">vertical</span></h2>
      <div class="wf-boards">${wireTela2()}</div>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 3 · Detalhe de hardware <span class="wf-screen__fmt">vertical · nova</span></h2>
      <div class="wf-boards">${wireTela3()}</div>
    </div>
  </div>`;
}
