# Estado del proyecto — B Travel Güímar

_Última actualización: 2026-09-13_

## Qué es esto

Web estática generada con **Eleventy**. Los datos de cada viaje viven en
`src/content/viajes/<slug>.yml`, **separados** de las plantillas, el CSS y el JS.
Para cambiar un precio, una fecha o un hotel se edita **solo el YAML** y la web se
regenera sola (en Netlify, al hacer push).

## Estado de cada viaje

Los nueve viajes tienen resumen público y estado `publicado`, a partir de los PDF
aportados por la agencia el 13 de septiembre de 2026. Las URL se conservan.
El itinerario completo y los pagos se solicitan directamente a la agencia por WhatsApp.
No se incorporan los PDF ni los calendarios de pago a la web.

| Viaje | Fechas | Precio por persona en doble |
|---|---|---|
| Londres | 5–9 diciembre 2026 | 990 € |
| Sri Lanka & Turquía | 21 febrero–5 marzo 2027 | 2.980 € |
| Vietnam | 18–30 marzo 2027 | 2.940 € |
| País Vasco | 4–9 abril 2027 | 890 € |
| Turquía | 14–22 abril 2027 | 2.190 € |
| Asturias | 15–20 abril 2027 | 790 € |
| Escocia | 23 abril–1 mayo 2027 | 2.490 € |
| Japón | 9–21 mayo 2027 | 3.890 € |
| Costa Brava | 19–25 mayo 2027 | 890 € |

### Observaciones de los documentos

- País Vasco: la versión corregida confirma 4–9 abril de 2027 en portada y programa.
- Escocia: la versión corregida (ITINERARIO ESCOCIA.pdf) confirma Tenerife Sur en portada y programa. Aeropuerto confirmado en la ficha y las tarjetas.
- Costa Brava: almuerzo final incluido en el día a día y excluido en condiciones. Se remite esa comida a consulta.
- Turquía: una cabecera dice febrero; se usa abril, coherente con portada y recorrido. No se publican horarios de vuelos contradictorios.
- Asturias: subida a Lagos de Covadonga no incluida y condicionada por el tiempo; Playa de las Catedrales según marea.
- Sri Lanka: el documento actual suma ocho noches en Sri Lanka, coherentes con el apartado incluye.
- Londres: precio actualizado a 990 € y alojamiento con desayuno. No se publican tarifas de ETA ni calendarios de mercadillos como información vigente.

## Pendientes conocidos

### De la home (revisión comercial 2026-09-08)
- **Eslogan y subtítulo** del hero: en uso "Tu próxima gran historia empieza aquí." + subtítulo.
  Se cambian en `src/_data/site.yml → home.hero` (una línea). Pendiente elección definitiva del cliente.
- **Sección «Por qué confían en nosotros»**: 4 tarjetas editoriales con foto. Pendientes las 4 fotos.
- **Sección «Quién viaja contigo»** (propietarios): estructura lista en `site.yml → equipo`
  con placeholders `⟨… — PENDIENTE⟩`. Pendiente: foto, nombre, función, descripción y
  texto sobre el acompañamiento. Poner `equipo.confirmado: true` al completarlo.
- **Reseñas de Google**: `src/_data/resenas.yml`, `modo: pendiente`. Pendiente:
  URL de la ficha de Google + decidir método (API de Google Places / Featurable / manual).
  Cuando haya método automático se añadirá `scripts/traer-resenas.mjs`.

### Otros pendientes de la agencia
- ~~Horario de la oficina~~ → puesto (Lun–Vie 9:30–13:30 y 16:30–19:30; sábados irregulares). `site.yml → horario`.
- ~~Coordenadas de la oficina~~ → geocodificadas de "Avda. de Santa Cruz, 6" con Nominatim
  (28.3162078, −16.4091329; CP 38500). Mapa Leaflet + OSM ráster en Contacto, y JSON-LD `geo`.
  **Conviene que la agencia confirme que el pin del mapa cae exactamente en la puerta.**
- Confirmar que el 660 82 85 78 tiene WhatsApp.
- Testimonios reales + autorización expresa de cada cliente.
- Verificar el código de agencia (C.I.) para Canarias.
- ¿Existe un perfil social local autorizado? Si no, se enlaza a los de la marca.

### De diseño / material
- **Logotipo:** ya se usa el **wordmark oficial de B travel** (vectorial, macro
  `logo()` en `src/_includes/macros/iconos.njk`) + lockup «Güímar» en Kerf Stencil.
  El color lo controla el contenedor vía `currentColor`.
- **Fuente corporativa `BTravel`:** no disponible. Se usa Archivo + Inter. Punto de
  sustitución marcado en `src/_includes/css/main.css` (`--font-display`).
- **Manual de identidad visual:** el PDF que hay es de redes sociales, no contiene
  la paleta ni la tipografía. La paleta usada es la del encargo §3.

### De fotografía
Ver `docs/IMAGENES.md`. Ahora todo son marcadores de posición identificados.

## Documentos originales

Los documentos de B Travel están en `~/Downloads/B Travel Viajes/` y **no se han
modificado**. La comparación de itinerarios está en el informe entregado aparte.


## Lanzamiento (13-09-2026)

La web **no está publicada**. `https://btravel-guimar.netlify.app` devuelve 404:
no se ha desplegado nunca. El plan de salida por fases está en el artefacto
«Salir en Google» y en el proyecto de Claude (`guias/lanzamiento_web.md`).

Bloqueantes, en orden:

1. **Permiso de central** (Ávoris / marketing de la red). Sin pedir. «B travel» es
   marca registrada; afecta también al dominio.
2. **Dominio**. Sin contratar. Candidatos: `btravelguimar.es` (con permiso) o
   `viajesdesdeguimar.com` (sin riesgo de marca).
3. **Despliegue**. No hay repositorio git ni cuenta de Netlify.

### Cambio aplicado el 13-09-2026 — enlazado de entidad

Los perfiles locales de la oficina existen y salen en la primera página de Google:

- Facebook: https://www.facebook.com/btravelguimar/
- Instagram: https://www.instagram.com/btravel_guimar_/

`site.yml` los declara ahora en `redes_local`, con `perfil_local_autorizado: true`.
El pie y el `sameAs` del JSON-LD apuntan a ellos (antes apuntaban solo a los
perfiles nacionales de la marca, lo que le decía a Google que la web era de otra
entidad). Queda `ficha_google: ""` ⟨PENDIENTE⟩ para añadir la URL del Perfil de
Empresa al `sameAs`.

### Aviso técnico: el build no corre desde el puente de Claude

`node_modules` tiene el binario de **esbuild para macOS**. El shell remoto es Linux,
así que `npm run build` falla ahí con «You installed esbuild for another platform».
No es un fallo del proyecto: hay que compilar **en el Mac** (`npm run build`) o dejar
que lo haga Netlify. El cambio del JSON-LD se verificó renderizando la plantilla con
nunjucks directamente (sameAs válido, JSON parseable).


## Publicación efectiva — 14 septiembre 2026

Web publicada con acceso público expresamente autorizado por la usuaria.
URL: https://btravel-guimar.vincatha.chatgpt.site
Sites project_id: appgprj_6aa81bb709648191aedeed6e1aede3c3
Versión: appgprj_6aa81bb709648191aedeed6e1aede3c3~appgver_15bfb823e9508191a56d9eb751312665
Despliegue: appgdep_6aa81da8359c8191b11d138e64117fe1 — succeeded.
Se conserva Ávoris Retail Division, S.L. / B07012107 por confirmación de la usuaria. La validación de central sigue pendiente.
Aviso legal, privacidad, cookies y créditos añadidos; 15 páginas verificadas.
Pendiente: compartir el enlace en el canal; Safari estaba siendo utilizado y bloqueó la interacción.
