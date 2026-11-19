/* Marae Blue Studio — interacciones de la web */

const CONFIG = {
  // Webhook de n8n que recibe el formulario de contacto.
  // OJO: la URL "webhook-test" solo funciona mientras n8n está en "Listen for test event".
  // Para producción, cambia "/webhook-test/" por "/webhook/" y activa el workflow.
  contactWebhook: 'https://danieltest.app.n8n.cloud/webhook-test/58aa7781-8727-4aaf-8c51-b2b4e94a3064'
};

document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initServices();
  initProjectFilters();
  initContactForm();
  initReveals();
  initSeal();
  initCursor();
  initSmoothLinks();
});

/* Menú móvil: popup (<dialog> nativo: atrapa el foco y se cierra con Esc) */
function initMenu() {
  const openBtn = document.querySelector('[data-menu-open]');
  const menu = document.getElementById('mobilemenu');
  if (!openBtn || !menu || typeof menu.showModal !== 'function') return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  const open = () => {
    menu.classList.remove('closing');
    menu.showModal();
    document.documentElement.classList.add('menu-open');
  };
  const close = (then) => {
    if (!menu.open) { if (then) then(); return; }
    const done = () => {
      menu.classList.remove('closing');
      menu.close();
      if (then) then();
    };
    if (still.matches) { done(); return; }
    menu.classList.add('closing');
    setTimeout(done, 240);
  };

  openBtn.addEventListener('click', open);
  menu.querySelector('[data-menu-close]').addEventListener('click', () => close());
  // Clic fuera de la tarjeta (en el fondo oscuro) cierra el menú
  menu.addEventListener('click', (e) => { if (e.target === menu) {
    const r = menu.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) close();
  } });
  // Esc: cierre con animación
  menu.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  menu.addEventListener('close', () => document.documentElement.classList.remove('menu-open'));
  // Enlaces: se cierra el popup y después baja suave hasta la sección
  menu.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    close(() => window.dispatchEvent(new CustomEvent('ms:goto', { detail: a.getAttribute('href').slice(1) })));
  }));
  // Si se agranda la pantalla con el menú abierto, se cierra
  window.matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) close(); });
}

/* Acordeón de servicios: uno abierto a la vez */
function initServices() {
  const items = Array.from(document.querySelectorAll('.svc'));
  items.forEach((item) => {
    const btn = item.querySelector('.svc-btn');
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      items.forEach((other) => toggleSvc(other, false));
      toggleSvc(item, willOpen);
    });
  });
}
function toggleSvc(item, open) {
  item.classList.toggle('open', open);
  item.querySelector('.svc-btn').setAttribute('aria-expanded', String(open));
  item.querySelector('.svc-body').hidden = !open;
}

/* Filtros de proyectos */
function initProjectFilters() {
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.card[data-cat]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach((c) => { c.hidden = !(f === 'todos' || c.dataset.cat === f); });
    });
  });
}

/* Formulario de contacto → webhook de n8n */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const fields = form.querySelector('.form-fields');
  const thanks = form.querySelector('.thanks');
  const error = form.querySelector('.form-error');
  const submit = form.querySelector('[data-submit]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = new FormData(form);
    if (data.get('website')) return; // honeypot anti-spam
    data.delete('website');
    data.append('source', 'web-marae-blue-studio');
    data.append('page', location.href);
    data.append('sentAt', new Date().toISOString());

    submit.disabled = true;
    try {
      // URL-encoded + no-cors: petición "simple", sin preflight CORS, llega a n8n
      // aunque el webhook no devuelva cabeceras CORS. n8n lo recibe en body.name, body.email…
      await fetch(CONFIG.contactWebhook, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams(data)
      });
      form.reset();
      fields.hidden = true;
      thanks.hidden = false;
    } catch (err) {
      error.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });

  form.querySelector('[data-form-reset]').addEventListener('click', () => {
    thanks.hidden = true;
    fields.hidden = false;
  });
}

/* Textos que aparecen al hacer scroll (una sola vez) */
function initReveals() {
  if (!('IntersectionObserver' in window)) return;
  const root = document.querySelector('.ms');
  root.classList.add('rvon');
  const els = root.querySelectorAll('.rv, .rvl, .rvt, .rvw, .rvc');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/* Sello fijo: tinta blanca sobre secciones oscuras, negra sobre las claras */
function initSeal() {
  const seal = document.querySelector('.seal');
  if (!seal) return;
  let queued = false;
  const update = () => {
    queued = false;
    const r = seal.getBoundingClientRect();
    // El sello tiene pointer-events:none, así que elementFromPoint devuelve lo que hay debajo
    const under = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    seal.classList.toggle('is-dark', !!(under && under.closest('.on-dark')));
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
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

  const LINKS = 'a, button, summary, label.opt, label.consent, select, [role="button"]';
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
    return Math.min(max, Math.max(0, el.getBoundingClientRect().top + window.scrollY));
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
