/* Marea Studio — interacciones de la web */

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
});

/* Menú móvil */
function initMenu() {
  const btn = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobilemenu');
  if (!btn || !menu) return;
  const set = (open) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    btn.querySelector('.ic-open').hidden = open;
    btn.querySelector('.ic-close').hidden = !open;
  };
  btn.addEventListener('click', () => set(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false)));
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
    data.append('source', 'web-marea-studio');
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
