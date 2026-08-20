/* ==========================================================================
   PC Booster — estudo de wireframe
   Estrutura pura: sem cor, sem microcopy, sem dado. Apenas blocos nomeados,
   posição, marcação de CTA e sinalização de bloco condicional.
   Fora de escopo aqui: os 3 modos de navegação (A/B/C).
   ========================================================================== */

/* ---------- primitivas ---------- */

const wf = {
  /* bloco simples: nome + altura relativa */
  block: (name, o = {}) => `
    <div class="wf-block ${o.cond ? 'wf-block--cond' : ''} ${o.cta ? 'wf-block--cta' : ''}"
         style="${o.h ? `min-height:${o.h}px` : ''}">
      <span class="wf-block__name">${name}</span>
      <span class="wf-block__tags">
        ${o.cond ? '<span class="wf-chip wf-chip--cond">condicional</span>' : ''}
        ${o.cta ? '<span class="wf-chip wf-chip--cta">CTA</span>' : ''}
      </span>
    </div>`,

  /* bloco de lista: linhas repetidas, cada uma com chevron clicável */
  list: (name, rows = 4) => `
    <div class="wf-block wf-block--list">
      <div class="wf-block__head">
        <span class="wf-block__name">${name}</span>
      </div>
      ${Array.from({ length: rows }, () => `
        <div class="wf-row">
          <span class="wf-row__slot"></span>
          <span class="wf-chip wf-chip--cta">chevron</span>
        </div>`).join('')}
    </div>`,

  /* bloco com linha de toggle destacada */
  toggle: (name, o = {}) => `
    <div class="wf-block wf-block--stack ${o.cond ? 'wf-block--cond' : ''}">
      <div class="wf-block__head">
        <span class="wf-block__name">${name}</span>
        <span class="wf-chip wf-chip--cta">toggle</span>
      </div>
      ${o.sub ? `<div class="wf-sub">${o.sub}</div>` : ''}
    </div>`,

  /* sub-bloco recuado, para agrupamentos */
  group: (name, inner) => `
    <div class="wf-group">
      <span class="wf-group__name">${name}</span>
      ${inner}
    </div>`,

  /* barra fixa de rodapé */
  bar: (name) => `
    <div class="wf-bar">
      <span class="wf-block__name">${name}</span>
      <span class="wf-chip wf-chip--cta">botão</span>
    </div>`,

  /* artboard: moldura de tela com corpo rolável e rodapé opcional */
  board: (id, title, note, body, footer = '') => `
    <div class="wf-board">
      <div class="wf-board__label">
        <span class="wf-board__id">${id}</span>
        <span class="wf-board__title">${title}</span>
      </div>
      <div class="wf-board__note">${note}</div>
      <div class="wf-board__frame">
        <div class="wf-board__chrome"></div>
        <div class="wf-board__body">${body}</div>
        ${footer}
      </div>
    </div>`
};

/* ---------- Tela 1 · três disposições ---------- */

function wireTela1() {
  /* 1A — linear, tudo em cards empilhados, ação no fim do fluxo */
  const a = wf.board('1A', 'Linear',
    'Ordem de leitura direta. Todos os CTAs dentro do próprio card. Ação global fecha a página.',
    wf.block('cabeçalho da seção', { h: 52 }) +
    wf.block('hardware detectado', { h: 88 }) +
    wf.list('jogos instalados', 4) +
    wf.block('restaurar configuração original', { cta: true, h: 68 })
  );

  /* 1B — resumo agrupado no topo, lista domina o corpo, ação fixa no rodapé */
  const b = wf.board('1B', 'Lista dominante',
    'Cabeçalho e hardware agrupados num resumo curto. A lista ocupa o corpo. Ação global sai do fluxo e vira barra fixa.',
    wf.group('resumo da máquina',
      wf.block('cabeçalho da seção', { h: 40 }) +
      wf.block('hardware detectado', { h: 60 })
    ) +
    wf.list('jogos instalados', 5),
    wf.bar('restaurar configuração original')
  );

  /* 1C — jogos primeiro, hardware e ação agrupados no fim */
  const c = wf.board('1C', 'Tarefa primeiro',
    'A lista sobe para o topo como tarefa principal. Hardware desce e é agrupado com a ação global — os dois falam da máquina, não do jogo.',
    wf.block('cabeçalho da seção', { h: 40 }) +
    wf.list('jogos instalados', 4) +
    wf.group('máquina',
      wf.block('hardware detectado', { h: 60 }) +
      wf.block('restaurar configuração original', { cta: true, h: 56 })
    )
  );

  return a + b + c;
}

/* ---------- Tela 2 · três disposições ---------- */

function wireTela2() {
  /* 2A — linear, espelha a ordem do fluxo atual */
  const a = wf.board('2A', 'Linear',
    'Diagnóstico → controle → resultado → reversão. Cada CTA dentro do seu card. Toggle só aparece depois do alerta.',
    wf.block('cabeçalho do jogo', { h: 52 }) +
    wf.block('alerta de hardware', { cond: true, h: 96 }) +
    wf.toggle('otimização', { sub: 'camadas incluídas' }) +
    wf.block('o que foi ajustado', { cond: true, h: 88 }) +
    wf.block('restaurar configuração original', { cta: true, h: 60 })
  );

  /* 2B — controle no topo, ação fixa no rodapé */
  const b = wf.board('2B', 'Controle no topo',
    'Toggle sobe para junto do cabeçalho — acessível sem rolar. O alerta vira contexto abaixo do controle. Reversão sai do fluxo e vira barra fixa.',
    wf.group('cabeçalho + controle',
      wf.block('cabeçalho do jogo', { h: 40 }) +
      wf.toggle('otimização')
    ) +
    wf.block('alerta de hardware', { cond: true, h: 88 }) +
    wf.block('camadas incluídas', { h: 68 }) +
    wf.block('o que foi ajustado', { cond: true, h: 88 }),
    wf.bar('restaurar configuração original')
  );

  /* 2C — duas colunas: diagnóstico separado da ação */
  const c = wf.board('2C', 'Duas colunas',
    'Coluna esquerda concentra diagnóstico, direita concentra ação e resultado. Os dois blocos condicionais ficam em colunas diferentes.',
    wf.block('cabeçalho do jogo', { h: 44 }) +
    `<div class="wf-cols">
      <div class="wf-col">
        <span class="wf-col__label">diagnóstico</span>
        ${wf.block('alerta de hardware', { cond: true, h: 150 })}
      </div>
      <div class="wf-col">
        <span class="wf-col__label">ação</span>
        ${wf.toggle('otimização', { sub: 'camadas incluídas' })}
        ${wf.block('o que foi ajustado', { cond: true, h: 76 })}
        ${wf.block('restaurar configuração original', { cta: true, h: 52 })}
      </div>
    </div>`
  );

  return a + b + c;
}

/* ---------- render do estudo ---------- */

function renderWireframe() {
  return `
  <div class="wf">
    <div class="wf-legend">
      <span class="wf-legend__item"><span class="wf-swatch"></span>bloco</span>
      <span class="wf-legend__item"><span class="wf-swatch wf-swatch--cond"></span>bloco condicional</span>
      <span class="wf-legend__item"><span class="wf-chip wf-chip--cta">CTA</span>ponto de ação</span>
      <span class="wf-legend__item"><span class="wf-swatch wf-swatch--bar"></span>barra fixa de rodapé</span>
      <span class="wf-legend__note">estrutura e posição apenas — sem cor, sem copy, sem dado</span>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 1 · PC Booster</h2>
      <div class="wf-boards">${wireTela1()}</div>
    </div>

    <div class="wf-screen">
      <h2 class="wf-screen__title">Tela 2 · Detalhe do jogo</h2>
      <div class="wf-boards">${wireTela2()}</div>
    </div>
  </div>`;
}
