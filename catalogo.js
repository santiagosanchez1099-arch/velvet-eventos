/* Themes and optional services stored with the existing local demo data. */
const KidsCatalog = (() => {
  const themes = [
    {
      id: "batman",
      name: "Batman",
      audience: "nino",
      cell: 0,
      palette: "Negro y amarillo",
      description: "Gotham, luces y una aventura entre héroes.",
    },
    {
      id: "cars",
      name: "Cars",
      audience: "nino",
      cell: 1,
      palette: "Rojo y cuadros de carreras",
      description: "Una fiesta a toda velocidad, con pista y banderas.",
    },
    {
      id: "marvel",
      name: "Marvel",
      audience: "nino",
      cell: 2,
      palette: "Rojo, azul y dorado",
      description: "Un universo de superhéroes y grandes aventuras.",
    },
    {
      id: "dinosaurios",
      name: "Dinosaurios",
      audience: "nino",
      cell: 3,
      palette: "Verde selva y naranja",
      description: "Exploradores, dinosaurios y diversión jurásica.",
    },
    {
      id: "barbie",
      name: "Barbie",
      audience: "nina",
      cell: 4,
      palette: "Rosa Barbie y fucsia",
      description: "Una celebración rosa llena de brillo y estilo.",
    },
    {
      id: "princesas",
      name: "Princesas",
      audience: "nina",
      cell: 5,
      palette: "Rosa, lavanda y dorado",
      description: "Castillos, coronas y un cuento para recordar.",
    },
    {
      id: "frozen",
      name: "Frozen",
      audience: "nina",
      cell: 6,
      palette: "Azul hielo y plata",
      description: "Un reino de hielo con copos y luces mágicas.",
    },
    {
      id: "unicornios",
      name: "Unicornios",
      audience: "nina",
      cell: 7,
      palette: "Arcoíris pastel",
      description: "Colores suaves, nubes y detalles encantados.",
    },
  ];
  const additions = [
    {
      name: "Piñata personalizada",
      price: 280000,
      cell: 0,
      description: "El personaje y los colores de tu celebración.",
    },
    {
      name: "Mesa dulce infantil",
      price: 450000,
      cell: 4,
      description: "Dulces y montaje temático para compartir.",
    },
    {
      name: "Show de personaje",
      price: 480000,
      cell: 2,
      description: "Una visita especial y juegos para la fiesta.",
    },
    {
      name: "Taller creativo",
      price: 220000,
      cell: 7,
      description: "Una actividad guiada para pequeños artistas.",
    },
    {
      name: "Inflable infantil",
      price: 650000,
      cell: 3,
      description: "Diversión, movimiento y muchas sonrisas.",
    },
    {
      name: "Recuerdos para invitados",
      price: 180000,
      cell: 5,
      description: "Bolsitas y detalles personalizados.",
    },
    {
      name: "Estación de brillo",
      price: 190000,
      cell: 6,
      description: "Un rincón de color y fantasía para la fiesta.",
    },
  ];
  let changed = false;
  for (const item of additions) {
    if (!Demo.state.extras.some((e) => e.name === item.name)) {
      Demo.state.extras.push({ ...item, group: "Infantiles" });
      changed = true;
    }
  }
  if (changed) Demo.save();
  Demo.categories
    .filter((c) => [0, 3].includes(c.id))
    .forEach((c) => (c.group = "Infantiles niño"));
  Demo.categories
    .filter((c) => [1, 4].includes(c.id))
    .forEach((c) => (c.group = "Infantiles niña"));
  function media(theme, extraClass = "") {
    const cell = typeof theme === "number" ? theme : theme.cell;
    const col = cell % 4,
      row = Math.floor(cell / 4);
    return `<div class="theme-photo ${extraClass}" role="img" aria-label="${Demo.esc(typeof theme === "number" ? "Montaje temático infantil" : theme.name + " · inspiración de decoración")}" style="--theme-x:${(col * 100) / 3}%;--theme-y:${row * 100}%"></div>`;
  }
  return { themes, additions, media };
})();
