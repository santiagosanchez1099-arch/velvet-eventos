(() => {
  const { state, money, esc } = Demo;
  let audience = "nino";
  const section = document.createElement("section");
  section.id = "infantiles";
  section.className = "section kids-section";
  section.innerHTML = `<div class="section-head"><div><p class="eyebrow">PEQUEÑOS PROTAGONISTAS · GRANDES AVENTURAS</p><h2>Su mundo favorito.<br><em>Su fiesta soñada.</em></h2></div><p>Planes para niño y niña, montajes temáticos y detalles para imaginar. Todas las temáticas se pueden combinar a tu gusto.</p></div><div class="kids-audiences" role="group" aria-label="Planes infantiles"><button data-audience="nino" class="kid-audience active" aria-pressed="true"><span>✦</span><strong>Planes para niño</strong><small>Aventuras, carreras y superhéroes</small></button><button data-audience="nina" class="kid-audience" aria-pressed="false"><span>♔</span><strong>Planes para niña</strong><small>Castillos, brillo y mundos de fantasía</small></button></div><div id="kidsPlanHeader" class="kids-plan-header"></div><div id="kidsThemes" class="kids-themes"></div><div class="section-head catalog-heading"><div><p class="eyebrow">UN TOQUE EXTRA DE DIVERSIÓN</p><h2>El catálogo de <em>los detalles.</em></h2></div><p>Añade experiencias a tu plan. Los precios son ilustrativos y se suman al presupuesto del personalizador.</p></div><div class="catalog-grid" id="kidsAdditions"></div>`;
  document.querySelector(".feature-band").before(section);
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "kidsPlan";
  form.append(hidden);
  function ensure(select, value) {
    if (![...select.options].some((o) => o.value === value))
      select.add(new Option(value, value));
    select.value = value;
  }
  function choose(theme) {
    form.category.value =
      theme.audience === "nino" ? "Cumpleaños de niño" : "Cumpleaños de niña";
    ensure(form.theme, theme.name);
    ensure(form.colors, theme.palette);
    form.decoration.value = "Globos y fondos temáticos";
    form.package.value = "especial";
    hidden.value =
      theme.audience === "nino"
        ? "Pequeñas aventuras · Niño"
        : "Sueños de colores · Niña";
    updateSummary();
    goToPlanner(
      "✦ Elegiste " +
        theme.name +
        ". Ajusta los invitados y añade los detalles que más te gusten.",
      "guests",
    );
    renderPreview();
  }
  function render() {
    const plan =
      state.packages.find((p) => p.id === "especial") || state.packages[0];
    document.getElementById("kidsPlanHeader").innerHTML =
      `<div><p class="eyebrow">PLAN INFANTIL · ${audience === "nino" ? "NIÑO" : "NIÑA"}</p><h3>${audience === "nino" ? "Pequeñas aventuras" : "Sueños de colores"}</h3><p>Base ${esc(plan.name)}: ${plan.features.map(esc).join(" · ")}.</p></div><div><strong>${money(plan.price)}</strong><small>Base para 30 invitados · elige una temática</small></div>`;
    document.getElementById("kidsThemes").innerHTML = KidsCatalog.themes
      .filter((t) => t.audience === audience)
      .map(
        (t) =>
          `<article class="kids-theme-card">${KidsCatalog.media(t)}<div><p class="eyebrow">${audience === "nino" ? "AVENTURAS" : "FANTASÍA"}</p><h3>${t.name}</h3><p>${t.description}</p><button class="button outline" data-kid-theme="${t.id}">Elegir temática ↗</button></div></article>`,
      )
      .join("");
    section
      .querySelectorAll("[data-kid-theme]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            choose(
              KidsCatalog.themes.find((t) => t.id === b.dataset.kidTheme),
            )),
      );
    section.querySelectorAll("[data-audience]").forEach((b) => {
      b.classList.toggle("active", b.dataset.audience === audience);
      b.setAttribute("aria-pressed", String(b.dataset.audience === audience));
    });
  }
  section.querySelectorAll("[data-audience]").forEach(
    (b) =>
      (b.onclick = () => {
        audience = b.dataset.audience;
        render();
      }),
  );
  function renderAdditions() {
    document.getElementById("kidsAdditions").innerHTML = KidsCatalog.additions
      .map((item) => {
        const index = state.extras.findIndex((e) => e.name === item.name),
          chosen = form.querySelector(
            `[name="extras"][value="${index}"]`,
          )?.checked;
        return `<article class="catalog-item">${KidsCatalog.media(item.cell)}<div><h3>${esc(item.name)}</h3><p>${esc(item.description)}</p><strong>${money(state.extras[index].price)}</strong><button class="button ${chosen ? "" : "outline"}" data-catalog-extra="${index}" aria-pressed="${!!chosen}">${chosen ? "✓ Añadido · quitar" : "Añadir a mi plan +"}</button></div></article>`;
      })
      .join("");
    section.querySelectorAll("[data-catalog-extra]").forEach(
      (b) =>
        (b.onclick = () => {
          const input = form.querySelector(
            `[name="extras"][value="${b.dataset.catalogExtra}"]`,
          );
          input.checked = !input.checked;
          updateSummary();
          renderAdditions();
          renderPreview();
          Demo.toast(
            input.checked
              ? "Adicional añadido. Tu presupuesto ya se actualizó."
              : "Adicional retirado del presupuesto.",
          );
        }),
    );
  }
  function renderPreview() {
    const theme = KidsCatalog.themes.find((t) => t.name === form.theme.value);
    let preview = document.getElementById("kidsPreview");
    if (!theme || !form.category.value.includes("niñ")) {
      preview?.remove();
      return;
    }
    if (!preview) {
      preview = document.createElement("div");
      preview.id = "kidsPreview";
      preview.className = "kids-preview";
      document.getElementById("quoteSummary").prepend(preview);
    }
    preview.innerHTML =
      KidsCatalog.media(theme) +
      `<span>${esc(theme.name)} · Tu inspiración</span>`;
  }
  form.addEventListener("input", () => {
    renderAdditions();
    renderPreview();
  });
  form.addEventListener("change", () => {
    if (!form.category.value.includes("niñ")) hidden.value = "";
    else if (hidden.value)
      hidden.value = form.category.value.includes("niño")
        ? "Pequeñas aventuras · Niño"
        : "Sueños de colores · Niña";
    renderPreview();
  });
  document.getElementById("experienceGrid").addEventListener(
    "click",
    (e) => {
      const target = e.target.closest("[data-category]");
      if (!target) return;
      const id = Number(target.dataset.category);
      if (![0, 1].includes(id)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      audience = [0, 3].includes(id) ? "nino" : "nina";
      render();
      if (window.Sections) return Sections.open("infantiles");
      section.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    },
    true,
  );
  render();
  renderAdditions();
})();
