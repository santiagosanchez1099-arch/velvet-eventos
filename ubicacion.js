/* Offline schematic map. Only the explicit directions link leaves the demo. */
(() => {
  const origins = [
    {
      name: "Aeropuerto El Dorado",
      short: "Aeropuerto",
      x: 95,
      y: 330,
      path: "M95 330 L210 330 L340 245 L480 245 L480 155 L580 155",
    },
    {
      name: "Plaza de Bolívar, Bogotá",
      short: "Centro histórico",
      x: 695,
      y: 410,
      path: "M695 410 L650 330 L650 235 L580 235 L580 155",
    },
    {
      name: "Portal del Norte, Bogotá",
      short: "Portal Norte",
      x: 355,
      y: 55,
      path: "M355 55 L480 55 L480 155 L580 155",
    },
    {
      name: "Chía, Cundinamarca",
      short: "Chía",
      x: 140,
      y: 55,
      path: "M140 55 L355 55 L480 55 L480 155 L580 155",
    },
  ];
  const section = document.getElementById("ubicacion");
  section.innerHTML = `<div class="section-head"><div><p class="eyebrow">BOGOTÁ · CERCA DE TU CELEBRACIÓN</p><h2 id="locationTitle">¿Dónde puedes<br><em>encontrarnos?</em></h2></div><p>Imagina tu próxima celebración con nosotros. Explora un punto de encuentro de ejemplo y elige desde dónde comenzar.</p></div>
  <div class="location-layout"><div class="local-map"><svg viewBox="0 0 800 480" role="img" aria-labelledby="mapTitle mapDescription"><title id="mapTitle">Mapa ilustrativo de Bogotá</title><desc id="mapDescription">Esquema sin escala con cuatro puntos de partida y destino de ejemplo en el Parque de la 93. No representa vías ni tráfico reales.</desc><defs><pattern id="mapBlocks" width="60" height="45" patternUnits="userSpaceOnUse"><rect width="60" height="45" fill="#ece8df"/><rect x="6" y="6" width="48" height="33" rx="5" fill="#e0ddd4"/></pattern></defs><rect width="800" height="480" fill="url(#mapBlocks)"/><path d="M750 0 Q670 150 760 280 Q800 360 750 480 L800 480 L800 0" fill="#c0d3b1"/><path d="M0 400 Q150 350 230 430" stroke="#a7ccd9" stroke-width="15" fill="none"/><g stroke="#fffdf7" stroke-width="17" fill="none"><path d="M0 55 H735 M0 155 H750 M0 245 H745 M0 330 H760 M0 410 H760"/><path d="M210 0 V480 M355 0 V480 M480 0 V480 M650 0 V480"/><path d="M95 330 L340 245"/></g><g fill="#71766b" font-family="Arial,sans-serif" font-size="13"><text x="372" y="284" transform="rotate(-90 372 284)">Autopista Norte</text><text x="667" y="220" transform="rotate(-90 667 220)">Carrera 7</text><text x="230" y="232">Calle 80</text><text x="500" y="141">Calle 100</text><text x="685" y="85">Cerros</text><text x="695" y="103">Orientales</text><text x="225" y="380" font-size="28" fill="#9ca394">BOGOTÁ</text></g><rect x="550" y="166" width="75" height="50" rx="9" fill="#b4cd9d"/><path id="mapRoute" d="" stroke="#4285f4" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" fill="none"/><circle id="mapOrigin" r="10" fill="#4285f4" stroke="white" stroke-width="4"/><g transform="translate(580 155)"><path d="M0 0 C-4 -10 -21 -23 -21 -39 A21 21 0 1 1 21 -39 C21 -23 4 -10 0 0" fill="#ae355b"/><circle cy="-39" r="8" fill="white"/></g><rect x="470" y="222" width="220" height="48" rx="12" fill="#fffdf7" stroke="#d7cfc5"/><text x="580" y="242" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#422a3b">Parque de la 93</text><text x="580" y="259" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="#6e6165">Punto de encuentro de ejemplo</text></svg><span class="map-demo-label">Mapa ilustrativo · sin escala ni tráfico en vivo</span><div class="map-zoom"><button type="button" id="mapZoomIn" aria-label="Acercar mapa">+</button><button type="button" id="mapZoomOut" aria-label="Alejar mapa">−</button></div></div>
  <div class="panel directions-panel"><p class="eyebrow">CÓMO LLEGAR</p><h3>Elige tu punto de partida</h3><label>¿Desde dónde sales?<select id="routeOrigin">${origins.map((o, i) => `<option value="${i}">${o.short}</option>`).join("")}</select></label><div id="routeDetails" aria-live="polite"></div><a class="button" id="realDirections" target="_blank" rel="noopener noreferrer">Consultar ruta en Google Maps ↗</a><p class="form-note">El mapa de la demo funciona sin conexión. El botón abre Google Maps en otra pestaña para consultar indicaciones reales; requiere internet. Este punto es una referencia, no una sede comercial confirmada.</p><a class="text-button" href="#contacto">¿Prefieres escribirnos? Contacto ↓</a></div></div>`;
  const select = document.getElementById("routeOrigin");
  function update() {
    const o = origins[Number(select.value)];
    document.getElementById("mapRoute").setAttribute("d", o.path);
    const marker = document.getElementById("mapOrigin");
    marker.setAttribute("cx", o.x);
    marker.setAttribute("cy", o.y);
    document.getElementById("routeDetails").innerHTML =
      `<ol class="route-stops"><li><small>SALIDA</small><strong>${o.short}</strong></li><li><small>DESTINO DE EJEMPLO</small><strong>Parque de la 93 · Bogotá</strong></li></ol><p class="form-note">La línea azul muestra una conexión ilustrativa. Consulta el recorrido, los tiempos y el transporte en Google Maps antes de viajar.</p>`;
    document.getElementById("realDirections").href =
      `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(o.name)}&destination=${encodeURIComponent("Parque de la 93, Bogotá, Colombia")}&travelmode=driving`;
  }
  select.onchange = update;
  let zoom = 0;
  function setZoom(value) {
    zoom = Math.max(0, Math.min(2, value));
    section
      .querySelector("svg")
      .setAttribute(
        "viewBox",
        zoom
          ? `${zoom * 115} ${zoom * 35} ${800 - zoom * 220} ${480 - zoom * 125}`
          : "0 0 800 480",
      );
    document.getElementById("mapZoomIn").disabled = zoom === 2;
    document.getElementById("mapZoomOut").disabled = zoom === 0;
  }
  document.getElementById("mapZoomIn").onclick = () => setZoom(zoom + 1);
  document.getElementById("mapZoomOut").onclick = () => setZoom(zoom - 1);
  setZoom(0);
  update();
})();
