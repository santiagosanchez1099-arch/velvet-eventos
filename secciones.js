/* Move the existing live sections into one accessible dialog, retaining forms/state. */
(() => {
  const titles = {
    experiencias: "Celebraciones y eventos",
    infantiles: "Catálogo infantil",
    galeria: "Galería de inspiración",
    paquetes: "Elige tu plan",
    personaliza: "Cotiza y reserva tu evento",
    cliente: "Mis reservas y pagos",
    servicios: "Servicios adicionales",
    ubicacion: "Dónde encontrarnos",
    contacto: "Hablemos de tu evento",
    opiniones: "Historias de nuestros clientes",
    preguntas: "Preguntas frecuentes",
  };
  document.querySelector(".testimonials").id = "opiniones";
  document.querySelector(".faq").id = "preguntas";
  const store = document.createElement("div");
  store.id = "sectionStore";
  store.hidden = true;
  document.body.append(store);
  const sections = new Map();
  for (const id of Object.keys(titles)) {
    const section = document.getElementById(id);
    sections.set(id, section);
    store.append(section);
  }
  sections.get("experiencias").append(document.querySelector(".feature-band"));
  document.querySelector(".ticker").hidden = true;
  document.querySelector(".journey-shortcuts").hidden = true;
  const hub = document.createElement("section");
  hub.id = "explorar";
  hub.className = "action-hub";
  hub.setAttribute("aria-labelledby", "hubTitle");
  const cards = [
    [
      "paquetes",
      "01",
      "Elegir un plan",
      "Compara precios, servicios y promociones.",
      "imagen 10.png",
    ],
    [
      "personaliza",
      "02",
      "Cotizar y reservar",
      "Diseña los detalles y elige tu fecha.",
      "boda campestre.png",
    ],
    [
      "cliente",
      "03",
      "Mis reservas y pagos",
      "Entra a tu cuenta, paga y consulta comprobantes.",
      "assets/celebracion-romance.png",
    ],
    [
      "infantiles",
      "✦",
      "Planes infantiles",
      "Temáticas de niño y niña, con adicionales.",
      "cumpleaños niño.png",
    ],
    [
      "galeria",
      "◈",
      "Ver inspiración",
      "Explora las fotos y encuentra tu estilo.",
      "quince.png",
    ],
    [
      "ubicacion",
      "↗",
      "Visítanos en Bogotá",
      "Mapa y opciones para consultar cómo llegar.",
      "imagen3.png",
    ],
  ];
  hub.innerHTML = `<div class="hub-heading"><p class="eyebrow">TODO A UN CLIC</p><h2 id="hubTitle">¿Qué quieres <em>hacer hoy?</em></h2><p>Abre lo que necesitas y vuelve aquí cuando quieras.</p></div><div class="hub-grid">${cards.map(([id, symbol, name, description, image]) => `<a class="hub-card" href="#${id}" aria-haspopup="dialog">${id === "ubicacion" ? '<span class="hub-map-preview" aria-hidden="true"><svg viewBox="0 0 400 210"><rect width="400" height="210" fill="#cad8bd"/><path d="M0 35H400M0 95H400M0 165H400M50 0V210M160 0V210M310 0V210" stroke="#faf3e9" stroke-width="16"/><path d="M50 210V95H280V50" fill="none" stroke="#4285f4" stroke-width="7"/><circle cx="280" cy="48" r="22" fill="#a73a62"/><circle cx="280" cy="48" r="8" fill="white"/></svg></span>' : `<img src="${encodeURI(image)}" alt="" loading="lazy">`}<span class="hub-card-shade"></span><span class="hub-card-copy"><small>${symbol} / VELVET STUDIO</small><strong>${name}</strong><span>${description}</span></span><b aria-hidden="true">↗</b></a>`).join("")}</div><div class="hub-secondary"><a href="#experiencias" aria-haspopup="dialog">Todos los eventos ↗</a><a href="#servicios" aria-haspopup="dialog">Servicios adicionales ↗</a><a href="#opiniones" aria-haspopup="dialog">Opiniones ↗</a><a href="#contacto" aria-haspopup="dialog">Contacto ↗</a><a href="#preguntas" aria-haspopup="dialog">Preguntas frecuentes ↗</a></div>`;
  document.querySelector("main").append(hub);
  const dialog = document.createElement("dialog");
  dialog.id = "sectionDialog";
  dialog.className = "section-dialog";
  dialog.setAttribute("aria-labelledby", "sectionDialogTitle");
  dialog.innerHTML = `<header class="section-dialog-header"><div><span class="eyebrow">VELVET · TU ESPACIO</span><h2 id="sectionDialogTitle"></h2></div><button class="section-dialog-close" type="button" aria-label="Cerrar sección y volver al inicio">Cerrar <span aria-hidden="true">×</span></button></header><nav class="section-dialog-nav" aria-label="Cambiar de acción"><a href="#paquetes">Planes</a><a href="#personaliza">Cotizar</a><a href="#cliente">Mis reservas y pagos</a></nav><div class="section-dialog-body" id="sectionDialogBody"></div>`;
  document.body.append(dialog);
  const body = dialog.querySelector(".section-dialog-body");
  let current = null,
    opener = null;
  function resolve(id) {
    if (sections.has(id)) return id;
    const target = document.getElementById(id);
    return target?.closest(".section")?.id;
  }
  function updateActive() {
    document.querySelectorAll(".section-dialog-nav a").forEach((a) => {
      if (a.hash === "#" + current) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }
  function open(id, options = {}) {
    const key = resolve(id);
    if (!sections.has(key)) return false;
    if (!dialog.open) opener = document.activeElement;
    if (document.getElementById("modal").open) Demo.close();
    if (current !== key) {
      if (current) store.append(sections.get(current));
      current = key;
      if (key === "cliente") ClientPortal.render();
      body.append(sections.get(key));
      body.scrollTop = 0;
    } else if (key === "cliente") ClientPortal.render();
    dialog.querySelector("#sectionDialogTitle").textContent = titles[key];
    sections
      .get(key)
      .querySelectorAll(".reveal.pending")
      .forEach((el) => el.classList.remove("pending"));
    document.documentElement.classList.add("section-dialog-open");
    if (!dialog.open) dialog.showModal();
    updateActive();
    document.getElementById("navigation").classList.remove("open");
    document
      .querySelector(".mobile-toggle")
      .setAttribute("aria-expanded", "false");
    if (options.history !== false && location.hash !== "#" + id)
      history.pushState(null, "", "#" + id);
    if (id !== key)
      requestAnimationFrame(() =>
        document
          .getElementById(id)
          ?.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    return true;
  }
  function close(options = {}) {
    if (!dialog.open) return;
    dialog.close();
    document.documentElement.classList.remove("section-dialog-open");
    if (current) store.append(sections.get(current));
    current = null;
    if (options.history !== false)
      history.pushState(null, "", location.pathname + location.search);
    const toast = dialog.querySelector("#toast");
    if (toast) document.body.append(toast);
    if (opener?.isConnected && opener.getClientRects().length)
      opener.focus({ preventScroll: true });
    else
      document
        .querySelector('.hero a[href="#personaliza"]')
        .focus({ preventScroll: true });
  }
  dialog.querySelector(".section-dialog-close").onclick = () => close();
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    )
      close();
  });
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest("a[href]");
      if (
        !link ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        link.target === "_blank" ||
        e.button !== 0
      )
        return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      const file = url.pathname.split("/").pop();
      let id =
        file === "cuenta.html"
          ? "cliente"
          : decodeURIComponent(url.hash.slice(1));
      if (!["", "index.html", "cuenta.html"].includes(file)) return;
      if (id === "inicio" || id === "explorar") {
        e.preventDefault();
        close();
        document.getElementById(id).scrollIntoView({ behavior: "smooth" });
      } else if (resolve(id)) {
        e.preventDefault();
        open(id);
      }
    },
    true,
  );
  addEventListener("popstate", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!open(id, { history: false })) close({ history: false });
  });
  addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (resolve(id)) open(id, { history: false });
  });
  window.Sections = { open, close, current: () => current };
  const initial = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (resolve(id)) open(id, { history: false });
  };
  const welcome = document.getElementById("welcomeDialog");
  if (welcome?.open) welcome.addEventListener("close", initial, { once: true });
  else initial();
})();
