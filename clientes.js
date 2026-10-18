/* Shared customer portal, usable as a page or inside the home dialog. */
(() => {
  const { state, money, esc, toast, modal } = Demo;
  function renderAccount() {
    const host = document.getElementById("accountContent");
    if (
      !state.session ||
      !state.users.some(
        (u) => u.email === state.session && u.active && u.role === "cliente",
      )
    ) {
      host.innerHTML = `<p class="eyebrow">TU ESPACIO VELVET</p><h1>Cada historia<br>tiene <em>su lugar.</em></h1><div class="notice">Acceso simulado: entra con cualquier correo registrado. No se solicitan contraseñas reales. Prueba con <strong>laura@demo.local</strong> para explorar una reserva con anticipo.</div><div class="auth-layout"><form class="panel" id="loginForm"><h3>Bienvenido de nuevo</h3><label>Correo<input name="email" type="email" value="laura@demo.local" required></label><button class="button">Entrar a la demo ↗</button><p>Si guardaste una cotización, puedes acceder con el mismo correo.</p></form><form class="panel" id="registerForm"><h3>Empecemos tu historia</h3><label>Nombre<input name="name" required minlength="2"></label><label>Correo<input name="email" type="email" required></label><button class="button">Crear cuenta de prueba ↗</button><p>Registro local, sin verificación de correo ni credenciales.</p></form></div>`;
      document.getElementById("loginForm").onsubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim().toLowerCase(),
          user = state.users.find((u) => u.email === email),
          quote = state.quotes.find((q) => q.email === email);
        if (user && !user.active)
          return toast(
            "Esta cuenta está desactivada. Contacta al administrador.",
          );
        if (user && user.role !== "cliente")
          return toast(
            "Este perfil pertenece al equipo. Entra desde Administración.",
          );
        if (!user && !quote)
          return toast("Ese correo no tiene datos. Crea una cuenta de prueba.");
        if (!user)
          state.users.push({
            id: Demo.id("USR"),
            name: quote.name,
            email,
            role: "cliente",
            active: true,
          });
        state.session = email;
        Demo.save();
        renderAccount();
      };
      document.getElementById("registerForm").onsubmit = (e) => {
        e.preventDefault();
        const f = Object.fromEntries(new FormData(e.target));
        f.email = f.email.trim().toLowerCase();
        if (state.users.some((u) => u.email === f.email))
          return toast("Ese correo ya está registrado. Usa Entrar a la demo.");
        state.users.push({
          ...f,
          id: Demo.id("USR"),
          role: "cliente",
          active: true,
        });
        state.session = f.email;
        Demo.save();
        renderAccount();
      };
      return;
    }
    const user = state.users.find((u) => u.email === state.session),
      quotes = state.quotes.filter((q) => q.email === state.session),
      payments = state.payments.filter((p) =>
        quotes.some((q) => q.id === p.quoteId),
      );
    host.innerHTML = `<div class="admin-title"><div><p class="eyebrow">TU ESPACIO VELVET</p><h1>Hola, <em>${esc(user?.name || "celebremos")}.</em></h1><p>Todo lo que imaginas, en un solo lugar.</p></div><button class="text-button" id="logout">Cerrar sesión ↗</button></div><div class="stats-grid"><div class="stat"><small>COTIZACIONES</small><strong>${quotes.length}</strong></div><div class="stat"><small>RESERVAS ACTIVAS</small><strong>${quotes.filter((q) => q.status === "Reservada").length}</strong></div><div class="stat"><small>PAGOS SIMULADOS</small><strong>${money(payments.reduce((s, p) => s + p.amount, 0))}</strong></div><div class="stat"><small>SALDO DE RESERVAS</small><strong>${money(quotes.filter((q) => q.status === "Reservada").reduce((s, q) => s + q.total - q.paid, 0))}</strong></div></div><h3>Mis celebraciones</h3><div class="quote-list">${quotes.map((q) => `<article class="panel"><span class="status">${esc(q.status)}</span><h3>${esc(q.category)}</h3><p>${esc(q.id)} · ${esc(q.date)}<br>${esc(q.venue)}${q.address ? `<br>${esc(q.address)}` : ""}</p><p>${esc(q.theme)} · ${esc(q.colors)}<br>${q.guests} invitados · Plan ${esc(q.package)}</p><p>${esc(q.extras.join(", ") || "Sin servicios adicionales")}</p><p>${esc(q.notes || "")}</p><div class="summary-line"><span>Total</span><strong>${money(q.total)}</strong></div><div class="summary-line"><span>Pagado</span><strong>${money(q.paid)}</strong></div><div class="summary-line"><span>Saldo</span><strong>${money(q.total - q.paid)}</strong></div><div class="button-row">${q.status === "Cotizada" ? `<button class="button" data-reserve="${q.id}">Confirmar reserva</button>` : ""}${q.status === "Reservada" && q.paid < q.total ? `<button class="button" data-pay="${q.id}">Simular pago ↗</button>` : ""}${q.status !== "Cancelada" && q.status !== "Finalizada" ? `<button class="text-button" data-cancel="${q.id}">Cancelar</button>` : ""}</div></article>`).join("") || '<div class="empty">Aún no hay cotizaciones. <a href="index.html#personaliza">Diseña tu primer evento ↗</a></div>'}</div><section class="receipt-list"><h3>Mis comprobantes</h3>${payments.length ? `<div class="table-wrap"><table><thead><tr><th>Referencia</th><th>Reserva</th><th>Valor</th><th>Comprobante</th></tr></thead><tbody>${payments.map((p) => `<tr><td>${esc(p.id)}</td><td>${esc(p.quoteId)}</td><td>${money(p.amount)}</td><td><button class="text-button" data-receipt="${p.id}">Ver / descargar ↗</button></td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Aquí aparecerán tus pagos de demostración.</p>'}</section><section><h3>Mis conversaciones</h3>${
      state.messages
        .filter((m) => m.email.toLowerCase() === state.session)
        .map(
          (m) =>
            `<article class="panel message-card"><p>${esc(m.message)}</p>${m.replies.map((r) => `<p class="message-reply"><strong>Velvet Studio</strong><br>${esc(r.text)}</p>`).join("") || '<p class="form-note">Pendiente de respuesta del equipo.</p>'}</article>`,
        )
        .join("") || '<p class="form-note">No hay mensajes en tu cuenta.</p>'
    }</section>`;
    document.getElementById("logout").onclick = () => {
      state.session = null;
      Demo.save();
      renderAccount();
    };
    document.querySelectorAll("[data-pay]").forEach(
      (b) =>
        (b.onclick = () =>
          Demo.pay(
            quotes.find((q) => q.id === b.dataset.pay),
            renderAccount,
          )),
    );
    document
      .querySelectorAll("[data-receipt]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            Demo.receipt(payments.find((p) => p.id === b.dataset.receipt))),
      );
    document.querySelectorAll("[data-reserve]").forEach(
      (b) =>
        (b.onclick = () => {
          const q = quotes.find((q) => q.id === b.dataset.reserve);
          if (q.date < Demo.future(0))
            return toast("Esta fecha ya pasó. Crea una nueva cotización.");
          if (Demo.occupied(q.date, q.venue, q.id))
            return toast(
              "La fecha ya está ocupada. Solicita una nueva cotización.",
            );
          q.status = "Reservada";
          Demo.save();
          renderAccount();
          toast(
            "Reserva confirmada para la demostración. Ya puedes simular el anticipo.",
          );
        }),
    );
    document.querySelectorAll("[data-cancel]").forEach(
      (b) =>
        (b.onclick = () => {
          const q = quotes.find((q) => q.id === b.dataset.cancel);
          modal(
            `<h2>Cancelar <em>celebración.</em></h2><p>¿Deseas cancelar ${esc(q.id)}? La fecha se liberará. ${q.paid ? "El pago simulado quedará como historial; no se genera devolución real." : ""}</p><button class="button" id="confirmCancel">Sí, cancelar reserva</button>`,
          );
          document.getElementById("confirmCancel").onclick = () => {
            q.status = "Cancelada";
            Demo.save();
            Demo.close();
            renderAccount();
            toast("Reserva cancelada.");
          };
        }),
    );
  }
  window.ClientPortal = { render: renderAccount };
  if (document.getElementById("accountContent")) renderAccount();
})();
