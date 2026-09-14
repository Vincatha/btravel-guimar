/* Interacciones básicas de la web. Sin librerías. */
(function () {
  "use strict";

  // --- Menú móvil ---------------------------------------------------------
  var menuBtn = document.querySelector(".cabecera__menu-btn");
  var menuPanel = document.getElementById("menu-movil");
  if (menuBtn && menuPanel) {
    menuBtn.addEventListener("click", function () {
      var abierto = menuPanel.classList.toggle("abierto");
      menuBtn.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
    menuPanel.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menuPanel.classList.remove("abierto");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // --- Borde "de scroll" de la cabecera (cristal líquido) --------------
  // La línea inferior de la cabecera solo aparece cuando hay contenido
  // desplazado por debajo; en el tope la cabecera va a ras del fondo.
  var cabecera = document.querySelector(".cabecera");
  if (cabecera) {
    var marcarScroll = function () {
      cabecera.classList.toggle("scrolled", window.scrollY > 8);
    };
    marcarScroll();
    window.addEventListener("scroll", marcarScroll, { passive: true });
  }

  // --- Acordeón FAQ -----------------------------------------------------
  var preguntas = document.querySelectorAll(".faq__pregunta");
  preguntas.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expandido = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expandido ? "false" : "true");
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (panel) panel.hidden = expandido;
    });
  });
})();
