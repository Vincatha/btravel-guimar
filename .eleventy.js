import { build as bundleGlass } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

// Aseguramos que la carpeta de itinerarios cifrados existe aunque no se haya
// ejecutado todavía el script de cifrado (evita errores de passthrough).
fs.mkdirSync("src/_generated/private", { recursive: true });

export default function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", async () => {
    await bundleGlass({
      entryPoints: ["src/assets/js/pasos-liquidglass.js"],
      outfile: "src/_generated/glass/pasos-liquidglass.js",
      bundle: true, minify: true, format: "esm", target: "es2020",
      define: { "process.env.NODE_ENV": '"production"' }, legalComments: "eof"
    });
  });
  eleventyConfig.addPassthroughCopy({ "src/_generated/glass": "assets/js" });

  // ---- YAML como formato de datos ------------------------------------------
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // ---- Copia de archivos estáticos ----------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/_generated/private": "private" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  eleventyConfig.addWatchTarget("src/assets/");
  eleventyConfig.addWatchTarget("src/content/");

  // ---- Filtros ------------------------------------------------------------
  // Codificación segura para los mensajes de WhatsApp (acentos, ñ, ¿, ?)
  eleventyConfig.addFilter("waText", (s) => encodeURIComponent(String(s || "")));

  // Enlace completo a wa.me con mensaje contextual
  eleventyConfig.addFilter("waLink", (mensaje, numero) => {
    return `https://wa.me/${numero}?text=${encodeURIComponent(String(mensaje || ""))}`;
  });

  // Primeros N elementos de una lista
  eleventyConfig.addFilter("limit", (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []));

  // ---- Shortcode de imagen con comprobación en disco ---------------------
  // Si el archivo real existe en src/assets/img/<ruta>, se usa.
  // Si no, se pinta un marcador de posición SVG claramente identificado
  // y se deja un comentario HTML indicando qué archivo hay que colocar.
  eleventyConfig.addShortcode("foto", function (item, opts = {}) {
    const rel = (item && item.archivo) || "";
    const alt = (item && item.alt) || "";
    const etiqueta = ((item && item.placeholder) || alt || "Imagen pendiente").replace(/"/g, "'");
    const clase = opts.clase || "";
    const w = opts.w || 800;
    const h = opts.h || 600;
    const abs = path.join("src/assets/img", rel);

    if (rel && fs.existsSync(abs)) {
      const prioridad = opts.prioridad
        ? ' fetchpriority="high"'
        : ' loading="lazy" decoding="async"';
      return `<img src="/assets/img/${rel}" alt="${alt}" width="${w}" height="${h}"${prioridad} class="${clase}">`;
    }

    const svg =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
          `<rect width="100%" height="100%" fill="#F7F8FC"/>` +
          `<rect x="10" y="10" width="${w - 20}" height="${h - 20}" fill="none" stroke="#5478DB" stroke-width="2" stroke-dasharray="9 7"/>` +
          `<text x="50%" y="50%" fill="#4A4F5C" font-family="system-ui,-apple-system,sans-serif" font-size="15" text-anchor="middle" dominant-baseline="middle">IMAGEN PENDIENTE &#183; ${etiqueta}</text>` +
          `</svg>`
      );
    return (
      `<!-- PLACEHOLDER IMAGEN: colocar archivo real en src/assets/img/${rel || "(sin ruta)"} (alt: ${alt}) -->` +
      `<img src="${svg}" alt="" role="presentation" width="${w}" height="${h}" class="${clase} es-placeholder" data-imagen-pendiente="${rel}">`
    );
  });

  // ---- Configuración de directorios -------------------------------------
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
}
