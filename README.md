# B Travel Güímar — web

Web estática de viajes de grupo. Generada con [Eleventy](https://www.11ty.dev/).
Los datos de cada viaje están **separados** del diseño: se editan en ficheros YAML
y la web se regenera sola.

## Requisitos

- Node.js 18 o superior.

## Primeros pasos

```bash
npm install          # instala dependencias (solo la primera vez)
npm start            # arranca la web en local con recarga automática
```

Abre **http://localhost:8080** en el navegador.

Otros comandos:

```bash
npm run build        # genera la web en la carpeta _site/ (lo que se publica)
npm run cifrar       # solo cifra los itinerarios privados
npm run verificar    # comprueba que no se filtra contenido privado al HTML público
```

## Estructura

```
src/
  content/viajes/<slug>.yml   ← DATOS de cada viaje (lo que se edita a menudo)
  _data/site.yml              ← datos globales (contacto, redes, legal)
  _data/faq.yml               ← preguntas frecuentes
  _includes/                  ← plantillas, CSS, JS (no hace falta tocarlo)
  assets/img/                 ← fotos reales (ahora hay marcadores de posición)
secrets/passwords.yml         ← contraseñas de los itinerarios (NO se sube a git)
docs/ESTADO.md                ← estado de cada viaje y pendientes
docs/IMAGENES.md              ← lista de fotos que hay que aportar
```

## Cómo cambiar un dato de un viaje

1. Abre `src/content/viajes/<viaje>.yml`.
2. Cambia el valor (por ejemplo `precio: valor: 3190`).
3. Si el dato ya está confirmado por la agencia, pon `confirmado: true` en ese bloque.
4. Guarda. En local se recarga solo; en producción, haz `git push` y Netlify publica.

**No hay que tocar HTML, CSS ni JavaScript.**

## Cómo añadir un viaje nuevo

1. Copia `src/content/viajes/_plantilla.yml` a `src/content/viajes/<nuevo-slug>.yml`.
2. Rellena lo que esté confirmado; deja el resto con `confirmado: false`.
3. Pon `estado: pendiente_corporativa` (o `borrador` si aún no debe verse).
4. Guarda. El viaje aparece solo en la home, con su ficha y su URL.

## Estados de un viaje

| `estado` | Qué hace |
|---|---|
| `borrador` | No aparece en la web |
| `pendiente_corporativa` | Ficha en modo «en preparación». `noindex`. Sin itinerario privado |
| `pendiente_visto_bueno` | Igual, a la espera del OK de la agencia |
| `publicado` | Todo visible, indexable, itinerario privado activo (si hay contraseña) |

## Despliegue (Netlify)

- `build command`: `npm run build`
- `publish directory`: `_site`
- Variables de entorno para las contraseñas: `ITINERARIO_PW_<SLUG>`
  (p. ej. `ITINERARIO_PW_JAPON`).

## Fase 2 (preparado, no implementado)

- **Decap CMS**: panel de formularios en `/admin` para editar los YAML sin tocar
  ficheros. La estructura de datos ya está lista para ello.
