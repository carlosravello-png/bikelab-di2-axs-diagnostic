// BikeLab Di2/AXS Diagnostic — engine.
// TREE (src/tree.json) and UI (src/ui.json) are inserted above this code by tools/build.mjs.
// Language: the page's <html lang> (en, es, pt-BR); ?lang=en|es|pt overrides it.

let LANG = (function () {
  var p = new URLSearchParams(location.search).get('lang');
  if (p === 'en' || p === 'es' || p === 'pt') return p;
  var h = (document.documentElement.lang || 'en').toLowerCase();
  if (h.indexOf('pt') === 0) return 'pt';
  if (h.indexOf('es') === 0) return 'es';
  return 'en';
})();

function t(key) { return (UI[LANG] && UI[LANG][key]) || UI.en[key]; }
function tx(obj) { return obj ? (obj[LANG] || obj.en) : ''; }
function md(s) { return s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); }

function updateStaticText() {
  var st = UI[LANG].static;
  Object.keys(st).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (id === 'h-title') el.innerHTML = st[id]; else el.textContent = st[id];
  });
  document.getElementById('prog-label').textContent = t('progress');
  document.getElementById('faq-en').style.display = LANG === 'en' ? 'block' : 'none';
  document.getElementById('faq-es').style.display = LANG === 'en' ? 'none' : 'block';
}

// ─── STATE & ENGINE ────────────────────────────────────────────────────────
let history = [];
let current = 'q0';

function getNode(id) { return TREE[id]; }

function render(nodeId) {
  current = nodeId;
  const node = getNode(nodeId);
  if (!node) return;

  const fill = node.progress || 10;
  document.getElementById('prog-fill').style.width = fill + '%';

  const container = document.getElementById('tool-container');
  container.innerHTML = '';

  if (history.length > 0) {
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.textContent = t('back');
    backBtn.onclick = goBack;
    container.appendChild(backBtn);
  }

  if (node.type) {
    renderResult(node, container);
  } else {
    renderQuestion(node, container);
  }
}

function renderQuestion(node, container) {
  const card = document.createElement('div');
  card.className = 'card';

  const step = document.createElement('p');
  step.className = 'card-step';
  step.textContent = tx(node.step);
  card.appendChild(step);

  const q = document.createElement('h2');
  q.className = 'card-question';
  q.textContent = tx(node.q);
  card.appendChild(q);

  if (node.desc) {
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.innerHTML = md(tx(node.desc));
    card.appendChild(desc);
  }

  const opts = document.createElement('div');
  opts.className = 'options';

  node.opts.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'opt ' + (opt.cls || '');

    const key = document.createElement('span');
    key.className = 'opt-key';
    key.textContent = opt.key;
    btn.appendChild(key);

    const textWrap = document.createElement('div');
    const text = document.createElement('div');
    text.className = 'opt-text';
    text.textContent = tx(opt.text);
    textWrap.appendChild(text);

    if (opt.sub) {
      const sub = document.createElement('div');
      sub.className = 'opt-sub';
      sub.textContent = tx(opt.sub);
      textWrap.appendChild(sub);
    }

    btn.appendChild(textWrap);
    btn.onclick = () => { history.push(current); render(opt.next); };
    opts.appendChild(btn);
  });

  card.appendChild(opts);
  container.appendChild(card);
}

function renderResult(node, container) {
  const typeMap = { solved: 'solved', limit: 'limit', workshop: 'workshop' };
  const iconMap = {
    solved: { cls: 'green', label: t('solved') },
    limit: { cls: 'orange', label: t('limit') },
    workshop: { cls: 'red', label: t('workshop') },
  };

  const card = document.createElement('div');
  card.className = 'result-card ' + (typeMap[node.type] || 'limit');

  const icon = document.createElement('div');
  icon.className = 'result-icon ' + iconMap[node.type].cls;
  icon.textContent = iconMap[node.type].label;
  card.appendChild(icon);

  const step = document.createElement('p');
  step.className = 'card-step';
  step.textContent = tx(node.step);
  card.appendChild(step);

  const title = document.createElement('h2');
  title.className = 'result-title';
  title.textContent = tx(node.title);
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.innerHTML = md(tx(node.desc));
  card.appendChild(desc);

  if (node.steps && node.steps.length > 0) {
    const ul = document.createElement('ul');
    ul.className = 'result-steps';
    node.steps.forEach((s, i) => {
      const li = document.createElement('li');
      const num = document.createElement('span');
      num.className = 'step-num';
      num.textContent = String(i + 1).padStart(2, '0');
      li.appendChild(num);
      const txt = document.createElement('span');
      txt.innerHTML = md(tx(s));
      li.appendChild(txt);
      ul.appendChild(li);
    });
    card.appendChild(ul);
  }

  if (node.prevention) {
    const prev = document.createElement('div');
    prev.className = 'result-note';
    prev.innerHTML = '<strong>' + t('prevention_label') + '</strong>' + tx(node.prevention);
    card.appendChild(prev);
  }

  if (node.warranty) {
    const w = document.createElement('div');
    w.className = 'result-note';
    w.innerHTML = '<strong>' + t('warranty_label') + '</strong>' + t('warranty_text');
    card.appendChild(w);
  }

  if (node.community) {
    const cn = document.createElement('div');
    cn.className = 'result-note community';
    cn.textContent = t('community_note');
    card.appendChild(cn);
  }

  // Peru note
  const peru = document.createElement('div');
  peru.className = 'peru-note';
  peru.innerHTML = t('peru') + '<a href="https://wa.me/51934391545?text=' + encodeURIComponent(t('wa_peru')) + '" style="color:var(--yellow);text-decoration:none"><strong>' + t('peru2') + '</strong></a>';
  card.appendChild(peru);

  // Social follow
  const social = document.createElement('div');
  social.className = 'social-follow';
  const socialText = document.createElement('p');
  socialText.className = 'social-follow-text';
  socialText.textContent = t('social_cta');
  social.appendChild(socialText);
  const socialBtns = document.createElement('div');
  socialBtns.className = 'social-follow-btns';
  const ig = document.createElement('a');
  ig.className = 'btn-social';
  ig.href = 'https://www.instagram.com/bikelab.studio';
  ig.target = '_blank';
  ig.rel = 'noopener';
  ig.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>' + t('social_ig');
  socialBtns.appendChild(ig);
  const fb = document.createElement('a');
  fb.className = 'btn-social';
  fb.href = 'https://www.facebook.com/bikelabstudio.peru';
  fb.target = '_blank';
  fb.rel = 'noopener';
  fb.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' + t('social_fb');
  socialBtns.appendChild(fb);
  social.appendChild(socialBtns);
  card.appendChild(social);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'actions';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'btn-restart';
  restartBtn.textContent = t('restart');
  restartBtn.onclick = () => { history = []; render('q0'); };
  actions.appendChild(restartBtn);

  if (node.type === 'workshop') {
    const shimano = document.createElement('a');
    shimano.className = 'btn-service';
    shimano.href = 'https://si.shimano.com';
    shimano.target = '_blank';
    shimano.rel = 'noopener';
    shimano.textContent = t('shimano_service') + ' →';
    actions.appendChild(shimano);

    const sram = document.createElement('a');
    sram.className = 'btn-service';
    sram.href = 'https://www.sram.com/en/service';
    sram.target = '_blank';
    sram.rel = 'noopener';
    sram.textContent = t('sram_service') + ' →';
    actions.appendChild(sram);
  }

  const wa = document.createElement('a');
  wa.className = 'btn-wa';
  wa.href = 'https://wa.me/51934391545?text=' + encodeURIComponent(t('wa_button'));
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.textContent = t('wa') + ' →';
  actions.appendChild(wa);

  card.appendChild(actions);
  container.appendChild(card);
}

function goBack() {
  if (history.length > 0) {
    const prev = history.pop();
    render(prev);
  }
}

function restart() {
  history = [];
  render('q0');
}

// Init
updateStaticText();
render('q0');
