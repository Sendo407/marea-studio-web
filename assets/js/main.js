/* Marae Blue Studio — interacciones de la web (diseño v2, 2026-11-22) */

const CONFIG = {
  // Webhook de n8n que recibe el formulario de contacto.
  // OJO: la URL "webhook-test" solo funciona mientras n8n está en "Listen for test event".
  // Para producción, cambia "/webhook-test/" por "/webhook/" y activa el workflow.
  contactWebhook: 'https://danieltest.app.n8n.cloud/webhook-test/58aa7781-8727-4aaf-8c51-b2b4e94a3064'
};

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCarousel();
  initFaq();
  initContactForm();
  initReveals();
  initParallax();
  initMetric();
  initMethodNet();
  initCursor();
  initSmoothLinks();
});

/* Menú: desplegable de servicios (escritorio) y menú móvil */
function initNav() {
  const svcBtn = document.querySelector('[data-svc-toggle]');
  const svcMenu = document.getElementById('svc-dd');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobilemenu');

  const setSvc = (open) => {
    if (!svcBtn) return;
    svcMenu.hidden = !open;
    svcBtn.setAttribute('aria-expanded', String(open));
  };
  const setMenu = (open) => {
    if (!menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menuBtn.querySelector('[data-icon-open]').hidden = open;
    menuBtn.querySelector('[data-icon-close]').hidden = !open;
  };

  if (svcBtn) svcBtn.addEventListener('click', () => setSvc(svcMenu.hidden));
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  [svcMenu, menu].forEach((box) => box && box.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { setSvc(false); setMenu(false); })));

  document.addEventListener('pointerdown', (e) => { if (svcMenu && !svcMenu.hidden && !e.target.closest('.nl-dd')) setSvc(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (svcMenu && !svcMenu.hidden) { setSvc(false); svcBtn.focus(); }
    if (menu && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
}

/* Carrusel "Lo que nos define": flechas */
function initCarousel() {
  const sc = document.querySelector('.car');
  if (!sc) return;
  document.querySelectorAll('[data-car]').forEach((btn) => btn.addEventListener('click', () => {
    const card = sc.querySelector('.car-card');
    const step = card ? card.getBoundingClientRect().width + 20 : 440;
    sc.scrollBy({ left: Number(btn.dataset.car) * step, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }));
}

/* Preguntas frecuentes en forma de chat */
const FAQ = [
  { q: '¿Por dónde empezamos si no sé qué necesito?', a: 'Por una conversación. Nos cuentas tu negocio y tu idea, y te decimos con honestidad qué te conviene y qué no. Sin compromiso.' },
  { q: '¿Cuánto cuesta trabajar con vosotros?', a: 'Depende de lo que necesites, por eso no tenemos tarifas cerradas. Antes de empezar te preparamos un presupuesto a medida, por escrito y sin letra pequeña.' },
  { q: '¿Cuándo voy a ver resultados?', a: 'Depende del servicio: unas acciones se notan antes que otras. Lo que sí hacemos siempre es fijar objetivos y fechas desde el principio, y enseñarte cómo avanza todo con informes claros.' },
  { q: '¿Lo hacéis todo o solo una parte?', a: 'Lo que necesites. Web, publicidad, SEO, redes, estrategia y email marketing: puedes empezar por un servicio o dejarlo todo en nuestras manos. Siempre con el mismo equipo.' },
  { q: '¿Con quién voy a hablar?', a: 'Con personas reales que conocen tu proyecto. Siempre sabrás en qué punto está y quién se encarga de él.' },
  { q: '¿Trabajáis con negocios que están empezando?', a: '¡Claro! Emprender es un momento de cambio, y también puede ser divertido. Te acompañamos desde la primera idea.' },
  { q: '¿Cuánto tardáis en responder?', a: 'Contestamos cada mensaje en menos de [00] horas laborables. Es uno de nuestros compromisos.' }
];
function initFaq() {
  const list = document.querySelector('.faq-chip-list');
  const thread = document.querySelector('.faq-thread');
  if (!list || !thread) return;
  const end = thread.querySelector('[data-faq-end]');
  const bar = document.querySelector('[data-faq-bar]');
  const count = document.querySelector('[data-faq-count]');
  const reset = document.querySelector('[data-faq-reset]');
  document.querySelector('[data-faq-total]').textContent = FAQ.length;
  const okIcon = '<svg class="fq-ok" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"></path></svg>';
  list.innerHTML = FAQ.map((f, i) => `<button class="fq-chip" type="button" aria-pressed="false" data-i="${i}"><span class="fq-n">0${i + 1}</span><span>${esc(f.q)}</span>${okIcon}</button>`).join('');

  let done = 0, typing = false, timer = 0;
  const toBottom = () => setTimeout(() => { thread.scrollTop = thread.scrollHeight; }, 30);
  const progress = () => {
    bar.style.width = Math.round(done / FAQ.length * 100) + '%';
    count.textContent = done;
    end.hidden = done < FAQ.length;
  };
  const msg = (cls, html) => { const d = document.createElement('div'); d.className = 'fq-msg ' + cls; d.innerHTML = html; thread.insertBefore(d, end); return d; };

  list.addEventListener('click', (e) => {
    const chip = e.target.closest('.fq-chip');
    if (!chip || typing || chip.classList.contains('done')) return;
    const f = FAQ[Number(chip.dataset.i)];
    chip.classList.add('done');
    chip.setAttribute('aria-pressed', 'true');
    reset.hidden = false;
    typing = true;
    msg('me', `<p>${esc(f.q)}</p>`);
    const dots = msg('bot typing', '<span></span><span></span><span></span>');
    dots.setAttribute('aria-label', 'Escribiendo');
    toBottom();
    timer = setTimeout(() => {
      dots.remove();
      msg('bot', `<p>${esc(f.a)}</p>`);
      typing = false; done += 1; progress(); toBottom();
    }, reduceMotion() ? 0 : 1100);
  });
  reset.addEventListener('click', () => {
    clearTimeout(timer); typing = false; done = 0;
    thread.querySelectorAll('.fq-msg:not(:first-child):not([data-faq-end])').forEach((m) => m.remove());
    list.querySelectorAll('.fq-chip').forEach((c) => { c.classList.remove('done'); c.setAttribute('aria-pressed', 'false'); });
    reset.hidden = true; progress();
  });
}

/* Formulario de contacto: postal en directo y envío al webhook de n8n */
const CT_OPTIONS = ['Estrategia de marca', 'Contenido y redes', 'Publicidad online', 'Web', 'SEO', 'Email marketing', 'Aún no lo sé'];
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const box = document.querySelector('[data-ct]');
  const doneBox = document.querySelector('[data-ct-done]');
  const card = box.querySelector('.ct-card');
  const chips = form.querySelector('.ct-chips');
  const tags = box.querySelector('.ct-tags');
  const error = form.querySelector('[data-ct-error]');
  const send = form.querySelector('.ct-send');
  const pv = (k) => box.querySelector(`[data-pv="${k}"]`);
  const val = (n) => form.elements[n].value.trim();
  let picked = [];

  chips.innerHTML = CT_OPTIONS.map((o) => `<button class="ct-chip" type="button" aria-pressed="false" data-opt="${esc(o)}"><span class="ct-plus" aria-hidden="true"></span>${esc(o)}</button>`).join('');

  const update = () => {
    const nm = val('name'), bz = val('company'), ml = val('email'), msg = val('message');
    const filled = [nm, bz, msg, ml].filter(Boolean).length + (picked.length ? 1 : 0);
    const pct = Math.round(filled / 5 * 100);
    form.querySelector('[data-ct-bar]').style.width = pct + '%';
    form.querySelector('[data-ct-meter]').textContent = pct === 0 ? 'Empieza por tu nombre' : pct < 60 ? 'Vas muy bien' : pct < 100 ? 'Ya casi está' : 'Listo para enviar';
    pv('name').textContent = nm || 'Tu nombre'; pv('name').className = nm ? '' : 'ph';
    pv('mail').textContent = ml || 'tu@email.com'; pv('mail').className = ml ? '' : 'ph';
    pv('subject').textContent = bz ? 'Nueva idea: ' + bz : 'Una nueva idea';
    pv('body').textContent = 'Hola, ' + (nm ? 'soy ' + nm : 'soy…') + (bz ? ' y tengo ' + bz + '.' : '.') + (msg ? '\n\n' + msg : '');
    tags.innerHTML = picked.map((t) => `<span class="ct-tag">${esc(t)}</span>`).join('');
  };

  chips.addEventListener('click', (e) => {
    const c = e.target.closest('.ct-chip');
    if (!c) return;
    const o = c.dataset.opt, on = !picked.includes(o);
    picked = on ? picked.concat([o]) : picked.filter((x) => x !== o);
    c.classList.toggle('on', on);
    c.setAttribute('aria-pressed', String(on));
    update();
  });
  form.addEventListener('input', update);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (val('website')) return; // campo trampa anti-spam

    const data = new URLSearchParams();
    data.append('request', 'Reunión gratuita');
    data.append('name', val('name'));
    data.append('company', val('company'));
    data.append('email', val('email'));
    data.append('service', picked.join(', '));
    data.append('message', val('message'));
    data.append('privacy', 'aceptada');
    data.append('source', 'web-marae-blue-studio');
    data.append('page', location.href);
    data.append('sentAt', new Date().toISOString());

    send.disabled = true;
    card.classList.add('fly');
    try {
      // URL-encoded + no-cors: petición "simple", sin preflight CORS, llega a n8n
      // aunque el webhook no devuelva cabeceras CORS. n8n lo recibe en body.name, body.email…
      await Promise.all([
        fetch(CONFIG.contactWebhook, { method: 'POST', mode: 'no-cors', body: data }),
        new Promise((r) => setTimeout(r, reduceMotion() ? 0 : 900))
      ]);
      const nm = val('name');
      doneBox.querySelector('[data-ct-title]').textContent = nm ? `Gracias, ${nm}.` : 'Gracias.';
      box.hidden = true;
      doneBox.hidden = false;
      doneBox.querySelector('[data-ct-title]').focus();
    } catch (err) {
      error.textContent = 'No hemos podido enviar tu mensaje. Inténtalo de nuevo en un momento.';
      error.hidden = false;
    } finally {
      send.disabled = false;
      card.classList.remove('fly');
    }
  });

  doneBox.querySelector('[data-ct-reset]').addEventListener('click', () => {
    form.reset(); picked = [];
    chips.querySelectorAll('.ct-chip').forEach((c) => { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
    update();
    doneBox.hidden = true; box.hidden = false;
  });
}

/* Animaciones al entrar en pantalla (una sola vez) */
function initReveals() {
  if (!('IntersectionObserver' in window)) return;
  const root = document.querySelector('.ms');
  root.classList.add('rvon');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  root.querySelectorAll('.rv, .rvl, .rvt, .rvw, .rvc').forEach((el) => io.observe(el));
}

/* Hero con parallax, menú que se convierte en isla al bajar y pie que se revela */
function initParallax() {
  const rm = reduceMotion();
  const speedEls = Array.from(document.querySelectorAll('[data-speed]'));
  const depthEls = Array.from(document.querySelectorAll('[data-depth]'));
  const foot = document.querySelector('.seafoot');
  const frame = document.querySelector('.hero-frame');
  const bar = document.querySelector('.topbar');
  const heroIn = document.querySelector('.hero-card .hc-center');
  const mainEl = document.querySelector('main');
  let raf = 0;
  const tick = () => {
    raf = 0;
    const vh = window.innerHeight;
    const active = vh < 1800 && !rm;
    if (frame) {
      const top = frame.getBoundingClientRect().top;
      const hp = Math.min(1, Math.max(0, -top / 220));
      frame.style.setProperty('--hp', rm ? '1' : (1 - Math.pow(1 - hp, 3)).toFixed(3));
      const sc = Math.max(0, -top);
      if (bar) bar.classList.toggle('island', sc > 24);
      if (heroIn && active) {
        const k = Math.min(1, sc / (vh * 0.8));
        heroIn.style.transform = `translate3d(0,${(sc * 0.55).toFixed(1)}px,0) scale(${(1 - k * 0.06).toFixed(3)})`;
        heroIn.style.opacity = (1 - k).toFixed(3);
      }
    }
    speedEls.forEach((el) => {
      if (!active) { el.style.transform = ''; return; }
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -400 || r.top > vh + 400) return;
      const y = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed);
      el.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
    });
    if (foot) {
      const r = foot.getBoundingClientRect();
      const mb = mainEl ? mainEl.getBoundingClientRect().bottom : r.top;
      foot.classList.toggle('on', mb < vh + 4);
      foot.classList.toggle('tall', r.height > vh - 20);
      const p = active ? Math.min(1, Math.max(0, (vh - mb) / Math.min(r.height, vh))) : 1;
      const e = 1 - Math.pow(1 - p, 2);
      foot.style.setProperty('--fp', e.toFixed(3));
      depthEls.forEach((el) => { el.style.transform = `translate3d(0,${((1 - e) * parseFloat(el.dataset.depth)).toFixed(1)}px,0)`; });
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  tick();
}

/* Tarjeta "Resultados": gráfica animada con tooltip.
   Es una ilustración, no datos reales de clientes. */
function initMetric() {
  const box = document.querySelector('.metric');
  if (!box) return;
  const svg = box.querySelector('svg');
  const line = box.querySelector('.mt-line'), line2 = box.querySelector('.mt-line2'), area = box.querySelector('.mt-area');
  const dots = Array.from(box.querySelectorAll('.mt-dot'));
  const end = box.querySelector('.mt-end'), ring = box.querySelector('.mt-end-ring'), comet = box.querySelector('.mt-comet');
  const guide = box.querySelector('.mt-guide'), tip = box.querySelector('.mt-tip'), hit = box.querySelector('.mt-hit');
  const tT = box.querySelector('.mt-tip-t'), tV = box.querySelector('.mt-tip-v'), pct = box.querySelector('.mt-pct');
  const xs = [20, 80, 140, 200, 260, 320, 370];
  const b1 = [118, 104, 110, 84, 72, 46, 26], b2 = [128, 122, 124, 110, 104, 86, 74];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Hoy'];
  const rm = reduceMotion();
  const path = (ys) => { let d = 'M' + xs[0] + ',' + ys[0].toFixed(1); for (let i = 1; i < xs.length; i++) { const mx = (xs[i - 1] + xs[i]) / 2; d += ' C' + mx + ',' + ys[i - 1].toFixed(1) + ' ' + mx + ',' + ys[i].toFixed(1) + ' ' + xs[i] + ',' + ys[i].toFixed(1); } return d; };
  let y1 = b1.slice(), y2 = b2.slice(), hov = -1, visible = true, raf = 0;
  const t0 = performance.now();
  const fmt = (n) => Math.round(n).toLocaleString('es-ES');
  const render = (now) => {
    const t = (now - t0) / 1000;
    const lift = rm ? 0 : (Math.sin(t * 0.6) * 0.5 + 0.5);
    y1 = b1.map((v, i) => v + (rm ? 0 : Math.sin(t * 1.1 + i * 0.9) * 3.5) - lift * i * 1.6);
    y2 = b2.map((v, i) => v + (rm ? 0 : Math.sin(t * 0.9 + i * 1.1 + 1) * 2.5) - lift * i * 0.9);
    const d1 = path(y1);
    line.setAttribute('d', d1); line2.setAttribute('d', path(y2));
    area.setAttribute('d', d1 + ' L370,140 L20,140 Z');
    dots.forEach((c, i) => c.setAttribute('cy', y1[i].toFixed(1)));
    end.setAttribute('cy', y1[6].toFixed(1)); ring.setAttribute('cy', y1[6].toFixed(1));
    if (comet && !rm) { const L = line.getTotalLength(); const p = line.getPointAtLength(((t % 3.2) / 3.2) * L); comet.setAttribute('cx', p.x.toFixed(1)); comet.setAttribute('cy', p.y.toFixed(1)); comet.style.opacity = String(Math.min(1, Math.min(t % 3.2, 3.2 - (t % 3.2)) * 3)); }
    if (pct) pct.textContent = String(Math.round(120 + (b1[6] - y1[6]) * 2.2));
    if (hov >= 0) {
      const x = xs[hov], y = y1[hov];
      guide.setAttribute('x1', x); guide.setAttribute('x2', x);
      tip.setAttribute('transform', `translate(${Math.min(390 - 116, Math.max(0, x - 56))},${Math.max(0, y - 52)})`);
      tT.textContent = months[hov];
      tV.textContent = fmt((140 - y) * 14) + ' visitas · ' + fmt((140 - y2[hov]) * 3.2) + ' conv.';
      const w = tV.getComputedTextLength ? tV.getComputedTextLength() + 20 : 112;
      tip.querySelector('rect').setAttribute('width', Math.max(112, w).toFixed(0));
    }
  };
  const loop = (now) => { render(now); raf = visible ? requestAnimationFrame(loop) : 0; };
  const setHov = (i) => { hov = i; box.classList.toggle('hov', i >= 0); dots.forEach((c, k) => c.classList.toggle('on', k === i)); if (!raf) render(performance.now()); };
  const onMove = (e) => { const m = svg.getScreenCTM(); const x = m ? (e.clientX - m.e) / m.a : 0; let best = 0; xs.forEach((v, i) => { if (Math.abs(v - x) < Math.abs(xs[best] - x)) best = i; }); setHov(best); };
  hit.addEventListener('pointermove', onMove);
  hit.addEventListener('pointerdown', onMove);
  hit.addEventListener('pointerleave', () => setHov(-1));
  setTimeout(() => {
    line.style.strokeDasharray = 'none'; line.style.animation = 'none';
    if (rm) { render(performance.now()); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }, { threshold: 0 }).observe(box);
    } else { raf = requestAnimationFrame(loop); }
  }, 1900);
}

/* "Cómo trabajamos" en móvil: la red de líneas se dibuja en vertical según la posición de cada paso */
function initMethodNet() {
  const m = document.querySelector('.method');
  const svg = m && m.querySelector('.mnet-m');
  if (!svg) return;
  const f = (n) => n.toFixed(1);
  const draw = () => {
    if (window.innerWidth > 900) { svg.innerHTML = ''; return; }
    const R = m.getBoundingClientRect();
    const c = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2 - R.left, r.top + r.height / 2 - R.top]; };
    const dots = Array.from(m.querySelectorAll('.mstep .mdot')).map(c);
    if (dots.length < 4) return;
    const X = dots[0][0];
    svg.setAttribute('viewBox', '0 0 ' + R.width.toFixed(0) + ' ' + R.height.toFixed(0));
    let branch = '', junc = '';
    const spine = [];
    for (let i = 1; i < dots.length; i++) {
      const a = dots[i - 1], b = dots[i], my = (a[1] + b[1]) / 2, w = (i % 2 ? 10 : -10);
      spine.push('M' + f(X) + ',' + f(a[1]) + ' C' + f(X + w) + ',' + f(a[1] + (my - a[1]) * 0.6) + ' ' + f(X - w) + ',' + f(b[1] - (b[1] - my) * 0.6) + ' ' + f(X) + ',' + f(b[1]));
    }
    m.querySelectorAll('.mw .mn-word i').forEach((d) => {
      const p = c(d);
      branch += 'M' + f(X) + ',' + f(p[1] - 18) + ' C' + f(X + 14) + ',' + f(p[1] - 4) + ' ' + f(p[0] - 30) + ',' + f(p[1]) + ' ' + f(p[0] - 5) + ',' + f(p[1]) + ' ';
      junc += '<circle cx="' + f(X) + '" cy="' + f(p[1] - 18) + '" r="2.5"></circle>';
    });
    const ex = m.querySelector('.mw[data-after="3"] .mn-word i');
    if (ex) { const p = c(ex); spine.push('M' + f(X) + ',' + f(dots[3][1]) + ' L' + f(X) + ',' + f(p[1] - 18)); }
    let out = '<path class="mn-cross" pathLength="1" d="M' + f(X - 25) + ',' + f(dots[0][1]) + ' C' + f(X - 40) + ',' + f(dots[0][1] + 60) + ' ' + f(X - 40) + ',' + f(dots[3][1] - 60) + ' ' + f(X - 25) + ',' + f(dots[3][1]) + '"></path>';
    out += '<path class="mn-faint" pathLength="1" d="' + branch + '"></path>';
    spine.forEach((d) => { out += '<path class="mn-main" pathLength="1" d="' + d + '"></path>'; });
    out += junc;
    spine.forEach((d, i) => { out += '<path class="mn-pulse p' + i + '" pathLength="100" d="' + d + '"></path>'; });
    svg.innerHTML = out;
  };
  draw();
  setTimeout(draw, 800);
  window.addEventListener('resize', draw);
}

/* Cursor personalizado: punto naranja + aro que lo sigue con retardo.
   Solo en dispositivos con ratón; en móvil y tablet se usa el del sistema. */
function initCursor() {
  if (!window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cur = document.createElement('div');
  cur.className = 'cursor';
  cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
  document.body.appendChild(cur);
  document.documentElement.classList.add('has-cursor');
  const dot = cur.querySelector('.cursor-dot');
  const ring = cur.querySelector('.cursor-ring');

  const LINKS = 'a, button, summary, label.ct-consent, select, [role="button"]';
  let x = -100, y = -100, rx = -100, ry = -100, running = false;

  const loop = () => {
    rx += (x - rx) * (still ? 1 : 0.18);
    ry += (y - ry) * (still ? 1 : 0.18);
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) requestAnimationFrame(loop);
    else running = false;
  };

  document.addEventListener('mousemove', (e) => {
    x = e.clientX; y = e.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    cur.classList.add('on');
    const t = e.target;
    cur.classList.toggle('link', !!t.closest(LINKS));
    cur.classList.toggle('text', !!t.closest('input:not([type="radio"]):not([type="checkbox"]), textarea'));
    cur.classList.toggle('dark', !!t.closest('.on-dark'));
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });

  document.addEventListener('mousedown', () => cur.classList.add('down'));
  document.addEventListener('mouseup', () => cur.classList.remove('down'));
  document.documentElement.addEventListener('mouseleave', () => cur.classList.remove('on'));
}

/* Enlaces internos (#seccion): desplazamiento lento y suave en vez de salto.
   La duración depende de la distancia (entre 1,1 y 2,4 s) y frena al llegar. */
function initSmoothLinks() {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // easeInOutCubic
  let anim = null;

  const stop = () => { if (anim) { cancelAnimationFrame(anim); anim = null; } };
  // Si la persona usa la rueda, el trackpad o toca la pantalla, se le devuelve el control
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, stop, { passive: true }));

  // Posición final, recalculada en cada fotograma por si algo cambia de alto durante el recorrido
  const targetY = (el) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const off = parseFloat(getComputedStyle(el).scrollMarginTop) || 0; // hueco para el menú flotante
    return Math.min(max, Math.max(0, el.getBoundingClientRect().top + window.scrollY - off));
  };

  const scrollToEl = (el) => {
    stop();
    const from = window.scrollY;
    const to = targetY(el);
    const dist = to - from;
    if (still.matches || Math.abs(dist) < 2) { window.scrollTo({ top: to, behavior: 'instant' }); return; }
    const duration = Math.min(2400, Math.max(1100, 700 + Math.abs(dist) * 0.25));
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      window.scrollTo({ top: from + (targetY(el) - from) * ease(t), behavior: 'instant' });
      anim = t < 1 ? requestAnimationFrame(step) : null;
    };
    anim = requestAnimationFrame(step);
  };

  const goTo = (id) => {
    const target = id ? document.getElementById(id) : null;
    if (!target) return false;
    scrollToEl(target);
    history.pushState(null, '', '#' + id);
    // Para teclado y lectores de pantalla: el foco pasa a la sección de destino
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    return true;
  };

  window.addEventListener('ms:goto', (e) => goTo(e.detail));
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (goTo(a.getAttribute('href').slice(1))) e.preventDefault();
  });
}
