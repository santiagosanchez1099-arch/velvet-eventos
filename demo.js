/* Velvet Studio · shared local demonstration state */
const Demo = (() => {
  const key = "velvet-demo-v1";
  const categories = [
    [
      "Cumpleaños de niño",
      "Infantiles",
      "cumpleaños niño.png",
      "Aventura, dinosaurios y universo",
    ],
    [
      "Cumpleaños de niña",
      "Infantiles",
      "imagen7.png",
      "Princesas, arcoíris y jardín mágico",
    ],
    [
      "Cumpleaños de adultos",
      "Sociales",
      "imagen5.png",
      "Glam, tropical y fiesta retro",
    ],
    [
      "Grados de niño",
      "Infantiles",
      "graduacion.png",
      "Pequeños grandes logros",
    ],
    [
      "Grados de niña",
      "Infantiles",
      "imagen8.png",
      "Estrellas y sueños de colores",
    ],
    [
      "Graduación de bachillerato",
      "Grados",
      "graduacion.png",
      "Una nueva etapa con estilo",
    ],
    [
      "Graduación universitaria",
      "Grados",
      "imagen9.png",
      "Logros que merecen brillar",
    ],
    [
      "Bodas",
      "Romance",
      "boda campestre.png",
      "Campestre, boho y romance clásico",
    ],
    [
      "Quinceañeras",
      "Sociales",
      "quince.png",
      "Un cuento propio, una noche única",
    ],
    [
      "Revelación de sexo · niño",
      "Familia",
      "imagen2.png",
      "Nubes, ositos y dulces sorpresas",
    ],
    [
      "Revelación de sexo · niña",
      "Familia",
      "imagen11.png",
      "Sueños de rosa y melocotón",
    ],
    ["Baby showers", "Familia", "imagen4.png", "La bienvenida más especial"],
    ["Bautizos", "Familia", "imagen12.png", "Flores blancas y detalles de luz"],
    [
      "Primeras comuniones",
      "Familia",
      "imagen3.png",
      "Un día de unión y gratitud",
    ],
    [
      "Aniversarios",
      "Romance",
      "imagen13.png",
      "Historias que siguen floreciendo",
    ],
    [
      "Pedidas de mano",
      "Romance",
      "imagen5.png",
      "El escenario para un gran sí",
    ],
    [
      "Cenas románticas",
      "Romance",
      "boda campestre.png",
      "Íntimo, cálido y lleno de detalles",
    ],
    [
      "Eventos empresariales",
      "Empresariales",
      "empresarial.png",
      "Lanzamientos, encuentros y conexiones",
    ],
    [
      "Celebraciones especiales",
      "Sociales",
      "imagen1.png",
      "Una experiencia fuera de lo común",
    ],
  ].map((c, i) => ({
    id: i,
    name: c[0],
    group: c[1],
    image: c[2],
    themes: c[3],
  }));
  const initial = () => ({
    version: 1,
    theme: "light",
    session: null,
    users: [{ id: "demo", name: "Laura Gómez", email: "laura@demo.local" }],
    packages: [
      {
        id: "basico",
        name: "Esencial",
        label: "Básico",
        price: 1800000,
        description: "La belleza de lo sencillo.",
        features: [
          "Decoración base",
          "Montaje y mobiliario",
          "Coordinación por 4 horas",
        ],
      },
      {
        id: "especial",
        name: "Especial",
        label: "Especial",
        price: 3200000,
        description: "Un toque más de magia.",
        features: [
          "Todo lo del Esencial",
          "Arco y flores de temporada",
          "Mesa principal y sonido",
        ],
      },
      {
        id: "premium",
        name: "Signature",
        label: "Premium",
        price: 5800000,
        description: "Una experiencia extraordinaria.",
        features: [
          "Todo lo del Especial",
          "Diseño floral premium",
          "Iluminación y coordinación por 8 horas",
        ],
      },
      {
        id: "personalizado",
        name: "A tu manera",
        label: "Personalizado",
        price: 2500000,
        description: "Tu imaginación es el punto de partida.",
        features: [
          "Concepto y diseño a medida",
          "Decoración base flexible",
          "Asesoría de planificación",
        ],
      },
    ],
    promotion: { code: "VELVET10", discount: 10, active: true },
    extras: [
      { name: "Invitaciones digitales", price: 150000 },
      { name: "Fotografía", price: 650000 },
      { name: "Catering", price: 900000 },
      { name: "Música y DJ", price: 550000 },
      { name: "Sorpresas y regalos", price: 250000 },
    ],
    quotes: [
      {
        id: "VEL-1001",
        email: "laura@demo.local",
        name: "Laura Gómez",
        category: "Bodas",
        package: "Signature",
        theme: "Boho natural",
        colors: "Verde salvia y blanco",
        decoration: "Flores y velas",
        guests: 50,
        date: future(15),
        venue: "Hacienda del Sol · Chía",
        extras: ["Fotografía"],
        total: 7250000,
        status: "Reservada",
        paid: 2175000,
        phone: "300 000 0000",
        notes: "Ceremonia al aire libre",
      },
    ],
    payments: [
      {
        id: "REC-1001",
        quoteId: "VEL-1001",
        amount: 2175000,
        date: new Date().toISOString(),
        method: "Crédito · tarjeta de prueba",
      },
    ],
    messages: [
      {
        id: "MSG-1001",
        name: "Laura Gómez",
        email: "laura@demo.local",
        message: "¡Hola! ¿Podemos coordinar la decoración de la boda?",
        read: false,
        replies: [],
      },
    ],
    photos: [
      {
        id: "p1",
        src: "imagen1.png",
        category: "Quinceañeras",
        title: "Una noche para brillar",
      },
      {
        id: "p2",
        src: "boda campestre.png",
        category: "Bodas",
        title: "Romance entre jardines",
      },
      {
        id: "p3",
        src: "cumpleaños niño.png",
        category: "Infantiles",
        title: "La aventura comienza",
      },
      {
        id: "p4",
        src: "empresarial.png",
        category: "Empresariales",
        title: "Conexiones memorables",
      },
      {
        id: "p5",
        src: "graduacion.png",
        category: "Grados",
        title: "El inicio de algo grande",
      },
      {
        id: "p6",
        src: "imagen4.png",
        category: "Familia",
        title: "Dulce bienvenida",
      },
      {
        id: "v1",
        src: "assets/eventos.mp4",
        category: "Videos",
        title: "Luces, flores y celebración",
        video: true,
      },
    ],
  });
  function future(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }
  function dateKey(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  let state;
  try {
    state = JSON.parse(localStorage.getItem(key)) || initial();
  } catch {
    state = initial();
  }
  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      toast(
        "No hay espacio para guardar. Elimina fotos grandes e inténtalo de nuevo.",
      );
      return false;
    }
    return true;
  }
  function money(n) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  }
  function esc(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function id(prefix) {
    return (
      prefix +
      "-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 5).toUpperCase()
    );
  }
  function toast(t) {
    let el = document.getElementById("toast");
    el.textContent = t;
    el.classList.add("visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("visible"), 4500);
  }
  function modal(html) {
    document.getElementById("modalBody").innerHTML = html;
    document.getElementById("modal").showModal();
  }
  function close() {
    document.getElementById("modal").close();
  }
  function occupied(date, venue, exclude) {
    return state.quotes.some(
      (q) =>
        q.id !== exclude &&
        q.date === date &&
        q.venue === venue &&
        q.status === "Reservada",
    );
  }
  function calendar(el, month, onSelect, venue) {
    const d = new Date(month.getFullYear(), month.getMonth(), 1),
      days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    el.innerHTML = `<div class="calendar-head"><button type="button" data-dir="-1" aria-label="Mes anterior">←</button><strong>${d.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}</strong><button type="button" data-dir="1" aria-label="Mes siguiente">→</button></div><div class="calendar-grid">${["L", "M", "M", "J", "V", "S", "D"].map((x) => `<small>${x}</small>`).join("")}${"<span></span>".repeat((d.getDay() + 6) % 7)}${Array.from(
      { length: days },
      (_, i) => {
        const date = dateKey(new Date(d.getFullYear(), d.getMonth(), i + 1)),
          busy = venue
            ? occupied(date, venue)
            : state.quotes.some(
                (q) => q.date === date && q.status === "Reservada",
              );
        return `<button type="button" class="${busy ? "busy" : ""}" data-date="${date}" ${date < future(0) ? "disabled" : ""} title="${busy ? "Reserva existente" : "Disponible"}">${i + 1}</button>`;
      },
    ).join(
      "",
    )}</div><small>● Ciruela: fecha con reserva${venue ? " en este lugar" : ""}</small>`;
    el.querySelectorAll("[data-dir]").forEach(
      (b) =>
        (b.onclick = () => {
          month.setMonth(month.getMonth() + Number(b.dataset.dir));
          calendar(el, month, onSelect, venue);
        }),
    );
    el.querySelectorAll("[data-date]").forEach(
      (b) =>
        (b.onclick = () => {
          el.querySelectorAll("[data-date]").forEach((x) =>
            x.classList.remove("selected"),
          );
          b.classList.add("selected");
          onSelect(b.dataset.date);
        }),
    );
  }
  function receipt(p) {
    const q = state.quotes.find((q) => q.id === p.quoteId);
    modal(
      `<p class="eyebrow">COMPROBANTE DE DEMOSTRACIÓN</p><h2>Pago <em>confirmado.</em></h2><div class="success-mark">✓</div><h3>${money(p.amount)}</h3><p>${esc(p.id)} · ${new Date(p.date).toLocaleString("es-CO")}</p><p>${esc(q?.name)} · ${esc(q?.category)}<br>Reserva ${esc(p.quoteId)}<br>${esc(p.method)}</p><p>Saldo actual: <strong>${money(q.total - q.paid)}</strong></p><p class="form-note">SIMULADO · Sin valor fiscal · No se realizó ningún cobro.</p><button class="button" id="downloadReceipt">Descargar comprobante</button>`,
    );
    document.getElementById("downloadReceipt").onclick = () => {
      const blob = new Blob(
        [
          `VELVET STUDIO — COMPROBANTE SIMULADO\n${p.id}\nReserva: ${p.quoteId}\nCliente: ${q.name}\nFecha: ${new Date(p.date).toLocaleString("es-CO")}\nMonto: ${money(p.amount)}\nMétodo: ${p.method}\nSaldo: ${money(q.total - q.paid)}\nSin transacción real ni valor fiscal.`,
        ],
        { type: "text/plain;charset=utf-8" },
      );
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = p.id + ".txt";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
  }
  function pay(q, onDone) {
    if (q.status !== "Reservada")
      return toast("Primero confirma la reserva en tu cuenta.");
    if (q.paid >= q.total) return toast("Esta reserva ya está pagada.");
    const balance = q.total - q.paid;
    modal(
      `<p class="eyebrow">CHECKOUT DE DEMOSTRACIÓN</p><h2>Un paso <em>más cerca.</em></h2><div class="order-card"><h3>${esc(q.category)}</h3><p>${esc(q.date)} · ${esc(q.venue)}</p><div class="summary-line"><span>Total</span><strong>${money(q.total)}</strong></div><div class="summary-line"><span>Pagado</span><strong>${money(q.paid)}</strong></div><div class="summary-line"><span>Saldo</span><strong>${money(balance)}</strong></div></div><form id="payForm"><label>Importe<select name="amount">${q.paid === 0 ? `<option value="${Math.round(q.total * 0.3)}">Anticipo del 30% · ${money(Math.round(q.total * 0.3))}</option>` : ""}<option value="${balance}">Pagar saldo completo · ${money(balance)}</option></select></label><label>Medio de pago<select name="method"><option>Crédito · tarjeta de prueba</option><option>Débito · tarjeta de prueba</option></select></label><div class="test-card"><span>VELVET DEMO CARD</span><h3>4242 &nbsp; 4242 &nbsp; 4242 &nbsp; 4242</h3><small>TARJETA DE PRUEBA · 12/30</small></div><p class="form-note">No ingreses datos bancarios. Esta tarjeta ficticia se usa para todos los pagos.</p><label>Resultado a simular<select name="result"><option value="ok">Pago aprobado</option><option value="fail">Pago rechazado</option></select></label><button class="button">Simular pago</button></form>`,
    );
    document.getElementById("payForm").onsubmit = (e) => {
      e.preventDefault();
      const f = new FormData(e.target);
      if (f.get("result") === "fail")
        return toast(
          "Pago de prueba rechazado. Intenta de nuevo con resultado aprobado.",
        );
      const amount = Number(f.get("amount"));
      if (amount <= 0 || amount > q.total - q.paid)
        return toast("El saldo cambió. Abre el pago nuevamente.");
      q.paid += amount;
      const p = {
        id: id("REC"),
        quoteId: q.id,
        amount,
        date: new Date().toISOString(),
        method: f.get("method"),
      };
      state.payments.push(p);
      save();
      onDone?.();
      receipt(p);
    };
  }
  function init() {
    document.documentElement.dataset.theme = state.theme;
    document.querySelectorAll(".theme-toggle").forEach(
      (b) =>
        (b.onclick = () => {
          state.theme = state.theme === "light" ? "dark" : "light";
          document.documentElement.dataset.theme = state.theme;
          save();
        }),
    );
    document.querySelector(".modal-close")?.addEventListener("click", close);
    document.getElementById("modal")?.addEventListener("click", (e) => {
      if (e.target.id === "modal") close();
    });
    document.querySelector(".mobile-toggle")?.addEventListener("click", (e) => {
      const open = document
        .getElementById("navigation")
        .classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll("#navigation a").forEach(
      (a) =>
        (a.onclick = () => {
          document.getElementById("navigation").classList.remove("open");
          document
            .querySelector(".mobile-toggle")
            ?.setAttribute("aria-expanded", "false");
        }),
    );
    document.querySelectorAll("[data-chat]").forEach((b) => (b.onclick = chat));
    document
      .querySelectorAll("[data-social]")
      .forEach(
        (b) =>
          (b.onclick = () =>
            modal(
              `<p class="eyebrow">RED SOCIAL · DEMOSTRACIÓN</p><h2>${esc(b.dataset.social)}</h2><p>Así se abriría nuestro perfil de Velvet Studio. Esta experiencia mantiene toda la navegación dentro del prototipo.</p><button class="button" onclick="Demo.close()">Volver</button>`,
            )),
      );
  }
  function chat() {
    modal(
      `<p class="eyebrow">WHATSAPP · CONVERSACIÓN SIMULADA</p><h2>Hola, <em>celebremos.</em></h2><div class="chat-log" id="chatLog"><p class="bubble">¡Hola! Soy la asistente de Velvet. Te puedo orientar sobre paquetes, fechas y servicios. ¿Qué te gustaría celebrar?</p></div><div class="button-row"><button class="chip" data-suggestion="Quiero conocer los paquetes">Paquetes</button><button class="chip" data-suggestion="Consultar fechas">Fechas</button></div><form id="chatForm"><label>Tu mensaje<input name="message" required maxlength="400" autocomplete="off"></label><button class="button">Enviar</button></form><p class="form-note">Respuestas predefinidas locales. Sin WhatsApp ni IA externos.</p>`,
    );
    const respond = (text) => {
      const log = document.getElementById("chatLog");
      const answer = /fecha|reserva/i.test(text)
        ? "Elige tu fecha y lugar en Diseña tu evento. Allí puedes consultar disponibilidad y solicitar tu reserva."
        : /precio|paquete|costo/i.test(text)
          ? `Tenemos paquetes desde ${money(state.packages[0].price)}. Puedes añadir servicios y usar ${state.promotion.code} si la promoción está activa.`
          : "¡Qué buena idea! En Diseña tu evento puedes elegir la celebración, colores, invitados y servicios. Guarda una cotización y revísala en Mi cuenta.";
      log.insertAdjacentHTML(
        "beforeend",
        `<p class="bubble user">${esc(text)}</p><p class="bubble">${esc(answer)}</p>`,
      );
      log.scrollTop = log.scrollHeight;
    };
    document.getElementById("chatForm").onsubmit = (e) => {
      e.preventDefault();
      respond(e.target.message.value);
      e.target.reset();
    };
    document
      .querySelectorAll("[data-suggestion]")
      .forEach((b) => (b.onclick = () => respond(b.dataset.suggestion)));
  }
  document.addEventListener("DOMContentLoaded", init);
  return {
    state,
    categories,
    save,
    money,
    esc,
    id,
    toast,
    modal,
    close,
    calendar,
    occupied,
    pay,
    receipt,
    future,
    dateKey,
  };
})();
