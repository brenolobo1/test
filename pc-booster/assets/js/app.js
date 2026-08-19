/* ==========================================================================
   PC Booster — protótipo clicável
   Todo estado é local e simulado. Nada toca o sistema.
   ========================================================================== */

const state = {
  mode: 'fullscreen',        // fullscreen | drawer | inline
  selectedId: null,
  optimized: {},             // { [gameId]: true }
  lastAction: {},            // { [gameId]: 'on' | 'off' | 'restored' }
  confirm: null              // { scope:'game'|'all', id }
};

const $ = (sel) => document.querySelector(sel);
const game = (id) => GAMES.find(g => g.id === id);

/* ---------- helpers de render ---------- */

function statusBadge(g) {
  const s = STATUS[g.status];
  return `<span class="badge ${s.cls}"><span class="dot"></span>${s.label}</span>`;
}

function runningBadge(g) {
  return g.running ? `<span class="badge badge--live"><span class="dot"></span>Em execução</span>` : '';
}

function optBadge(g) {
  return state.optimized[g.id]
    ? `<span class="badge badge--ok">Otimização ativa</span>`
    : '';
}

/* ---------- tela principal ---------- */

function renderMain() {
  return `
  <div class="screen">

    <!-- ① Cabeçalho da seção -->
    <div class="section">
      <h1 class="heading-lg">PC Booster</h1>
      <p class="body-md ph" style="margin-top:8px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit — descrição da seção.
      </p>
    </div>

    <!-- ② Hardware detectado (mockado) -->
    <div class="section">
      <div class="section__head">
        <h2 class="heading-sm">Hardware detectado <span class="ph-tag">mock</span></h2>
        <span class="body-xs dim">Detectado há 2 min</span>
      </div>
      <div class="card">
        <div class="hw-grid">
          ${['cpu','gpu','ram'].map(k => `
            <div class="hw-item">
              <div class="hw-item__label">${HARDWARE[k].label}</div>
              <div class="hw-item__value">${HARDWARE[k].value}</div>
              <div class="hw-item__meta">${HARDWARE[k].meta}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- ③ Jogos instalados (mockado) -->
    <div class="section">
      <div class="section__head">
        <h2 class="heading-sm">Jogos instalados <span class="ph-tag">mock</span></h2>
        <span class="body-xs dim">${GAMES.length} jogos</span>
      </div>
      <div class="stack-md">
        ${GAMES.map(renderGameRow).join('')}
      </div>
    </div>

    <!-- ⑥ Reversão global — Direção A -->
    <div class="section">
      <div class="card">
        <div class="row-between">
          <div>
            <div class="body-lg">Restaurar configuração original</div>
            <div class="body-xs ph" style="margin-top:4px">
              Lorem ipsum — texto explicando o que o botão desfaz em todos os jogos.
            </div>
          </div>
          ${state.confirm && state.confirm.scope === 'all'
            ? `<div class="row">
                 <span class="body-xs ph">Confirmar?</span>
                 <button class="btn btn--ghost btn--sm" data-action="cancel-confirm">Cancelar</button>
                 <button class="btn btn--primary btn--sm" data-action="do-restore-all">Restaurar tudo</button>
               </div>`
            : `<button class="btn btn--danger" data-action="ask-restore-all">Restaurar configuração original</button>`}
        </div>
        ${state.lastAction.__all === 'restored'
          ? `<div class="msg msg--success" style="margin-top:16px">
               <span class="msg__icon">✓</span>
               <span class="ph">Mensagem de confirmação — configuração original restaurada em todos os jogos.</span>
             </div>` : ''}
      </div>
    </div>

  </div>`;
}

function renderGameRow(g) {
  const isOpen = state.mode === 'inline' && state.selectedId === g.id;
  return `
  <div class="game ${isOpen ? 'is-open' : ''} game--clickable">
    <div class="game__row" data-action="open-game" data-id="${g.id}">
      <div class="game__thumb">capa</div>
      <div class="game__info">
        <div class="game__name">${g.name}</div>
        <div class="game__meta">${g.engine} · ${g.installPath}</div>
      </div>
      <div class="game__side">
        ${optBadge(g)}
        ${runningBadge(g)}
        ${statusBadge(g)}
        <span class="chev">${isOpen ? '⌃' : '›'}</span>
      </div>
    </div>
    ${isOpen ? `<div class="game__expand">${renderDetailBody(g)}</div>` : ''}
  </div>`;
}

/* ---------- detalhe do jogo (compartilhado pelos 3 modos) ---------- */

function renderDetailBody(g) {
  const on = !!state.optimized[g.id];
  const sev = g.severity ? SEVERITY[g.severity] : null;

  return `
  <div class="stack-md">

    ${sev ? `
    <!-- ④ Alerta de hardware abaixo do recomendado -->
    <div class="alert alert--${g.severity}">
      <div class="alert__icon">!</div>
      <div style="flex:1">
        <div class="alert__level">${sev.label}</div>
        <div class="heading-sm ph" style="margin:6px 0 6px">${sev.title}</div>
        <div class="body-md ph">${sev.body}</div>
        ${renderRequirements(g)}
      </div>
    </div>` : `
    <div class="msg msg--success">
      <span class="msg__icon">✓</span>
      <span class="ph">Mensagem — o hardware atende aos requisitos recomendados deste jogo.</span>
    </div>`}

    <!-- ⑤ Toggle de otimização (2 camadas) -->
    <div class="card">
      <div class="row-between">
        <div>
          <div class="body-lg">Otimização deste jogo</div>
          <div class="body-xs ph" style="margin-top:4px">Lorem ipsum — texto de apoio do toggle.</div>
        </div>
        <div class="switch" role="switch" tabindex="0" aria-checked="${on}" data-action="toggle-opt" data-id="${g.id}">
          <span class="switch__label muted">${on ? 'Ligado' : 'Desligado'}</span>
          <span class="switch__track"><span class="switch__thumb"></span></span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="body-sm muted" style="margin-bottom:8px">Camadas incluídas</div>
      <div class="stack-sm">
        <div class="layer ${on ? '' : 'layer--off'}">
          <div class="layer__icon">⚙</div>
          <div class="layer__txt">
            <div class="layer__name">Config de engine — ${g.engine}</div>
            <div class="layer__desc">${g.engineLayer
              ? 'Arquivos globais da engine · afeta todos os jogos que usam ' + g.engine
              : 'Engine sem camada de config mapeada — não aplicável'}</div>
          </div>
          <span class="badge ${g.engineLayer ? (on ? 'badge--ok' : 'badge--neutral') : 'badge--neutral'}">
            ${g.engineLayer ? (on ? 'Aplicada' : 'Inativa') : 'N/A'}
          </span>
        </div>
        <div class="layer ${on ? '' : 'layer--off'}">
          <div class="layer__icon">▣</div>
          <div class="layer__txt">
            <div class="layer__name">Perfil de driver GPU — NVIDIA</div>
            <div class="layer__desc">Perfil por jogo via API do driver</div>
          </div>
          <span class="badge ${on ? 'badge--ok' : 'badge--neutral'}">${on ? 'Aplicada' : 'Inativa'}</span>
        </div>
      </div>

      ${renderToggleFeedback(g, on)}
    </div>

    ${on ? renderAdjustments(g) : ''}

    <!-- ⑥ Reversão por jogo — Direção A -->
    <div class="card">
      <div class="row-between">
        <div>
          <div class="body-lg">Restaurar configuração original</div>
          <div class="body-xs ph" style="margin-top:4px">Lorem ipsum — texto explicando o que é desfeito neste jogo.</div>
        </div>
        ${state.confirm && state.confirm.scope === 'game' && state.confirm.id === g.id
          ? `<div class="row">
               <span class="body-xs ph">Confirmar?</span>
               <button class="btn btn--ghost btn--sm" data-action="cancel-confirm">Cancelar</button>
               <button class="btn btn--primary btn--sm" data-action="do-restore-game" data-id="${g.id}">Restaurar</button>
             </div>`
          : `<button class="btn btn--danger" data-action="ask-restore-game" data-id="${g.id}">Restaurar configuração original</button>`}
      </div>
      ${state.lastAction[g.id] === 'restored'
        ? `<div class="msg msg--success" style="margin-top:16px">
             <span class="msg__icon">✓</span>
             <span class="ph">Mensagem de confirmação — configuração original deste jogo restaurada.</span>
           </div>` : ''}
    </div>

  </div>`;
}

function renderRequirements(g) {
  const cls = { pass:'pass', warn:'warn', fail:'fail' };
  return `
  <table class="req">
    <thead>
      <tr><th>Componente</th><th>Mínimo</th><th>Recomendado</th><th>Seu PC</th></tr>
    </thead>
    <tbody>
      ${g.requirements.map(r => `
        <tr>
          <td class="muted">${r.part}</td>
          <td class="dim">${r.min}</td>
          <td class="dim">${r.rec}</td>
          <td class="col-you ${cls[r.verdict]}">${r.you}${r.verdict === 'fail' ? ' ✕' : r.verdict === 'warn' ? ' !' : ' ✓'}</td>
        </tr>`).join('')}
    </tbody>
  </table>
  <div class="req__source">Requisitos no formato de tiers do PCGamingWiki (minimum / recommended / alt) — dados mockados</div>`;
}

function renderToggleFeedback(g, on) {
  const act = state.lastAction[g.id];
  if (act === 'on') {
    return `<div class="msg msg--info" style="margin-top:16px">
      <span class="msg__icon">i</span>
      <span class="ph">${g.running
        ? 'Mensagem — o jogo está em execução, a otimização foi aplicada agora.'
        : 'Mensagem — a otimização será aplicada quando o jogo abrir.'}</span>
    </div>`;
  }
  if (act === 'off') {
    return `<div class="msg ${g.running ? 'msg--info' : 'msg--neutral'}" style="margin-top:16px">
      <span class="msg__icon">i</span>
      <span class="ph">${g.running
        ? 'Mensagem — o jogo está em execução, a otimização foi revertida agora.'
        : 'Mensagem — a otimização não será aplicada no próximo launch.'}</span>
    </div>`;
  }
  if (!on) {
    return `<div class="msg msg--neutral" style="margin-top:16px">
      <span class="msg__icon">i</span>
      <span class="ph">Mensagem de estado — otimização desligada para este jogo.</span>
    </div>`;
  }
  return '';
}

function renderAdjustments(g) {
  const real = !!g.adjustments;
  const list = g.adjustments || PLACEHOLDER_ADJUSTMENTS;
  const kindCls = { down:'adj__val--down', keep:'adj__val--keep', ph:'adj__val--ph' };
  const kindTag = { down:'reduzido', keep:'mantido', ph:'—' };

  return `
  <div class="card">
    <div class="section__head" style="margin-bottom:12px">
      <h3 class="heading-sm">O que foi ajustado</h3>
      ${real ? `<span class="badge badge--neutral">${g.engine}</span>`
             : `<span class="ph-tag">conteúdo não mapeado</span>`}
    </div>

    <div class="adj">
      ${list.map(a => `
        <div class="adj__item">
          <span class="adj__name ${real ? '' : 'ph-label'}">${a.name}</span>
          <span class="adj__tag">${kindTag[a.kind]}</span>
          <span class="adj__val ${kindCls[a.kind]}">${a.value}</span>
        </div>`).join('')}
    </div>

    ${real ? `<div class="body-xs ph" style="margin-top:12px">
      Lorem ipsum — nota explicando que a otimização é seletiva: nem todo atributo é reduzido.
    </div>` : ''}

    <div class="divider"></div>

    <div class="body-sm muted" style="margin-bottom:8px">Perfil de driver GPU</div>
    ${g.gpuMetric ? `
      <div class="metric">
        <span class="metric__label">${g.gpuMetric.label}</span>
        <span class="metric__from">${g.gpuMetric.from}</span>
        <span class="metric__arrow">→</span>
        <span class="metric__to">${g.gpuMetric.to}</span>
      </div>
      <div class="body-xs dim" style="margin-top:8px">Medido em ${HARDWARE.gpu.value}</div>`
    : `<div class="metric">
        <span class="metric__label ph-label">Métrica placeholder</span>
        <span class="metric__from ph">—</span>
        <span class="metric__arrow">→</span>
        <span class="metric__to ph">—</span>
      </div>`}
  </div>`;
}

/* ---------- shell: 3 modos de navegação ---------- */

function render() {
  document.body.dataset.mode = state.mode;
  const g = state.selectedId ? game(state.selectedId) : null;

  $('#mainScreen').innerHTML = renderMain();

  const detailScreen = $('#detailScreen');
  const drawer = $('#drawer');
  const overlay = $('#overlay');

  // A · tela cheia
  if (state.mode === 'fullscreen' && g) {
    detailScreen.hidden = false;
    $('#mainScreen').hidden = true;
    detailScreen.innerHTML = `
      <div class="screen">
        <div class="section">
          <button class="btn btn--ghost btn--sm" data-action="close-detail">‹ Voltar</button>
        </div>
        <div class="section">
          <div class="row" style="gap:12px;margin-bottom:6px">
            <h1 class="heading-lg">${g.name}</h1>
            ${runningBadge(g)} ${statusBadge(g)}
          </div>
          <div class="body-xs dim">${g.engine} · ${g.installPath}</div>
        </div>
        ${renderDetailBody(g)}
      </div>`;
  } else {
    detailScreen.hidden = true;
    detailScreen.innerHTML = '';
    $('#mainScreen').hidden = false;
  }

  // B · drawer lateral
  if (state.mode === 'drawer' && g) {
    $('#drawerTitle').textContent = g.name;
    $('#drawerSub').textContent = `${g.engine} · ${g.installPath}`;
    $('#drawerBody').innerHTML = `
      <div class="row" style="gap:8px;margin-bottom:16px">${runningBadge(g)} ${statusBadge(g)}</div>
      ${renderDetailBody(g)}`;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
  } else {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    if (state.mode !== 'drawer') $('#drawerBody').innerHTML = '';
  }

  // C · card expansível já é renderizado dentro de renderGameRow
}

/* ---------- ações ---------- */

function handleAction(action, id) {
  switch (action) {
    case 'open-game':
      state.selectedId = (state.mode === 'inline' && state.selectedId === id) ? null : id;
      state.confirm = null;
      break;
    case 'close-detail':
      state.selectedId = null;
      state.confirm = null;
      break;
    case 'toggle-opt': {
      const on = !state.optimized[id];
      state.optimized[id] = on;
      state.lastAction[id] = on ? 'on' : 'off';
      break;
    }
    case 'ask-restore-game': state.confirm = { scope:'game', id }; break;
    case 'ask-restore-all':  state.confirm = { scope:'all' };      break;
    case 'cancel-confirm':   state.confirm = null;                 break;
    case 'do-restore-game':
      state.optimized[id] = false;
      state.lastAction[id] = 'restored';
      state.confirm = null;
      break;
    case 'do-restore-all':
      GAMES.forEach(g => { state.optimized[g.id] = false; delete state.lastAction[g.id]; });
      state.lastAction.__all = 'restored';
      state.confirm = null;
      break;
    default: return false;
  }
  render();
  return true;
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (el) { handleAction(el.dataset.action, el.dataset.id); return; }
  if (e.target.id === 'overlay') handleAction('close-detail');
});

document.addEventListener('keydown', (e) => {
  const el = document.activeElement;
  if ((e.key === 'Enter' || e.key === ' ') && el && el.dataset && el.dataset.action) {
    e.preventDefault();
    handleAction(el.dataset.action, el.dataset.id);
  }
  if (e.key === 'Escape' && state.selectedId) handleAction('close-detail');
});

/* ---------- painel de teste ---------- */

$('#modeSwitch').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-mode]');
  if (!btn) return;
  state.mode = btn.dataset.mode;
  state.selectedId = null;
  state.confirm = null;
  [...$('#modeSwitch').children].forEach(b =>
    b.setAttribute('aria-pressed', String(b === btn)));
  render();
});

$('#resetState').addEventListener('click', () => {
  state.selectedId = null;
  state.optimized = {};
  state.lastAction = {};
  state.confirm = null;
  render();
});

render();
