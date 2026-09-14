/* ============================================================================
   Acceso al itinerario completo (privado).
   El contenido se descarga cifrado (/private/<slug>.enc) y se descifra en el
   navegador con la Web Crypto API nativa (AES-256-GCM + PBKDF2). Sin librerías.
   El texto descifrado vive solo en memoria: no se guarda en ningún sitio.
   ========================================================================== */
(function () {
  "use strict";

  var abrir = document.querySelector("[data-abrir-itinerario]");
  var modal = document.getElementById("modal-itinerario");
  if (!abrir || !modal || !window.crypto || !window.crypto.subtle) return;

  var slug = abrir.getAttribute("data-slug");
  var form = modal.querySelector("form");
  var input = modal.querySelector("input[type='password']");
  var error = modal.querySelector(".modal__error");
  var cerrar = modal.querySelector(".modal__cerrar");
  var destino = document.getElementById("itinerario-privado");

  abrir.addEventListener("click", function () {
    error.textContent = "";
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    if (input) input.focus();
  });
  if (cerrar) cerrar.addEventListener("click", function () { modal.close(); });
  modal.addEventListener("click", function (e) {
    if (e.target === modal) modal.close();
  });

  function b64aBytes(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  async function descifrar(contrasena) {
    var resp = await fetch("/private/" + slug + ".enc", { cache: "no-store" });
    if (!resp.ok) throw new Error("no-disponible");
    var paquete = await resp.json();

    var sal = b64aBytes(paquete.sal);
    var iv = b64aBytes(paquete.iv);
    var datos = b64aBytes(paquete.datos);

    var claveBase = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(contrasena), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    var clave = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: sal, iterations: paquete.iteraciones || 310000, hash: "SHA-256" },
      claveBase,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    var plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, clave, datos);
    return JSON.parse(new TextDecoder().decode(plano));
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function pintar(it) {
    var h = "";
    if (Array.isArray(it.itinerario) && it.itinerario.length) {
      h += '<div class="itinerario-resumen">';
      it.itinerario.forEach(function (d) {
        h += '<div class="itinerario-resumen__bloque">';
        h += '<div class="itinerario-resumen__dias">Día ' + esc(d.dia) + (d.fecha ? " · " + esc(d.fecha) : "") + "</div>";
        if (d.titulo) h += '<div class="itinerario-resumen__titulo">' + esc(d.titulo) + "</div>";
        if (d.texto) h += '<div class="itinerario-resumen__texto">' + esc(d.texto) + "</div>";
        h += "</div>";
      });
      h += "</div>";
    }
    if (Array.isArray(it.vuelos) && it.vuelos.length) {
      h += "<h3>Vuelos</h3><ul>";
      it.vuelos.forEach(function (v) { h += "<li>" + esc(v.tramo) + (v.horario ? " — " + esc(v.horario) : "") + "</li>"; });
      h += "</ul>";
    }
    if (Array.isArray(it.hoteles) && it.hoteles.length) {
      h += "<h3>Hoteles</h3><ul>";
      it.hoteles.forEach(function (ho) {
        h += "<li>" + esc(ho.zona) + " — " + esc(ho.noches) + " noche(s)" +
             (ho.categoria ? ", " + esc(ho.categoria) : "") +
             (ho.nombre ? " (" + esc(ho.nombre) + ")" : "") + "</li>";
      });
      h += "</ul>";
    }
    if (it.regimen_detalle) h += "<h3>Régimen</h3><p>" + esc(it.regimen_detalle) + "</p>";
    if (it.planes_pago && Array.isArray(it.planes_pago.plazos) && it.planes_pago.plazos.length) {
      h += "<h3>Forma de pago</h3><ul>";
      it.planes_pago.plazos.forEach(function (p) { h += "<li>" + esc(p.concepto) + (p.importe != null ? " — " + esc(p.importe) + " €" : "") + "</li>"; });
      h += "</ul>";
    }
    if (it.notas_operativas) h += "<h3>Información adicional</h3><p>" + esc(it.notas_operativas) + "</p>";

    destino.innerHTML = h || "<p>Itinerario disponible. Contacta con la agencia para cualquier duda.</p>";
    destino.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      error.textContent = "";
      var btn = form.querySelector("button[type='submit']");
      btn.disabled = true;
      try {
        var it = await descifrar(input.value);
        modal.close();
        pintar(it);
        abrir.hidden = true;
      } catch (err) {
        error.textContent =
          err && err.message === "no-disponible"
            ? "El itinerario todavía no está disponible. Escríbenos por WhatsApp."
            : "Contraseña incorrecta.";
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
