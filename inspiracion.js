/* Curated, local media. Upgrade built-in examples without removing user uploads. */
const Inspiration = (() => {
  const { state, esc } = Demo;
  const corrections = {
    1: "imagen5.png",
    2: "assets/celebracion-adultos.png",
    3: "imagen4.png",
    4: "imagen4.png",
    5: "graduacion.png",
    6: "graduacion.png",
    9: "Imagen6.png",
    10: "Imagen6.png",
    11: "imagen11.png",
    12: "assets/celebracion-bautizo.png",
    13: "assets/celebracion-comunion.png",
    14: "assets/celebracion-romance.png",
    15: "assets/celebracion-romance.png",
    16: "assets/celebracion-romance.png",
    18: "imagen2.png",
  };
  Object.entries(corrections).forEach(([i, src]) => {
    Demo.categories[Number(i)].image = src;
  });
  const items = [
    [
      "p1",
      "imagen1.png",
      "Quinceañeras",
      "Montaje de quince años entre flores y luces",
      "Quinceañeras",
    ],
    [
      "p2",
      "boda campestre.png",
      "Bodas",
      "Ceremonia campestre al aire libre",
      "Bodas",
    ],
    [
      "p3",
      "cumpleaños niño.png",
      "Infantiles",
      "Cumpleaños de superhéroes · 6 años",
      "Cumpleaños de niño",
    ],
    [
      "p4",
      "empresarial.png",
      "Empresariales",
      "Encuentro empresarial con escenario y mesas",
      "Eventos empresariales",
    ],
    [
      "p5",
      "graduacion.png",
      "Grados",
      "Ceremonia de grado con togas y birretes",
      "Graduación universitaria",
    ],
    [
      "p6",
      "imagen11.png",
      "Familia",
      "Baby shower de ositos en azul y crema",
      "Baby showers",
    ],
    [
      "cur-quince",
      "quince.png",
      "Quinceañeras",
      "Quinceañera en su celebración rosa",
      "Quinceañeras",
    ],
    [
      "cur-quince-oro",
      "imagen 10.png",
      "Quinceañeras",
      "Montaje de quince años en negro y dorado",
      "Quinceañeras",
    ],
    [
      "cur-grados",
      "imagen4.png",
      "Grados",
      "Salón de graduación con birrete y sillas doradas",
      "Graduación de bachillerato",
    ],
    [
      "cur-pastel",
      "imagen5.png",
      "Infantiles",
      "Cumpleaños pastel con arcoíris · 6 años",
      "Cumpleaños de niña",
    ],
    [
      "cur-futbol",
      "imagen7.png",
      "Infantiles",
      "Cumpleaños de fútbol · 8 años",
      "Cumpleaños de niño",
    ],
    [
      "cur-dino",
      "imagen8.png",
      "Infantiles",
      "Cumpleaños de dinosaurios · 8 años",
      "Cumpleaños de niño",
    ],
    [
      "cur-reveal",
      "Imagen6.png",
      "Familia",
      "Revelación de sexo en azul y rosa",
      "Revelación de sexo · niña",
    ],
    [
      "cur-empresa",
      "imagen12.png",
      "Empresariales",
      "Cena de celebración del Día del Trabajador",
      "Eventos empresariales",
    ],
    [
      "cur-concierto",
      "imagen2.png",
      "Especiales",
      "Concierto nocturno con luces doradas",
      "Celebraciones especiales",
    ],
    [
      "cur-festival",
      "imagen9.png",
      "Especiales",
      "Festival musical con escenario y luces",
      "Celebraciones especiales",
    ],
    [
      "cur-mascotas",
      "imagen13.png",
      "Especiales",
      "Celebración al aire libre para mascotas",
      "Celebraciones especiales",
    ],
    [
      "cur-jardin",
      "imagen3.png",
      "Bodas",
      "Recepción de boda en jardín iluminado",
      "Bodas",
    ],
    [
      "cur-bautizo",
      "assets/celebracion-bautizo.png",
      "Familia",
      "Bautizo con vela, ropón y flores blancas",
      "Bautizos",
    ],
    [
      "cur-comunion",
      "assets/celebracion-comunion.png",
      "Familia",
      "Primera comunión con cáliz y detalles dorados",
      "Primeras comuniones",
    ],
    [
      "cur-romance",
      "assets/celebracion-romance.png",
      "Romance",
      "Pedida de mano en una cena para dos",
      "Pedidas de mano",
    ],
    [
      "cur-adultos",
      "assets/celebracion-adultos.png",
      "Adultos",
      "Cumpleaños de 40 en verde y dorado",
      "Cumpleaños de adultos",
    ],
  ].map(([id, src, category, title, event]) => ({
    id,
    src,
    category,
    title,
    event,
  }));
  [
    "Batman",
    "Cars",
    "Marvel",
    "Dinosaurios",
    "Barbie",
    "Princesas",
    "Frozen",
    "Unicornios",
  ].forEach((title, cell) =>
    items.push({
      id: `cur-theme-${cell}`,
      src: "assets/tematicas-infantiles.png",
      cell,
      category: "Infantiles",
      title: `Cumpleaños temático · ${title}`,
      event: cell < 4 ? "Cumpleaños de niño" : "Cumpleaños de niña",
    }),
  );
  function upgrade() {
    if (state.galleryRevision === 3) return;
    const before = new Set(state.photos.map((p) => p.id));
    state.photos = state.photos.map(
      (p) => items.find((x) => x.id === p.id) || p,
    );
    items.forEach((p) => {
      if (!before.has(p.id) && !/^p\d+$/.test(p.id)) state.photos.push(p);
    });
    state.galleryRevision = 3;
    Demo.save();
  }
  function media(p, className = "") {
    if (Number.isInteger(p.cell))
      return `<i class="curated-photo ${className}" role="img" aria-label="${esc(p.title)}" style="--photo-x:${((p.cell % 4) * 100) / 3}%;--photo-y:${p.cell < 4 ? 0 : 100}%"></i>`;
    return `<img class="${className}" src="${esc(p.src)}" alt="${esc(p.title)}" loading="lazy">`;
  }
  upgrade();
  // Resetting the demo must also restore the curated gallery on the next load.
  return { media, items };
})();
