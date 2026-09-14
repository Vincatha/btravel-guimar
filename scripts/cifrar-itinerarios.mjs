/**
 * Cifra el itinerario privado de cada viaje ANTES de generar la web.
 *
 * Reglas:
 *  - Solo se cifra un itinerario si estado == "publicado" Y privado.disponible == true
 *    Y existe una contraseña real (no "⟨PENDIENTE⟩").
 *  - El resultado se escribe en src/_generated/private/<slug>.enc (base64, ilegible).
 *  - El contenido en claro del itinerario NUNCA se escribe en _site/ ni en ningún
 *    archivo público. Este script lee los YAML directamente, no a través de Eleventy.
 *  - Si un viaje deja de estar publicado, su .enc se elimina.
 *
 * Cifrado: AES-256-GCM. Clave derivada de la contraseña con PBKDF2-SHA256.
 * Contraseñas: variables de entorno ITINERARIO_PW_<SLUG>  o  secrets/passwords.yml
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(__dirname, "..");
const DIR_VIAJES = path.join(RAIZ, "src/content/viajes");
const DIR_SALIDA = path.join(RAIZ, "src/_generated/private");
const ITERACIONES = 310000;

function cargarContrasenas() {
  const contrasenas = {};
  const archivo = path.join(RAIZ, "secrets/passwords.yml");
  if (fs.existsSync(archivo)) {
    Object.assign(contrasenas, yaml.load(fs.readFileSync(archivo, "utf8")) || {});
  }
  for (const [clave, valor] of Object.entries(process.env)) {
    if (clave.startsWith("ITINERARIO_PW_")) {
      const slug = clave
        .slice("ITINERARIO_PW_".length)
        .toLowerCase()
        .replace(/_/g, "-");
      contrasenas[slug] = valor;
    }
  }
  return contrasenas;
}

function esPendiente(valor) {
  const v = String(valor || "").trim();
  return v === "" || v.includes("PENDIENTE") || v.includes("⟨");
}

function cifrar(textoPlano, contrasena) {
  const sal = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const clave = crypto.pbkdf2Sync(contrasena, sal, ITERACIONES, 32, "sha256");
  const cipher = crypto.createCipheriv("aes-256-gcm", clave, iv);
  const cifrado = Buffer.concat([
    cipher.update(Buffer.from(textoPlano, "utf8")),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iteraciones: ITERACIONES,
    sal: sal.toString("base64"),
    iv: iv.toString("base64"),
    datos: Buffer.concat([cifrado, tag]).toString("base64"),
  };
}

// --- Ejecución -------------------------------------------------------------
fs.mkdirSync(DIR_SALIDA, { recursive: true });
for (const archivo of fs.readdirSync(DIR_SALIDA)) {
  if (archivo.endsWith(".enc")) fs.rmSync(path.join(DIR_SALIDA, archivo));
}

const contrasenas = cargarContrasenas();
const archivos = fs
  .readdirSync(DIR_VIAJES)
  .filter((f) => f.endsWith(".yml") && !f.startsWith("_"));

const resumen = [];
for (const archivo of archivos) {
  const slug = archivo.replace(/\.yml$/, "");
  const datos = yaml.load(fs.readFileSync(path.join(DIR_VIAJES, archivo), "utf8")) || {};
  const estado = datos.estado || "borrador";
  const privado = datos.privado || {};

  if (estado !== "publicado" || !privado.disponible) {
    resumen.push(`  · ${slug.padEnd(22)} sin itinerario privado  (estado: ${estado})`);
    continue;
  }
  const contrasena = contrasenas[slug];
  if (esPendiente(contrasena)) {
    resumen.push(`  · ${slug.padEnd(22)} PUBLICADO pero SIN CONTRASEÑA real → no se cifra`);
    continue;
  }

  const { disponible, aviso, ...contenido } = privado;
  const paquete = cifrar(JSON.stringify(contenido), contrasena);
  fs.writeFileSync(path.join(DIR_SALIDA, `${slug}.enc`), JSON.stringify(paquete));
  resumen.push(`  · ${slug.padEnd(22)} itinerario privado CIFRADO ✓`);
}

fs.writeFileSync(path.join(DIR_SALIDA, ".gitkeep"), "");
console.log("\n[cifrar-itinerarios] Estado de los itinerarios privados:");
console.log(resumen.join("\n") || "  (no hay viajes)");
console.log("");
