const { state, money, esc, toast, modal } = Demo;
let activeGroup = "Todas",
  allCategories = false;
const groups = [
  "Todas",
  "Infantiles niño",
  "Infantiles niña",
  "Sociales",
  "Romance",
  "Familia",
  "Grados",
  "Empresariales",
];
function renderExperiences() {
  document.getElementById("categoryTabs").innerHTML = groups
    .map(
      (g) =>
        `<button class="chip ${g === activeGroup ? "active" : ""}" data-group="${g}">${g}</button>`,
    )
    .join("");
  let list = Demo.categories.filter(
    (c) => activeGroup === "Todas" || c.group === activeGroup,
  );
  if (activeGroup === "Todas" && !allCategories)
    list = [
      Demo.categories[7],
      Demo.categories[8],
      Demo.categories[0],
      Demo.categories[17],
    ];
  document.getElementById("experienceGrid").innerHTML = list
    .map(
      (c) =>
        `<article class="experience-card"><button class="image-button" data-category="${c.id}" aria-label="Explorar ${esc(c.name)}">${[0, 1].includes(c.id) ? KidsCatalog.media([0, 3].includes(c.id) ? KidsCatalog.themes[0] : KidsCatalog.themes[4]) : `<img src="${c.image}" alt="Inspiración para ${esc(c.name)}" loading="lazy">`}<span>EXPLORAR ↗</span></button><div class="card-meta"><small>${c.group.toUpperCase()}</small><span>${String(c.id + 1).padStart(2, "0")}</span></div><h3><button class="text-button" data-category="${c.id}">${c.name} ↗</button></h3><p>${c.themes}</p></article>`,
    )
    .join("");
  document.getElementById("showAll").textContent = allCategories
    ? "Ver selección destacada ↑"
    : "Explorar todas las celebraciones ↓";
  document.querySelectorAll("[data-group]").forEach(
    (b) =>
      (b.onclick = () => {
        activeGroup = b.dataset.group;
        renderExperiences();
      }),
  );
  document
    .querySelectorAll("[data-category]")
    .forEach(
      (b) => (b.onclick = () => showCategory(Number(b.dataset.category))),
    );
}
function showCategory(id) {
  const c = Demo.categories[id];
  modal(
    `<div class="category-detail"><img src="${c.image}" alt="${esc(c.name)}"><p class="eyebrow">${c.group} / HECHO A TU MEDIDA</p><h2>${c.name}</h2><p>${c.themes}.</p><p>Personaliza la temática, la paleta, el montaje y la cantidad de invitados. Elige fotografía, catering, música o invitaciones para completar tu celebración.</p><div class="button-row">${c.themes
      .split(",")
      .map((t) => `<span class="chip">${t.trim()}</span>`)
      .join(
        "",
      )}</div><button class="button" id="chooseCategory">Personalizar esta celebración ↗</button></div>`,
  );
  document.getElementById("chooseCategory").onclick = () => {
    form.category.value = c.name;
    updateSummary();
    goToPlanner(
      "✓ Celebración " +
        c.name +
        " seleccionada. Elige los detalles de tu evento.",
    );
  };
}
function renderGallery(filter = "Todas") {
  const filters = [
    "Todas",
    "Bodas",
    "Quinceañeras",
    "Infantiles",
    "Empresariales",
    "Grados",
    "Familia",
    "Romance",
    "Adultos",
    "Especiales",
    "Videos",
  ];
  document.getElementById("galleryTabs").innerHTML = filters
    .map(
      (g) =>
        `<button class="chip ${g === filter ? "active" : ""}" data-gallery="${g}">${g}</button>`,
    )
    .join("");
  document.getElementById("galleryGrid").innerHTML =
    state.photos
      .filter((p) => filter === "Todas" || p.category === filter)
      .map(
        (p) =>
          `<button class="gallery-item" data-photo="${p.id}">${p.video ? `<video src="${p.src}" poster="imagen1.png" muted preload="none"></video><b class="play-badge">▶</b>` : Inspiration.media(p)}<span><small>${esc(p.category).toUpperCase()}</small>${esc(p.title)} ↗</span></button>`,
      )
      .join("") || "<p>No hay imágenes en esta categoría.</p>";
  document
    .querySelectorAll("[data-gallery]")
    .forEach((b) => (b.onclick = () => renderGallery(b.dataset.gallery)));
  document.querySelectorAll("[data-photo]").forEach(
    (b) =>
      (b.onclick = () => {
        const p = state.photos.find((p) => p.id === b.dataset.photo);
        modal(
          `${p.video ? `<video src="${p.src}" controls autoplay playsinline class="lightbox-media"></video>` : Inspiration.media(p, "lightbox-media")}<p class="eyebrow">${esc(p.category)}</p><h3>${esc(p.title)}</h3>${p.event ? '<button class="button" id="inspireQuote">Quiero una celebración así ↗</button>' : ""}`,
        );
        if (p.event)
          document.getElementById("inspireQuote").onclick = () => {
            form.category.value = p.event;
            updateSummary();
            goToPlanner(
              "✓ Inspiración seleccionada: " +
                p.title +
                ". Personaliza tu evento.",
            );
          };
      }),
  );
}
function goToPlanner(message, field = "category") {
  Demo.close();
  document.getElementById("plannerFeedback").textContent = message;
  document.getElementById("plannerFeedback").hidden = false;
  if (window.Sections) Sections.open("personaliza");
  else {
    history.replaceState(null, "", "#personaliza");
    document
      .getElementById("personaliza")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  }
  form.elements[field]?.focus({ preventScroll: true });
}
function selectPlan(packageId) {
  const plan = state.packages.find((p) => p.id === packageId);
  form.package.value = plan.id;
  updateSummary();
  document.querySelectorAll("[data-package]").forEach((b) => {
    const selected = b.dataset.package === plan.id;
    b.setAttribute("aria-pressed", String(selected));
    b.closest(".package-card").classList.toggle("selected", selected);
  });
  goToPlanner(
    "✓ Plan " +
      plan.name +
      " seleccionado. Completa los detalles para cotizar o reservar.",
  );
}
function renderPackages() {
  document.getElementById("packageGrid").innerHTML = state.packages
    .map(
      (p, i) =>
        `<article class="package-card ${i === 2 ? "featured" : ""}"><p class="eyebrow">${i === 2 ? "✦ EL FAVORITO" : p.label.toUpperCase()}</p><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="price">${money(p.price)}<small>BASE PARA 30 INVITADOS</small></div><ul>${p.features.map((x) => `<li>✓ ${esc(x)}</li>`).join("")}</ul><button class="button ${i === 2 ? "ivory" : "outline"}" data-package="${p.id}">Este es mi plan ↗</button></article>`,
    )
    .join("");
  document.querySelectorAll("[data-package]").forEach(
    (b) =>
      (b.onclick = () => {
        selectPlan(b.dataset.package);
      }),
  );
}
const form = document.getElementById("quoteForm");
const plannerFeedback = document.createElement("p");
plannerFeedback.id = "plannerFeedback";
plannerFeedback.className = "planner-feedback";
plannerFeedback.hidden = true;
plannerFeedback.setAttribute("role", "status");
form.prepend(plannerFeedback);
form.category.innerHTML = Demo.categories
  .map((c) => `<option>${c.name}</option>`)
  .join("");
form.package.innerHTML = state.packages
  .map((p) => `<option value="${p.id}">${esc(p.name)} · ${p.label}</option>`)
  .join("");
form.date.min = Demo.future(0);
document.getElementById("extrasList").innerHTML = state.extras
  .map(
    (x, i) =>
      `<label class="extra"><input type="checkbox" name="extras" value="${i}"><span>${x.name}<small>+ ${money(x.price)}</small></span></label>`,
  )
  .join("");
function estimate() {
  const f = new FormData(form),
    p = state.packages.find((p) => p.id === f.get("package")),
    guests = Number(f.get("guests")) || 30;
  const extras = f.getAll("extras").map((i) => state.extras[Number(i)]),
    guestCost = Math.max(0, guests - 30) * 35000,
    subtotal = p.price + guestCost + extras.reduce((s, x) => s + x.price, 0);
  const promo = String(f.get("promo")).trim().toUpperCase(),
    valid =
      state.promotion.active && promo === state.promotion.code.toUpperCase(),
    discount = valid
      ? Math.round((subtotal * state.promotion.discount) / 100)
      : 0;
  return {
    p,
    extras,
    guestCost,
    subtotal,
    discount,
    total: subtotal - discount,
  };
}
function updateSummary() {
  const v = estimate(),
    f = new FormData(form),
    budget = Number(f.get("budget"));
  document.getElementById("quoteSummary").innerHTML =
    `<p class="eyebrow">TU CELEBRACIÓN, EN UN VISTAZO</p><h3>${esc(f.get("category"))}</h3><p>${esc(f.get("theme"))}<br>${esc(f.get("colors"))}</p><div class="summary-line"><span>Plan ${esc(v.p.name)}</span><strong>${money(v.p.price)}</strong></div><div class="summary-line"><span>Invitados adicionales</span><strong>${money(v.guestCost)}</strong></div>${v.extras.map((x) => `<div class="summary-line"><span>${x.name}</span><strong>${money(x.price)}</strong></div>`).join("")}<div class="summary-line"><span>Descuento</span><strong>− ${money(v.discount)}</strong></div><div class="summary-total"><small>INVERSIÓN ESTIMADA</small><strong>${money(v.total)}</strong></div>${f.get("promo") ? `<p class="form-note">${v.discount ? "Promoción aplicada." : "Código no válido o promoción inactiva."}</p>` : ""}${budget ? `<p class="budget-status">${v.total <= budget ? "✓ Dentro de tu presupuesto" : `Supera tu presupuesto por ${money(v.total - budget)}`}</p>` : ""}<p class="form-note">Anticipo del 30%: ${money(Math.round(v.total * 0.3))}<br>Incluye montaje. Valores ilustrativos.<br>Invitados extra: ${money(35000)} por persona, a partir de 30.</p><a class="button summary-next" href="#fechaEvento">Elegir fecha y completar datos ↓</a><hr><p>✦ Sin prisa, sin compromisos.<br>Guarda tu idea y vuelve cuando quieras.</p>`;
  availability();
}
function availability() {
  const busy =
    form.date.value && Demo.occupied(form.date.value, form.venue.value);
  document.getElementById("availability").textContent = !form.date.value
    ? "Elige una fecha para consultar disponibilidad."
    : busy
      ? "Esta fecha ya está reservada en el lugar elegido. Prueba otro día o lugar."
      : "✓ Fecha disponible en el lugar elegido.";
}
const month = new Date();
Demo.calendar(
  document.getElementById("quoteCalendar"),
  month,
  (date) => {
    form.date.value = date;
    availability();
  },
  form.venue.value,
);
form.venue.addEventListener("change", () => {
  Demo.calendar(
    document.getElementById("quoteCalendar"),
    month,
    (date) => {
      form.date.value = date;
      availability();
    },
    form.venue.value,
  );
  availability();
});
form.addEventListener("input", updateSummary);
form.addEventListener("change", updateSummary);
function saveQuote(reserve) {
  if (!form.reportValidity()) return;
  if (form.date.value < Demo.future(0))
    return toast("Elige una fecha de hoy en adelante.");
  if (reserve && Demo.occupied(form.date.value, form.venue.value))
    return toast("El lugar ya tiene una reserva en esa fecha.");
  const f = Object.fromEntries(new FormData(form)),
    v = estimate();
  const q = {
    ...f,
    id: Demo.id("VEL"),
    email: f.email.trim().toLowerCase(),
    package: f.kidsPlan ? `${v.p.name} · ${f.kidsPlan}` : v.p.name,
    extras: v.extras.map((x) => x.name),
    total: v.total,
    discount: v.discount,
    status: reserve ? "Reservada" : "Cotizada",
    paid: 0,
  };
  state.quotes.push(q);
  Demo.save();
  modal(
    `<p class="eyebrow">${reserve ? "RESERVA SOLICITADA" : "IDEA GUARDADA"}</p><h2>El inicio de<br><em>una gran historia.</em></h2><p>Tu referencia es <strong>${q.id}</strong>.</p><p>${esc(q.category)} · ${esc(q.date)}<br>${esc(q.venue)}</p><h3>${money(q.total)}</h3><p>Accede a Mi cuenta con <strong>${esc(q.email)}</strong> para consultar el detalle, ${reserve ? "simular el anticipo" : "confirmar la reserva"} y descargar comprobantes.</p><div class="button-row"><button class="button" id="paySavedQuote">${reserve ? "Simular pago ahora ↗" : "Reservar y simular pago ↗"}</button><a class="button outline" href="cuenta.html">Ir a mi cuenta ↗</a></div><p class="form-note">Reserva y cotización de demostración. No existe confirmación comercial real.</p>`,
  );
  document.getElementById("paySavedQuote").onclick = () => {
    if (q.status === "Cotizada") {
      if (Demo.occupied(q.date, q.venue, q.id))
        return toast(
          "La fecha ya está ocupada en este lugar. Cierra esta ventana y elige otra fecha.",
        );
      q.status = "Reservada";
      if (!Demo.save()) {
        q.status = "Cotizada";
        return;
      }
    }
    Demo.pay(q);
  };
}
form.onsubmit = (e) => {
  e.preventDefault();
  saveQuote(false);
};
document.getElementById("reserveNow").onclick = () => saveQuote(true);
document.getElementById("showAll").onclick = () => {
  allCategories = !allCategories;
  activeGroup = "Todas";
  renderExperiences();
};
document.querySelectorAll("[data-extra]").forEach(
  (b) =>
    (b.onclick = () => {
      const i = state.extras.findIndex((x) => x.name === b.dataset.extra);
      form.querySelector(`[name="extras"][value="${i}"]`).checked = true;
      updateSummary();
      goToPlanner(
        "✓ Servicio añadido a tu cotización. Puedes seguir personalizando.",
        "guests",
      );
    }),
);
document.getElementById("contactForm").onsubmit = (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  state.messages.push({ ...f, id: Demo.id("MSG"), read: false, replies: [] });
  Demo.save();
  e.target.reset();
  toast("Mensaje guardado. Puedes consultarlo en el panel administrativo.");
};
document.getElementById("invitationPreview").onclick = () => {
  modal(
    `<p class="eyebrow">ESTUDIO DE INVITACIONES</p><h2>Una invitación <em>muy tuya.</em></h2><form id="inviteForm"><label>Nombre de la celebración<input name="title" value="Una noche para celebrar" required maxlength="70"></label><label>Anfitrión o anfitriones<input name="hosts" value="Laura & Andrés" required maxlength="60"></label><label>Fecha<input name="date" type="date" value="${Demo.future(30)}" required></label><label>Lugar<input name="place" value="Jardín Velvet, Bogotá" required maxlength="100"></label><label>Color<select name="color"><option value="#542b45">Ciruela</option><option value="#365449">Salvia</option><option value="#263e60">Azul</option></select></label><button class="button">Ver mi invitación</button></form>`,
  );
  document.getElementById("inviteForm").onsubmit = (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    modal(
      `<div class="invitation" style="background:${f.color}"><p class="eyebrow">ESTÁS INVITADO A</p><h2>${esc(f.title)}</h2><div class="ornament">✦</div><h3>${esc(f.hosts)}</h3><p>${esc(f.date)}<br>${esc(f.place)}</p><p>Nos encantará compartir este momento contigo.</p><small>DISEÑADO CON AMOR · VELVET STUDIO</small></div><p class="form-note">Vista previa de invitación digital · demostración</p><button class="button" id="addInvitation">Añadir a mi cotización</button>`,
    );
    document.getElementById("addInvitation").onclick = () => {
      form.querySelector('[name="extras"][value="0"]').checked = true;
      form.notes.value = `Invitación: ${f.title} · ${f.hosts}`;
      updateSummary();
      goToPlanner(
        "✓ Invitación añadida. Completa la fecha y los datos de tu evento.",
        "date",
      );
    };
  };
};
const video = document.getElementById("heroVideo");
document.querySelector(".video-toggle").onclick = () => {
  if (video.paused) {
    video.play().catch(() => {});
    document.querySelector(".video-toggle").textContent = "Pausar video Ⅱ";
  } else {
    video.pause();
    document.querySelector(".video-toggle").textContent = "Reproducir video ▷";
  }
};
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  video.autoplay = false;
  video.pause();
  document.querySelector(".video-toggle").textContent = "Reproducir video ▷";
}
const addressLabel = document.createElement("label");
addressLabel.textContent = "Dirección o indicaciones del lugar";
addressLabel.innerHTML +=
  '<input name="address" maxlength="150" placeholder="Ej. Calle 100 # 15-20, Bogotá">';
form.venue.closest("label").after(addressLabel);
form.venue.addEventListener("change", () => {
  form.address.required = form.venue.value === "En mi ubicación";
});
const promoBlock = document.querySelector(".promo");
promoBlock.querySelector("h3").textContent = state.promotion.active
  ? `Tu próxima historia, con un ${state.promotion.discount}% de magia extra.`
  : "Tu próxima historia empieza aquí.";
promoBlock.querySelector("p").innerHTML = state.promotion.active
  ? `Aplica <strong>${esc(state.promotion.code)}</strong> a tu cotización. Promoción de demostración, no acumulable.`
  : "Personaliza tu celebración y encuentra el plan ideal para ti.";
renderExperiences();
renderGallery();
renderPackages();
updateSummary();

// Velvet IA only prepares the form; saving and reserving remain explicit user actions.
window.addEventListener("velvet:personalize", (event) => {
  const draft = event.detail || {};
  if (draft.category && Demo.categories.some((c) => c.name === draft.category))
    form.category.value = draft.category;
  if (draft.packageId && state.packages.some((p) => p.id === draft.packageId))
    form.package.value = draft.packageId;
  if (
    Number.isInteger(draft.guests) &&
    draft.guests >= 10 &&
    draft.guests <= 1000
  )
    form.guests.value = draft.guests;
  if (Number.isFinite(draft.budget) && draft.budget > 0)
    form.budget.value = Math.round(draft.budget);
  if (draft.date && draft.date >= Demo.future(0)) form.date.value = draft.date;
  if (
    draft.venue &&
    [...form.venue.options].some((o) => o.value === draft.venue)
  ) {
    form.venue.value = draft.venue;
    form.venue.dispatchEvent(new Event("change"));
  }
  updateSummary();
  goToPlanner(
    "✦ Velvet IA preparó tu idea. Revisa los detalles, elige una fecha y completa tus datos.",
    "category",
  );
});
