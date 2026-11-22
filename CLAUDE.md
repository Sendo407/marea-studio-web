# Marae Blue Studio — web

Web de Marae Blue Studio (antes Marea Studio), agencia de marketing digital. Sitio estático (HTML + CSS + JS, sin build), publicado con GitHub Pages desde la rama `main` (raíz del repo). Cada push a `main` se publica solo en 1–2 minutos.

## Estructura

```
index.html              Página única (diseño v2, 2026-11-22): hero · 01 servicios (#servicios, con #s-web, #s-ads, #s-seo, #s-social, #s-estrategia, #s-email) · 02 por qué Marae (#porque: carrusel + bento) · foto mesa · 03 cómo trabajamos (#nosotros / #metodo) · 04 FAQ en chat (#faq) · 05 contacto (#contacto) · pie (#pie)
assets/css/styles.css   Estilos del diseño v2 + añadidos al final (privacidad del formulario, cursor propio)
assets/js/main.js       Menú (desplegable de servicios y menú móvil), carrusel, FAQ en chat, formulario → n8n con postal en directo, animaciones de scroll, parallax del hero y del pie, gráfica de "Resultados", red de "Cómo trabajamos" en móvil, cursor propio, desplazamiento suave
assets/img/             Fotos del diseño (hero-mar, svc-*, mesa-equipo…), logotipo (logo-marae-blue.svg), sello (sello.svg) y olas/islas en SVG
favicon.*, apple-touch-icon.png, site.webmanifest   Iconos
design-tokens.json      Sistema de diseño "Marae Blue Studio" (colores, tipografía, espaciado, radios)
```
Para verla en local: `python3 -m http.server 8000` y abrir http://localhost:8000.

**Caché:** `index.html` carga `styles.css?v=…` y `main.js?v=…`. Cada vez que cambies el CSS o el JS, sube ese número (p. ej. `20261119-2`) para que los navegadores no usen la versión antigua.

## Diseño v2 (desde 2026-11-22)

La web sigue el diseño "Web Marea Studio · con fotos" hecho en Claude (artefacto de diseño https://claude.ai/code/artifact/297dce13-c3d9-4ed1-b58b-5e62a0df7eff, tablero `Inicio.dc.html`). Ese diseño manda sobre lo que se dice más abajo de colores y tipografía:
- Titulares en Bebas Neue (`.disp`), menú móvil en Antonio, texto en Montserrat. Fotos en blanco y negro, naranjas cálidos (`#E8743B`, `#F2A65A`, `#F2611A`) y azul pizarra (`#2E4A66`).
- Logotipo en imagen (`assets/img/logo-marae-blue.svg`). Sello solo en el pie (`.ft-sello`); ya no hay sello fijo en la esquina.
- Al pasar un cambio del diseño a la web: el HTML del tablero va casi tal cual al `<body>`; lo dinámico (`sc-if`, `sc-for`, `{{…}}`) se hace en `main.js`.
- Añadido fuera del diseño: casilla de privacidad y campo trampa en el formulario, cursor propio y desplazamiento suave.

## Sistema de diseño anterior (referencia)

- Blanco y negro como estructura (~60/25 %), azules como profundidad (~10 %), naranja Studio solo para detalles (≤5 %).
- Colores: `#0a0a0b` tinta, `#ffffff` fondo, `#f4f5f7` fondo alterno, `#5c6170` texto secundario, `#e3e5ea` líneas, azul base `#1f3ccb`, azul profundo `#14205d`, `#c8d0f9` texto suave sobre azul, naranja `#ff5a1f` (texto naranja pequeño sobre blanco: `#c23c0c`).
- Logotipo: en texto HTML (`.wm` en `index.html` y `styles.css`), no en imagen. "Marae blue" en Agrandir Wide → Unbounded 200 mientras no haya licencia web; "STUDIO" en Bebas Neue naranja con punto; "Marketing Agency" debajo en el pie (`.wm-tag`).
- Sello: imagen fija abajo a la derecha (`.seal`). `initSeal()` en `main.js` cambia a la versión de tinta blanca cuando hay una sección `.on-dark` debajo.
- Tipografía: titulares en Agrandir Wide (aún sin licencia web → cae a Montserrat), texto en Montserrat. Etiquetas: 12px, 600, mayúsculas, tracking 0.12em.
- Botones y chips en píldora; tarjetas con radio 14px y borde, sin sombra.
- Movimiento: curva `cubic-bezier(0.22,1,0.36,1)`; 160ms micro, 320ms componentes, 600–900ms entradas. Animaciones de scroll una sola vez. Respetar `prefers-reduced-motion`.
- Voz: directa y breve. Nada de cifras inventadas: los datos pendientes van entre [corchetes].

## Animaciones de scroll

Clases en `index.html`, activadas por `initReveals()` en `main.js` (añade `.rvon` al contenedor y `.in` al entrar en pantalla):
`.rv` sube con fundido · `.rvl` titular con máscara · `.rvt` etiqueta que se cierra de tracking · `.rvw` frase palabra a palabra · `.dl1`–`.dl4` retardos escalonados.

## Formulario de contacto

Envía a n8n (`CONFIG.contactWebhook` en `main.js`) como `application/x-www-form-urlencoded` con `mode: 'no-cors'`, para no depender de CORS. Desde el diseño v2 el formulario es una frase ("Hola, me llamo…") con postal en directo. Campos que envía: `request` (siempre "Reunión gratuita"), `name`, `company`, `email`, `service` (los chips elegidos, separados por comas), `message`, `privacy` (casilla obligatoria), `source`, `page`, `sentAt`. Ya no hay teléfono. Incluye honeypot `website` anti-spam.
- La URL actual es la de **test** (`/webhook-test/`): solo recibe datos con n8n escuchando. Para producción, cambiar a `/webhook/` y activar el workflow.

## Mensaje de marca (desde 2026-11-20)

Lo que hay que transmitir: cercanía, sensibilidad, que conectamos con las ideas del cliente, profesionalidad, puntualidad, confianza, que somos **una extensión de la empresa** del cliente (no un proveedor) y que hacemos **proyectos a medida** para cada empresa. En el diseño v2 el hero es el nombre "MARAE BLUE" con la frase "En los ojos correctos, hasta lo cotidiano se vuelve extraordinario."

## Lenguaje visual anterior (2026-11-20, sustituido por el diseño v2)

Inspirado en la estructura de agenciaicaro.com, con la paleta propia:
- Fondo de página gris claro (`#eef0f4`). Las secciones importantes van en paneles redondeados (`.panel`, radio 28px y 12px de margen), en blanco (`.panel-white`), negro (`.panel-ink`) o azul profundo (`.deep`).
- Menú flotante en píldora (`.topbar`), fijo arriba. Las secciones llevan `scroll-margin-top` para que el menú no las tape.
- Etiquetas de sección en píldora con este formato: `(01) — Nombre` (`.eyebrow`).
- Titulares a dos tonos: la segunda línea en gris (`.mute`).
- "Por qué nosotros" en cuadrícula de tarjetas (`.bento`), con mini maquetas en HTML/CSS: equipo, chat, agenda, idea → proyecto e informe. No llevan cifras inventadas.
- Servicios en filas sobre panel negro (`.srv`).

## Decisiones de contenido

- La primera reunión es gratuita y se pide con el formulario (no hay Calendly). Las reuniones se gestionan aparte, fuera de la web.
- La sección Proyectos está en el HTML con `hidden` hasta que haya casos reales: para mostrarla, quitar `hidden` y añadirla al menú.
- Sin "Quiénes somos" por ahora.

## Pendiente

- Contenido real en los [corchetes]: proyectos e imágenes, cifras del manifiesto, email, dirección, redes, textos legales.
- Archivos .woff2 de Agrandir Wide (licencia web de Pangram Pangram) → `@font-face` en `styles.css`.
- Foto del hero a mayor resolución (la actual mide 740 px de ancho) y comprobar su licencia.
- Dominio propio (Settings → Pages → Custom domain).
- Páginas legales (aviso legal, privacidad, cookies). El formulario enlaza a una [política de privacidad] que aún no existe.
- FAQ: respuesta sobre permanencia.
