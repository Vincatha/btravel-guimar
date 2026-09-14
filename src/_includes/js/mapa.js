/* Mapa de la oficina — Leaflet + teselas ráster de OpenStreetMap.
   Ráster (no WebGL) para que se vea en cualquier navegador. Sin cookies. */
(function () {
  "use strict";
  var el = document.getElementById("mapa-oficina");
  if (!el || typeof L === "undefined") return;

  var lat = parseFloat(el.getAttribute("data-lat"));
  var lng = parseFloat(el.getAttribute("data-lng"));
  if (isNaN(lat) || isNaN(lng)) return;

  var map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  }).setView([lat, lng], 16);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
  }).addTo(map);

  // Marcador propio (punto azul de marca), sin imágenes externas.
  L.circleMarker([lat, lng], {
    radius: 9,
    color: "#ffffff",
    weight: 3,
    fillColor: "#5478DB",
    fillOpacity: 1,
  })
    .addTo(map)
    .bindPopup(el.getAttribute("data-label") || "");

  el.classList.add("mapa-embed--activo");
})();
