/**
 * Comprobación de seguridad posterior al build.
 *
 * Recorre _site/ y falla si encuentra en el HTML público cualquier texto
 * procedente del bloque "privado" de un viaje (itinerario día a día, vuelos,
 * hoteles, notas operativas...). También falla si detecta un IBAN o el nombre
 * personal que aparece en los documentos originales.
 *
 * Mientras ningún viaje esté "publicado" no hay nada privado que filtrar, pero
 * la comprobación queda activa para el futuro.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, "..");
const DIR_SITE = path.join(RAIZ, "_site");
const DIR_VIAJES = path.join(RAIZ, "src/content/viajes");

const PROHIBIDO = [
  /ES\d{2}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{2}[\s-]?\d{10}/, // IBAN
  /Cathaysa\s+Casta[nñ]o\s+Portugu[eé]s/i,
];

function listarHtml(dir) {
  const salida = [];
  if (!fs.existsSync(dir)) return salida;
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) salida.push(...listarHtml(p));
    else if (entrada.name.endsWith(".html")) salida.push(p);
  }
  return salida;
}

function textosPrivados() {
  const fragmentos = [];
  const archivos = fs
    .readdirSync(DIR_VIAJES)
    .filter((f) => f.endsWith(".yml") && !f.startsWith("_"));
  for (const archivo of archivos) {
    const datos = yaml.load(fs.readFileSync(path.join(DIR_VIAJES, archivo), "utf8")) || {};
    const priv = datos.privado || {};
    const recoger = (obj) => {
      if (!obj) return;
      if (typeof obj === "string") {
        const limpio = obj.trim();
        if (limpio.length >= 25) fragmentos.push(limpio.slice(0, 40));
      } else if (Array.isArray(obj)) obj.forEach(recoger);
      else if (typeof obj === "object") Object.values(obj).forEach(recoger);
    };
    ["itinerario", "vuelos", "hoteles", "regimen_detalle", "notas_operativas", "planes_pago"].forEach(
      (k) => recoger(priv[k])
    );
  }
  return fragmentos;
}

const htmls = listarHtml(DIR_SITE);
const privados = textosPrivados();
const errores = [];

for (const archivo of htmls) {
  const contenido = fs.readFileSync(archivo, "utf8");
  const rel = path.relative(RAIZ, archivo);
  for (const patron of PROHIBIDO) {
    if (patron.test(contenido)) errores.push(`${rel}: contiene un dato prohibido (${patron})`);
  }
  for (const fragmento of privados) {
    if (fragmento && contenido.includes(fragmento)) {
      errores.push(`${rel}: contiene texto del itinerario PRIVADO ("${fragmento}…")`);
    }
  }
}

if (errores.length) {
  console.error("\n[verificar-privado] FALLO — contenido que no debe estar en el HTML público:");
  errores.forEach((e) => console.error("  ✗ " + e));
  console.error("");
  process.exit(1);
}
console.log(`[verificar-privado] OK — ${htmls.length} páginas revisadas, sin filtraciones.\n`);
