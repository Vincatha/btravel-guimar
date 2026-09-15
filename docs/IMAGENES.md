# Fotografías que hay que aportar

> **Estado actual:** el hero, la sección «por qué» (3 de 4) y las galerías de los
> 5 viajes llevan **imágenes PROVISIONALES** de Wikimedia Commons con licencia
> libre (lista y créditos en `docs/CREDITOS-IMAGENES.md`). Son un marcador de
> lanzamiento: hay que sustituirlas por fotografía propia de B Travel.
> Siguen con marcador gris: `home/porque/porque-03.jpg`,
> `home/equipo-oficina.jpg` y toda la sección **Quiénes somos**.

Para sustituir una imagen (provisional o marcador), basta con colocar el archivo
real en la ruta indicada, dentro de `src/assets/img/`, y reconstruir. El nombre
debe coincidir exactamente. Al sustituir una provisional, quita también su fila
de `docs/CREDITOS-IMAGENES.md`.

## Cómo añadir una foto (paso a paso)

1. Prepara el archivo: JPG, con el **nombre exacto** de la tabla y optimizado
   (usa https://squoosh.app o similar; respeta el peso máximo).
2. Cópialo a la carpeta que indica la tabla, dentro de `src/assets/img/`.
   Ejemplos:
   - Fondo del hero → `src/assets/img/home/hero.jpg`
   - Foto de Vietnam nº 1 → `src/assets/img/viajes/vietnam/vietnam-01.jpg`
3. Reconstruye: `npm run build` (o, si tienes `npm start` abierto, se actualiza sola).
4. Comprueba en el navegador. Si sigue saliendo el marcador gris, revisa que el
   nombre y la carpeta coincidan **exactamente** (mayúsculas, guiones, extensión).

No hace falta tocar HTML ni CSS. Las rutas y los textos alternativos ya están en
`src/_data/site.yml` (home) y en `src/content/viajes/<slug>.yml` (cada viaje);
solo se editan ahí si quieres cambiar un pie de foto o añadir otra persona al equipo.

**Requisitos generales**
- Formato: JPG (fotos) — WebP si se prefiere, cambiando la extensión en el YAML.
- Nada de bancos de imágenes ni fotos de stock ni de los folletos (regla del encargo).
- Personas identificables: solo con autorización expresa por escrito.
- Optimizar antes de subir (peso orientativo indicado).

## Home  (`src/assets/img/home/`)

| Archivo | Contenido | Proporción | Tamaño | Peso máx. |
|---|---|---|---|---|
| `hero.jpg` | **Fondo del hero, a sangre (ocupa toda la pantalla).** Foto viajera potente: un momento real de un viaje, un paisaje propio o el grupo en ruta. Transmite ilusión/descubrimiento. Deja aire arriba-izquierda (encima va el título en blanco). **Sin stock.** | apaisada 16:9 o 3:2 | ≥ 2000 px ancho | 450 KB |
| `equipo-oficina.jpg` | Equipo o interior de la oficina de Güímar | 4:3 | ≥ 900 px ancho | 200 KB |
| `og-home.jpg` | Imagen para compartir en redes (Open Graph) | 1200 × 630 | 1200 × 630 | 200 KB |

### Sección «Por qué confían en nosotros»  (`src/assets/img/home/porque/`)

| Archivo | Contenido sugerido | Proporción | Peso máx. |
|---|---|---|---|
| `porque-01.jpg` | Salida / aeropuerto de Tenerife, maletas, el grupo saliendo | 4:3 | 180 KB |
| `porque-02.jpg` | El acompañante de la agencia con viajeros durante un viaje | 4:3 | 180 KB |
| `porque-03.jpg` | Atención en la oficina, trato cercano, planificando un viaje | 4:3 | 180 KB |
| ~~`porque-04.jpg`~~ | ✅ Puesta (fachada de la oficina, foto propia, 10 sept 2026) | 4:3 | — |

### Sección «Quién viaja contigo» — el equipo  (`src/assets/img/home/equipo/`)

| Archivo | Contenido | Proporción | Peso máx. |
|---|---|---|---|
| `propietarios.jpg` | Foto de los propietarios de B Travel Güímar (con autorización) | 1:1 | 150 KB |

> Si son varias personas, añadir `propietario-2.jpg`, etc., y una entrada por persona
> en `src/_data/site.yml → equipo.personas`.

## Por viaje  (`src/assets/img/viajes/<slug>/`)

Para cada uno de: `vietnam`, `japon`, `londres`, `escocia`, `sri-lanka-turquia`

| Archivo | Contenido | Proporción | Peso máx. |
|---|---|---|---|
| `<slug>-01.jpg` … `<slug>-06.jpg` | 6 fotos del destino (galería) | 4:3, ≥ 1000 px ancho | 180 KB c/u |
| `og-<slug>.jpg` | Imagen Open Graph de la ficha | 1200 × 630 | 200 KB |

La primera foto de la galería (`<slug>-01.jpg`) se usa también, recortada, en la
tarjeta de la home y en la miniatura del panel «Próximas salidas» del hero.

**Total: 3 (home) + 4 (por qué) + 1 (propietarios) + 7 × 5 (viajes) = 43 imágenes.**
