/**
 * Carga todos los viajes desde src/content/viajes/*.yml y los expone como
 * la colección global `viajes`.
 *
 * IMPORTANTE:
 *  - El bloque `privado` se ELIMINA aquí. Las plantillas nunca reciben el
 *    itinerario completo: solo llega el .enc cifrado que genera el script
 *    scripts/cifrar-itinerarios.mjs.
 *  - Los archivos que empiezan por "_" (p. ej. _plantilla.yml) se ignoran.
 *  - Los viajes con estado "borrador" no se publican.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR_VIAJES = path.join(__dirname, "../content/viajes");
const DIR_ENC = path.join(__dirname, "../_generated/private");

const ESTADOS_VALIDOS = [
  "borrador",
  "pendiente_corporativa",
  "pendiente_visto_bueno",
  "publicado",
];

export default function () {
  const archivos = fs
    .readdirSync(DIR_VIAJES)
    .filter((f) => f.endsWith(".yml") && !f.startsWith("_"));

  const viajes = archivos.map((archivo) => {
    const slug = archivo.replace(/\.yml$/, "");
    const bruto = yaml.load(fs.readFileSync(path.join(DIR_VIAJES, archivo), "utf8")) || {};

    // Vista pública: se descarta por completo el bloque privado.
    const { privado, ...publico } = bruto;

    const estado = ESTADOS_VALIDOS.includes(bruto.estado) ? bruto.estado : "borrador";
    const esPublicado = estado === "publicado";

    return {
      ...publico,
      slug,
      estado,
      esPublicado,
      // Indexable solo cuando el viaje está publicado.
      indexable: esPublicado,
      // ¿Existe el itinerario cifrado en disco? (lo crea el script de cifrado)
      itinerarioPrivadoDisponible: fs.existsSync(path.join(DIR_ENC, `${slug}.enc`)),
      // ¿Se muestra la ficha con datos, o en modo "pendiente"?
      enPreparacion: estado === "pendiente_corporativa" || estado === "pendiente_visto_bueno",
    };
  });

  return viajes
    .filter((v) => v.estado !== "borrador")
    .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}
