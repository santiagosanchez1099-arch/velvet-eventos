if (
  !Profiles.current() ||
  !Profiles.allowed(location.pathname.split("/").pop() || "admin.html")
) {
  Profiles.access(location.pathname.split("/").pop() || "admin.html");
} else {
  startAdmin();
}
function startAdmin() {
  const { state, money, esc, toast, modal } = Demo;
  const page = location.pathname.split("/").pop() || "admin.html";
  const sections = [
    ["admin.html", "◈", "Resumen"],
    ["eventos.html", "✧", "Eventos y reservas"],
    ["clientes.html", "◎", "Clientes"],
    ["mensajes.html", "✉", "Mensajes"],
    ["paquetes.html", "◇", "Paquetes y promociones"],
    ["pagos.html", "▣", "Pagos"],
    ["fotografias.html", "▧", "Fotografías"],
    ["reportes.html", "▥", "Reportes"],
    ["configuracion.html", "⚙", "Configuración"],
    ["usuarios.html", "◎", "Usuarios y roles"],
  ];
  const title = sections.find((s) => s[0] === page)?.[2] || "Resumen";
  document.body.innerHTML = `<div class="admin-shell"><aside class="sidebar"><a class="brand" href="index.html">velvet<span>ESTUDIO DE CELEBRACIONES</span></a><nav>${sections
    .filter((s) => Profiles.allowed(s[0]))
    .map(
      (s) =>
        `<a href="${s[0]}" class="${page === s[0] ? "active" : ""}">${s[1]} &nbsp; ${s[2]}</a>`,
    )
    .join(
      "",
    )}<a href="index.html">↗ &nbsp; Ver sitio web</a><a href="cuenta.html">↗ &nbsp; Cuenta del cliente</a></nav><small>${esc(Profiles.current().name)}<br>${Profiles.roles[Profiles.current().role].name} · Perfil demo<br></small></aside><main class="admin-main"><div class="admin-top"><p>ESTUDIO / ADMINISTRACIÓN / ${title.toUpperCase()}</p><div class="header-actions"><button class="icon theme-toggle" aria-label="Cambiar tema">◐</button><span class="badge">${Profiles.roles[Profiles.current().role].name}</span><button class="text-button" id="adminLogout">Salir / Cambiar perfil</button></div></div><div class="admin-title"><div><p class="eyebrow">EL DETRÁS DE CADA GRAN MOMENTO</p><h1>${title === "Resumen" ? "Todo listo para <em>celebrar.</em>" : title}</h1><p>Gestiona la experiencia Velvet con datos de este navegador.</p></div><a class="button" href="index.html#personaliza">+ Nueva cotización</a></div><div id="adminContent"></div></main></div><dialog id="modal"><button class="modal-close icon" aria-label="Cerrar ventana">×</button><div id="modalBody"></div></dialog><div id="toast" role="status"></div>`;
  const content = document.getElementById("adminContent");
  document.getElementById("adminLogout").onclick = () => {
    Profiles.signOut();
    location.href = "admin.html";
  };
  function stats() {
    return `<div class="stats-grid"><div class="stat"><small>EVENTOS Y COTIZACIONES</small><strong>${state.quotes.length}</strong><span>Historias en proceso</span></div><div class="stat"><small>RESERVAS ACTIVAS</small><strong>${state.quotes.filter((q) => q.status === "Reservada").length}</strong><span>Fechas para recordar</span></div><div class="stat"><small>RECAUDO SIMULADO</small><strong>${money(state.payments.reduce((s, p) => s + p.amount, 0))}</strong><span>Todos los movimientos</span></div><div class="stat"><small>SALDOS DE RESERVAS</small><strong>${money(state.quotes.filter((q) => q.status === "Reservada").reduce((s, q) => s + q.total - q.paid, 0))}</strong><span>Por completar</span></div></div>`;
  }
  function quoteTable(list) {
    return `<div class="table-wrap"><table><thead><tr><th>Referencia / cliente</th><th>Celebración</th><th>Fecha / lugar</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${list.map((q) => `<tr><td>${esc(q.id)}<br><strong>${esc(q.name)}</strong></td><td>${esc(q.category)}<br><small>${q.guests} invitados</small></td><td>${esc(q.date)}<br>${esc(q.venue)}</td><td>${money(q.total)}</td><td><span class="status">${esc(q.status)}</span></td><td><button class="text-button" data-edit-event="${q.id}">Gestionar ↗</button></td></tr>`).join("") || '<tr><td colspan="6">Sin resultados.</td></tr>'}</tbody></table></div>`;
  }
  function bindEvents() {
    if (!Profiles.allowed("eventos")) {
      document.querySelectorAll("[data-edit-event]").forEach((b) => b.remove());
      return;
    }
    document
      .querySelectorAll("[data-edit-event]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            editEvent(state.quotes.find((q) => q.id === b.dataset.editEvent))),
      );
  }
  function editEvent(q) {
    modal(
      `<p class="eyebrow">${esc(q.id)}</p><h2>Los detalles de <em>la historia.</em></h2><form id="eventEdit"><div class="form-grid"><label>Cliente<input name="name" value="${esc(q.name)}" required></label><label>Correo<input name="email" type="email" value="${esc(q.email)}" required></label><label>Fecha<input name="date" type="date" value="${q.date}" required></label><label>Lugar<select name="venue">${["Jardín Velvet · Bogotá", "Salón Imperial · Bogotá", "Hacienda del Sol · Chía", "En mi ubicación"].map((v) => `<option ${q.venue === v ? "selected" : ""}>${v}</option>`).join("")}</select></label><label>Invitados<input name="guests" type="number" min="10" max="1000" value="${q.guests}" required></label><label>Estado<select name="status">${["Cotizada", "Reservada", "Finalizada", "Cancelada"].map((s) => `<option ${q.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><label>Total acordado (COP)<input name="total" type="number" min="${q.paid}" value="${q.total}" required></label><label>Dirección<input name="address" value="${esc(q.address || "")}" maxlength="150"></label><label>Notas<input name="notes" value="${esc(q.notes)}" maxlength="300"></label></div><p class="form-note">Total acordado manualmente: cambiar invitados aquí no recalcula el precio. Pagado: ${money(q.paid)}. El total no puede ser inferior a ese valor.</p><button class="button">Guardar cambios</button></form>`,
    );
    document.getElementById("eventEdit").onsubmit = (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      if (f.status === "Reservada" && f.date < Demo.future(0))
        return toast("No puedes reservar una fecha pasada.");
      if (f.status === "Reservada" && Demo.occupied(f.date, f.venue, q.id))
        return toast("El lugar ya está reservado para esa fecha.");
      Object.assign(q, f, {
        email: f.email.trim().toLowerCase(),
        total: Number(f.total),
        guests: Number(f.guests),
      });
      Demo.save();
      Demo.close();
      render();
      toast("Evento actualizado.");
    };
  }
  function dashboard() {
    if (Profiles.current().role === "contenido") {
      content.innerHTML = `<div class="notice">Tu espacio de Contenido: actualiza la propuesta visual y comercial del estudio.</div><div class="settings-grid"><article class="panel"><h3>Paquetes y promociones</h3><p>${state.packages.length} planes para inspirar nuevas celebraciones.</p><a class="button" href="paquetes.html">Gestionar paquetes ↗</a></article><article class="panel"><h3>Inspiración y fotografías</h3><p>${state.photos.length} elementos en la galería.</p><a class="button" href="fotografias.html">Gestionar galería ↗</a></article></div>`;
      return;
    }
    content.innerHTML =
      stats() +
      `<div class="admin-grid"><div class="panel"><p class="eyebrow">UN VISTAZO A TUS HISTORIAS</p><h3>Estado de celebraciones</h3><div class="bar-chart">${[
        "Cotizada",
        "Reservada",
        "Finalizada",
        "Cancelada",
      ]
        .map((s) => {
          const n = state.quotes.filter((q) => q.status === s).length;
          return `<div class="bar-col"><b>${n}</b><i style="height:${Math.max(3, (n / Math.max(1, state.quotes.length)) * 100)}%"></i><span>${s}</span></div>`;
        })
        .join(
          "",
        )}</div><p class="form-note">Calculado con las cotizaciones locales.</p></div><div class="panel"><h3>Calendario del estudio</h3><div id="adminCalendar" class="calendar"></div></div></div><div class="admin-title"><h3>Últimas celebraciones</h3><a class="text-button" href="eventos.html">Ver todas ↗</a></div>${quoteTable(state.quotes.slice().reverse().slice(0, 6))}`;
    Demo.calendar(
      document.getElementById("adminCalendar"),
      new Date(),
      (date) => showDay(date),
    );
    bindEvents();
  }
  function showDay(date) {
    const list = state.quotes.filter(
      (q) => q.date === date && q.status === "Reservada",
    );
    modal(
      `<p class="eyebrow">AGENDA · ${date}</p><h2>Un día para <em>recordar.</em></h2>${list.length ? list.map((q) => `<article class="panel"><h3>${esc(q.category)}</h3><p>${esc(q.name)}<br>${esc(q.venue)}</p><button class="text-button" data-edit-event="${q.id}">Gestionar ↗</button></article>`).join("") : "<p>No hay reservas activas. Todos los lugares están disponibles.</p>"}`,
    );
    bindEvents();
  }
  function events() {
    content.innerHTML = `<div class="toolbar"><input id="eventSearch" aria-label="Buscar evento" placeholder="Buscar cliente, evento o referencia…"><select id="statusFilter" aria-label="Filtrar estado"><option>Todos los estados</option><option>Cotizada</option><option>Reservada</option><option>Finalizada</option><option>Cancelada</option></select><button class="text-button" id="showAgenda">Consultar calendario ↗</button></div><div id="eventTable"></div>`;
    const filter = () => {
      const text = document.getElementById("eventSearch").value.toLowerCase(),
        status = document.getElementById("statusFilter").value;
      document.getElementById("eventTable").innerHTML = quoteTable(
        state.quotes
          .filter(
            (q) =>
              (status === "Todos los estados" || q.status === status) &&
              `${q.id} ${q.name} ${q.category}`.toLowerCase().includes(text),
          )
          .slice()
          .reverse(),
      );
      bindEvents();
    };
    document.getElementById("eventSearch").oninput = filter;
    document.getElementById("statusFilter").onchange = filter;
    document.getElementById("showAgenda").onclick = () => {
      modal(
        '<h2>Agenda <em>Velvet.</em></h2><div class="calendar" id="calendarModal"></div><div id="dayList"></div>',
      );
      Demo.calendar(
        document.getElementById("calendarModal"),
        new Date(),
        (date) => {
          const list = state.quotes.filter(
            (q) => q.date === date && q.status === "Reservada",
          );
          document.getElementById("dayList").innerHTML =
            `<h3>${date}</h3>${list.map((q) => `<p>${esc(q.category)} · ${esc(q.name)}<br>${esc(q.venue)}</p>`).join("") || "<p>Sin reservas en esta fecha.</p>"}`;
        },
      );
    };
    filter();
  }
  function clients() {
    const people = new Map(
      state.users.filter((u) => u.role === "cliente").map((u) => [u.email, u]),
    );
    state.quotes.forEach((q) => {
      if (!people.has(q.email))
        people.set(q.email, {
          name: q.name,
          email: q.email,
          phone: q.phone || "",
        });
    });
    content.innerHTML = `<div class="toolbar"><input id="clientSearch" aria-label="Buscar cliente" placeholder="Buscar por nombre o correo…"><button class="button" id="newClient">+ Nuevo cliente</button></div><div id="clientTable"></div>`;
    const filter = () => {
      const text = document.getElementById("clientSearch").value.toLowerCase();
      document.getElementById("clientTable").innerHTML =
        `<div class="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Eventos</th><th>Acciones</th></tr></thead><tbody>${
          [...people.values()]
            .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(text))
            .map(
              (u) =>
                `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${state.quotes.filter((q) => q.email === u.email).length}</td><td><button class="text-button" data-client="${esc(u.email)}">Ver / editar ↗</button></td></tr>`,
            )
            .join("") || '<tr><td colspan="4">Sin resultados.</td></tr>'
        }</tbody></table></div>`;
      document
        .querySelectorAll("[data-client]")
        .forEach(
          (b) => (b.onclick = () => editClient(people.get(b.dataset.client))),
        );
    };
    document.getElementById("clientSearch").oninput = filter;
    document.getElementById("newClient").onclick = () => editClient();
    filter();
  }
  function editClient(user) {
    modal(
      `<h2>${user ? "Editar" : "Nuevo"} <em>cliente.</em></h2><form id="clientEdit"><label>Nombre<input name="name" value="${esc(user?.name || "")}" required minlength="2"></label><label>Correo<input name="email" type="email" value="${esc(user?.email || "")}" required ${user ? "readonly" : ""}></label><label>Teléfono<input name="phone" type="tel" value="${esc(user?.phone || "")}"></label><button class="button">Guardar cliente</button></form>${user ? `<p class="form-note">${state.quotes.filter((q) => q.email === user.email).length} eventos asociados. El correo identifica los registros.</p>` : ""}`,
    );
    document.getElementById("clientEdit").onsubmit = (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      f.email = f.email.trim().toLowerCase();
      const existing = state.users.find((u) => u.email === f.email);
      if (!user && existing) return toast("Ese correo ya está registrado.");
      if (existing) Object.assign(existing, f);
      else
        state.users.push({
          ...f,
          id: Demo.id("USR"),
          role: "cliente",
          active: true,
        });
      state.quotes
        .filter((q) => q.email === f.email)
        .forEach((q) => {
          q.name = f.name;
          q.phone = f.phone;
        });
      Demo.save();
      Demo.close();
      render();
      toast("Cliente guardado.");
    };
  }
  function messages() {
    content.innerHTML = `<div class="toolbar"><input id="messageSearch" placeholder="Buscar en mensajes…" aria-label="Buscar mensajes"><select id="messageFilter" aria-label="Filtrar mensajes"><option>Todos</option><option>No leídos</option><option>Leídos</option></select></div><div id="messageList"></div>`;
    const filter = () => {
      const text = document.getElementById("messageSearch").value.toLowerCase(),
        status = document.getElementById("messageFilter").value;
      document.getElementById("messageList").innerHTML =
        state.messages
          .filter(
            (m) =>
              `${m.name} ${m.email} ${m.message}`
                .toLowerCase()
                .includes(text) &&
              (status === "Todos" || (status === "Leídos" ? m.read : !m.read)),
          )
          .slice()
          .reverse()
          .map(
            (m) =>
              `<article class="panel message-card"><span class="status">${m.read ? "Leído" : "Nuevo"}</span><h3>${esc(m.name)}</h3><p class="readonly">${esc(m.email)}</p><p>${esc(m.message)}</p>${m.replies.map((r) => `<div class="message-reply"><p>${esc(r.text)}</p><small>${new Date(r.date).toLocaleString("es-CO")}</small></div>`).join("")}<div class="button-row"><button class="text-button" data-read="${m.id}">${m.read ? "Marcar no leído" : "Marcar leído"}</button><button class="button outline" data-reply="${m.id}">Responder ↗</button><button class="text-button" data-delete-message="${m.id}">Eliminar</button></div></article>`,
          )
          .join("") || '<p class="empty">No hay mensajes que coincidan.</p>';
      document.querySelectorAll("[data-read]").forEach(
        (b) =>
          (b.onclick = () => {
            const m = state.messages.find((m) => m.id === b.dataset.read);
            m.read = !m.read;
            Demo.save();
            filter();
          }),
      );
      document.querySelectorAll("[data-reply]").forEach(
        (b) =>
          (b.onclick = () => {
            const m = state.messages.find((m) => m.id === b.dataset.reply);
            modal(
              `<h2>Una respuesta <em>cercana.</em></h2><p>Para ${esc(m.name)} · ${esc(m.email)}</p><form id="replyForm"><label>Respuesta<textarea name="reply" required minlength="3" rows="5"></textarea></label><button class="button">Guardar respuesta simulada</button><p class="form-note">Se verá en la cuenta del cliente. No se enviará ningún correo.</p></form>`,
            );
            document.getElementById("replyForm").onsubmit = (e) => {
              e.preventDefault();
              m.replies.push({
                text: e.target.reply.value,
                date: new Date().toISOString(),
              });
              m.read = true;
              Demo.save();
              Demo.close();
              filter();
              toast("Respuesta guardada en la conversación.");
            };
          }),
      );
      document.querySelectorAll("[data-delete-message]").forEach(
        (b) =>
          (b.onclick = () => {
            modal(
              '<h2>Eliminar <em>mensaje.</em></h2><p>Se eliminará la conversación local y sus respuestas.</p><button class="button" id="confirmDelete">Eliminar conversación</button>',
            );
            document.getElementById("confirmDelete").onclick = () => {
              state.messages = state.messages.filter(
                (m) => m.id !== b.dataset.deleteMessage,
              );
              Demo.save();
              Demo.close();
              filter();
            };
          }),
      );
    };
    document.getElementById("messageSearch").oninput = filter;
    document.getElementById("messageFilter").onchange = filter;
    filter();
  }
  function packages() {
    content.innerHTML = `<div class="package-grid">${state.packages.map((p) => `<article class="package-card"><p class="eyebrow">${p.label}</p><h3>${esc(p.name)}</h3><div class="price">${money(p.price)}</div><ul>${p.features.map((x) => `<li>✓ ${esc(x)}</li>`).join("")}</ul><button class="button outline" data-edit-package="${p.id}">Editar paquete ↗</button></article>`).join("")}</div><form class="panel" id="promoEdit" style="margin-top:25px"><h3>Promoción especial</h3><div class="form-grid"><label>Código<input name="code" value="${esc(state.promotion.code)}" required pattern="[A-Za-z0-9]{3,20}"></label><label>Descuento (%)<input name="discount" type="number" min="1" max="50" value="${state.promotion.discount}" required></label><label>Estado<select name="active"><option value="true" ${state.promotion.active ? "selected" : ""}>Activa</option><option value="false" ${!state.promotion.active ? "selected" : ""}>Inactiva</option></select></label></div><button class="button">Guardar promoción</button><p class="form-note">Se aplica a nuevas cotizaciones. Los valores de cotizaciones guardadas se conservan.</p></form>`;
    document.querySelectorAll("[data-edit-package]").forEach(
      (b) =>
        (b.onclick = () => {
          const p = state.packages.find((p) => p.id === b.dataset.editPackage);
          modal(
            `<h2>Diseñar el <em>plan.</em></h2><form id="packageEdit"><label>Nombre<input name="name" value="${esc(p.name)}" required></label><label>Precio base (COP)<input name="price" type="number" min="100000" step="1000" value="${p.price}" required></label><label>Descripción<input name="description" value="${esc(p.description)}" required></label><label>Servicios (uno por línea)<textarea name="features" rows="4" required>${esc(p.features.join("\n"))}</textarea></label><button class="button">Guardar paquete</button></form>`,
          );
          document.getElementById("packageEdit").onsubmit = (e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.target));
            Object.assign(p, f, {
              price: Number(f.price),
              features: f.features
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean),
            });
            Demo.save();
            Demo.close();
            render();
            toast("Paquete actualizado para nuevas cotizaciones.");
          };
        }),
    );
    document.getElementById("promoEdit").onsubmit = (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      Object.assign(state.promotion, {
        code: f.code.toUpperCase(),
        discount: Number(f.discount),
        active: f.active === "true",
      });
      Demo.save();
      toast("Promoción actualizada.");
    };
  }
  function payments() {
    content.innerHTML =
      stats() +
      `<h3>Reservas y saldos</h3><div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Total</th><th>Pagado</th><th>Saldo</th><th>Acción</th></tr></thead><tbody>${
        state.quotes
          .filter((q) => q.status === "Reservada" || q.paid > 0)
          .map(
            (q) =>
              `<tr><td>${esc(q.name)}<br>${esc(q.id)} · ${esc(q.status)}</td><td>${money(q.total)}</td><td>${money(q.paid)}</td><td>${money(q.total - q.paid)}</td><td>${q.status === "Reservada" && q.paid < q.total ? `<button class="text-button" data-pay="${q.id}">Simular pago ↗</button>` : "—"}</td></tr>`,
          )
          .join("") || '<tr><td colspan="5">Sin reservas con pagos.</td></tr>'
      }</tbody></table></div><h3 style="margin:30px 0 20px">Historial de pagos simulados</h3><div class="table-wrap"><table><thead><tr><th>Comprobante</th><th>Reserva</th><th>Fecha</th><th>Importe</th><th>Acción</th></tr></thead><tbody>${state.payments.map((p) => `<tr><td>${esc(p.id)}</td><td>${esc(p.quoteId)}</td><td>${new Date(p.date).toLocaleDateString("es-CO")}</td><td>${money(p.amount)}</td><td><button class="text-button" data-receipt="${p.id}">Ver / descargar ↗</button></td></tr>`).join("")}</tbody></table></div>`;
    document.querySelectorAll("[data-pay]").forEach(
      (b) =>
        (b.onclick = () =>
          Demo.pay(
            state.quotes.find((q) => q.id === b.dataset.pay),
            render,
          )),
    );
    document
      .querySelectorAll("[data-receipt]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            Demo.receipt(
              state.payments.find((p) => p.id === b.dataset.receipt),
            )),
      );
  }
  function photos() {
    content.innerHTML = `<div class="notice">Las fotos se guardan únicamente en este navegador. Usa imágenes JPG, PNG o WebP de hasta 1 MB. Puedes editar títulos y categorías o retirar una imagen de la galería.</div><form class="panel" id="photoForm"><h3>Una nueva inspiración</h3><div class="form-grid"><label>Título<input name="title" required maxlength="80"></label><label>Categoría<select name="category">${["Bodas", "Quinceañeras", "Infantiles", "Empresariales", "Grados", "Familia", "Romance", "Adultos", "Especiales"].map((c) => `<option>${c}</option>`).join("")}</select></label><label>Imagen local<input name="file" type="file" accept="image/png,image/jpeg,image/webp" required></label></div><button class="button">Añadir a la galería</button></form><div class="admin-photo-grid" style="margin-top:25px">${state.photos.map((p) => `<article class="panel">${p.video ? `<video class="admin-gallery-video" src="${esc(p.src)}" poster="imagen1.png" controls playsinline preload="metadata" aria-label="${esc(p.title)}"></video>` : Inspiration.media(p)}<p>${esc(p.title)}<br><small>${esc(p.category)}</small></p><button class="text-button" data-edit-photo="${p.id}">Editar</button> <button class="text-button" data-remove-photo="${p.id}">Retirar</button></article>`).join("")}</div>`;
    document.getElementById("photoForm").onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target),
        file = f.get("file");
      if (
        !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
        file.size > 1048576
      )
        return toast("Usa una imagen JPG, PNG o WebP de hasta 1 MB.");
      const reader = new FileReader();
      reader.onload = () => {
        const p = {
          id: Demo.id("IMG"),
          src: reader.result,
          title: f.get("title"),
          category: f.get("category"),
        };
        state.photos.push(p);
        if (!Demo.save()) {
          state.photos.pop();
          return;
        }
        render();
        toast("Imagen añadida a la galería.");
      };
      reader.readAsDataURL(file);
    };
    document.querySelectorAll("[data-remove-photo]").forEach(
      (b) =>
        (b.onclick = () => {
          modal(
            '<h2>Retirar <em>inspiración.</em></h2><p>Se retirará de la galería local. Los archivos originales del proyecto se conservan.</p><button class="button" id="removePhoto">Retirar de la galería</button>',
          );
          document.getElementById("removePhoto").onclick = () => {
            state.photos = state.photos.filter(
              (p) => p.id !== b.dataset.removePhoto,
            );
            Demo.save();
            Demo.close();
            render();
          };
        }),
    );
    document.querySelectorAll("[data-edit-photo]").forEach(
      (b) =>
        (b.onclick = () => {
          const p = state.photos.find((p) => p.id === b.dataset.editPhoto);
          modal(
            `<h2>Editar <em>inspiración.</em></h2><form id="photoEdit"><label>Título<input name="title" value="${esc(p.title)}" required></label><label>Categoría<select name="category">${(p.video ? ["Videos"] : ["Bodas", "Quinceañeras", "Infantiles", "Empresariales", "Grados", "Familia", "Romance", "Adultos", "Especiales"]).map((c) => `<option ${p.category === c ? "selected" : ""}>${c}</option>`).join("")}</select></label><button class="button">Guardar</button></form>`,
          );
          document.getElementById("photoEdit").onsubmit = (e) => {
            e.preventDefault();
            Object.assign(p, Object.fromEntries(new FormData(e.target)));
            Demo.save();
            Demo.close();
            render();
          };
        }),
    );
  }
  function reports() {
    content.innerHTML =
      stats() +
      `<div class="panel"><h3>Informe de actividad local</h3><p class="form-note">Exporta las cotizaciones para presentar la demostración.</p><button class="button" id="exportCsv">Descargar reporte CSV ↗</button></div><div style="margin-top:25px">${quoteTable(state.quotes)}</div>`;
    bindEvents();
    document.getElementById("exportCsv").onclick = () => {
      const cell = (s) =>
        '"' +
        String(s)
          .replace(/"/g, '""')
          .replace(/^[=+@-]/, "'") +
        '"';
      const rows = [
        [
          "Referencia",
          "Cliente",
          "Celebración",
          "Fecha",
          "Lugar",
          "Estado",
          "Total COP",
          "Pagado COP",
          "Saldo COP",
        ],
        ...state.quotes.map((q) => [
          q.id,
          q.name,
          q.category,
          q.date,
          q.venue,
          q.status,
          q.total,
          q.paid,
          q.total - q.paid,
        ]),
      ];
      const blob = new Blob(
        ["\ufeff" + rows.map((r) => r.map(cell).join(";")).join("\r\n")],
        { type: "text/csv;charset=utf-8" },
      );
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "velvet-reporte-demo.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
  }
  function settings() {
    content.innerHTML = `<div class="settings-grid"><article class="panel"><h3>La experiencia demo</h3><p>Este prototipo utiliza HTML, CSS, JavaScript y almacenamiento local. No hay base de datos, pasarela de pagos, envío de correos ni conexiones con WhatsApp o Gemini.</p><p>La cuenta del cliente usa acceso por correo sin contraseña. El equipo entra por correo de prueba y ve las herramientas permitidas para su rol.</p><p>Las imágenes originales se complementan con montajes infantiles generados para la demo. El video es un montaje animado local.</p><a class="button outline" href="cuenta.html">Abrir cuenta del cliente ↗</a></article><article class="panel"><h3>Volver al punto de partida</h3><p>Restablece los datos iniciales para una nueva presentación. Se borrarán las cotizaciones, pagos, mensajes, clientes y fotografías añadidos en este navegador.</p><button class="button" id="resetDemo">Restablecer demostración</button></article></div>`;
    document.getElementById("resetDemo").onclick = () => {
      modal(
        '<h2>Una nueva <em>historia.</em></h2><p>Se borrarán los datos de prueba de este navegador y se cargarán los ejemplos originales.</p><button class="button" id="confirmReset">Sí, restablecer datos</button>',
      );
      document.getElementById("confirmReset").onclick = () => {
        localStorage.removeItem("velvet-demo-v1");
        location.reload();
      };
    };
  }
  function render() {
    (
      ({
        "admin.html": dashboard,
        "eventos.html": events,
        "clientes.html": clients,
        "mensajes.html": messages,
        "paquetes.html": packages,
        "pagos.html": payments,
        "fotografias.html": photos,
        "reportes.html": reports,
        "configuracion.html": settings,
        "usuarios.html": () => Profiles.manageUsers(content),
      })[page] || dashboard
    )();
  }
  render();
}
