# Marea Studio — web

Web de Marea Studio, agencia de marketing digital. Sitio estático (HTML + CSS + JS, sin build), publicado con GitHub Pages desde la rama `main` (raíz del repo). Cada push a `main` se publica solo en 1–2 minutos.

## Estructura

```
index.html              Página única (header/hero, servicios, proyectos, manifiesto, proceso, contacto, pie)
assets/css/styles.css   Todos los estilos
assets/js/main.js       Menú móvil, acordeón de servicios, filtros, formulario → n8n, animaciones de scroll
assets/img/             Foto del hero, logo y wordmark (versiones clara/oscura, SVG)
favicon.*, apple-touch-icon.png, site.webmanifest   Iconos
design-tokens.json      Sistema de diseño "Marea Studio" (colores, tipografía, espaciado, radios)
```

Para verla en local: `python3 -m http.server 8000` y abrir http://localhost:8000.

## Sistema de diseño (respetarlo en cualquier cambio)

- Blanco y negro como estructura (~60/25 %), azules de marea como profundidad (~10 %), naranja Studio solo para detalles (≤5 %).
- Colores: `#0a0a0b` tinta, `#ffffff` fondo, `#f4f5f7` fondo alterno, `#5c6170` texto secundario, `#e3e5ea` líneas, azul base `#1f3ccb`, azul profundo `#14205d`, `#c8d0f9` texto suave sobre azul, naranja `#ff5a1f` (texto naranja pequeño sobre blanco: `#c23c0c`).
- Tipografía: titulares en Agrandir Wide (aún sin licencia web → cae a Montserrat), texto en Montserrat. Etiquetas: 12px, 600, mayúsculas, tracking 0.12em.
- Botones y chips en píldora; tarjetas con radio 14px y borde, sin sombra.
- Movimiento: curva `cubic-bezier(0.22,1,0.36,1)`; 160ms micro, 320ms componentes, 600–900ms entradas. Animaciones de scroll una sola vez. Respetar `prefers-reduced-motion`.
- Voz: directa y breve. Nada de cifras inventadas: los datos pendientes van entre [corchetes].

## Animaciones de scroll

Clases en `index.html`, activadas por `initReveals()` en `main.js` (añade `.rvon` al contenedor y `.in` al entrar en pantalla):
`.rv` sube con fundido · `.rvl` titular con máscara · `.rvt` etiqueta que se cierra de tracking · `.rvw` frase palabra a palabra · `.dl1`–`.dl4` retardos escalonados.

## Formulario de contacto

Envía a n8n (`CONFIG.contactWebhook` en `main.js`) como `application/x-www-form-urlencoded` con `mode: 'no-cors'`, para no depender de CORS. Campos: `name`, `email`, `service`, `message`, `source`, `page`, `sentAt`. Incluye honeypot `website` anti-spam.
- La URL actual es la de **test** (`/webhook-test/`): solo recibe datos con n8n escuchando. Para producción, cambiar a `/webhook/` y activar el workflow.

## Pendiente

- Contenido real en los [corchetes]: proyectos e imágenes, cifras del manifiesto, email, dirección, redes, textos legales.
- Archivos .woff2 de Agrandir Wide (licencia web de Pangram Pangram) → `@font-face` en `styles.css`.
- Foto del hero a mayor resolución (la actual mide 740 px de ancho) y comprobar su licencia.
- Dominio propio (Settings → Pages → Custom domain).
- Páginas legales (aviso legal, privacidad, cookies).
