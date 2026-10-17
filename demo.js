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
    const dialog = document.getElementById("modal");
    (dialog?.open ? dialog : document.body).append(el);
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
    const toastElement = document.getElementById("toast");
    if (toastElement) document.body.append(toastElement);
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
      `<p class="eyebrow">COMPROBANTE DE DEMOSTRACIÓN</p><h2>Pago <em>confirmado.</em></h2><div class="success-mark">✓</div><h3>${money(p.amount)}</h3><p>${esc(p.id)} · ${new Date(p.date).toLocaleString("es-CO")}</p><p>${esc(q?.name)} · ${esc(q?.category)}<br>Reserva ${esc(p.quoteId)}<br>${esc(p.method)}</p><p>Saldo actual: <strong>${money(q.total - q.paid)}</strong></p><p class="form-note">SIMULADO · Sin valor fiscal · No se realizó ningún cobro.</p><div class="button-row"><button class="button" id="downloadReceipt">Descargar comprobante</button><a class="button outline" href="cuenta.html">Ver mis reservas ↗</a></div>`,
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
    modal(`
      <p class="eyebrow">PAGO SEGURO · EXPERIENCIA SIMULADA</p>
      <h2>Tu celebración,<br><em>un paso más cerca.</em></h2>
      <div class="checkout-steps"><span class="active">1 · Elige</span><span>2 · Completa</span><span>3 · Confirma</span></div>
      <div class="order-card"><span class="status">${esc(q.id)}</span><h3>${esc(q.category)}</h3><p>${esc(q.date)} · ${esc(q.venue)}</p><div class="summary-line"><span>Total del evento</span><strong>${money(q.total)}</strong></div><div class="summary-line"><span>Pagado</span><strong>${money(q.paid)}</strong></div><div class="summary-line"><span>Saldo pendiente</span><strong>${money(balance)}</strong></div></div>
      <form id="payForm" autocomplete="off">
        <label>¿Cuánto deseas pagar?<select name="amount">${q.paid === 0 ? `<option value="${Math.round(q.total * 0.3)}">Anticipo del 30% · ${money(Math.round(q.total * 0.3))}</option>` : ""}<option value="${balance}">Saldo completo · ${money(balance)}</option></select></label>
        <fieldset class="payment-methods"><legend>Elige tu medio de pago</legend>
          <label class="payment-option"><input type="radio" name="method" value="credit" checked><span><b>▣</b>Tarjeta<small>Crédito o débito</small></span></label>
          <label class="payment-option nequi"><input type="radio" name="method" value="nequi"><span><b>n</b>Nequi<small>Billetera digital</small></span></label>
          <label class="payment-option daviplata"><input type="radio" name="method" value="daviplata"><span><b>D</b>Daviplata<small>Billetera digital</small></span></label>
        </fieldset>
        <div id="paymentFields"></div>
        <label>Resultado a simular<select name="result"><option value="ok">Pago aprobado</option><option value="fail">Pago rechazado</option></select></label>
        <div id="paymentError" class="payment-error" role="alert" hidden></div>
        <div class="checkout-total"><span>Total a pagar ahora</span><strong id="payAmount"></strong></div>
        <label class="payment-consent"><input name="consent" type="checkbox" required><span>Entiendo que es una demostración y usaré únicamente datos ficticios. No se realizará ningún cobro.</span></label>
        <div class="button-row"><button class="button" id="confirmPayment" type="submit">Confirmar pago simulado ↗</button><button class="text-button" type="button" id="cancelPayment">Cancelar</button></div>
        <p class="form-note">Sin conexiones con bancos, Nequi o Daviplata. Los datos de los formularios de pago no se guardan.</p>
      </form>`);
    const payForm = document.getElementById("payForm");
    const fields = document.getElementById("paymentFields");
    const error = document.getElementById("paymentError");
    let requestedPhone = null,
      processing = false;
    const showError = (text) => {
      error.hidden = false;
      error.textContent = text;
      error.scrollIntoView({ block: "nearest" });
    };
    const clearError = () => {
      error.hidden = true;
      error.textContent = "";
    };
    const selectedMethod = () => new FormData(payForm).get("method");
    function renderFields() {
      requestedPhone = null;
      clearError();
      const method = selectedMethod(),
        wallet = method !== "credit";
      fields.innerHTML = wallet
        ? `
        <div class="wallet-banner ${method}"><b>${method === "nequi" ? "n" : "D"}</b><div><h3>${method === "nequi" ? "Paga con Nequi" : "Paga con Daviplata"}</h3><p>Autoriza tu pago con un código de demostración.</p></div></div>
        <label>Número de celular de prueba<input name="walletPhone" inputmode="numeric" pattern="3[0-9]{9}" maxlength="10" placeholder="3001234567" required></label>
        <button type="button" class="text-button" id="useTestData">Usar celular de prueba ↗</button>
        <button type="button" class="button outline" id="requestPaymentCode">Generar código de prueba</button>
        <div id="walletCodeStep" class="wallet-code-step" hidden><p id="walletCodeHint" role="status"></p><label>Código de aprobación<input name="walletCode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="6 dígitos" disabled></label></div>`
        : `
        <div class="test-card"><span>VELVET · TARJETA DE DEMOSTRACIÓN</span><h3>4242 &nbsp; 4242 &nbsp; 4242 &nbsp; 4242</h3><small>SOLO PARA PRUEBAS · SIN COBROS REALES</small></div>
        <button type="button" class="text-button" id="useTestData">Completar con datos de prueba ↗</button>
        <div class="form-grid"><label class="full-width">Nombre del titular<input name="cardHolder" placeholder="Ej. Cliente de prueba" required minlength="3" maxlength="60"></label><label class="full-width">Número de tarjeta ficticia<input name="cardNumber" inputmode="numeric" placeholder="4242 4242 4242 4242" maxlength="23" required pattern="[0-9 ]{16,23}"></label><label>Vencimiento (MM/AA)<input name="cardExpiry" inputmode="numeric" placeholder="12/30" maxlength="5" required pattern="(0[1-9]|1[0-2])/[0-9]{2}"></label><label>CVV de prueba<input name="cardCvv" type="password" inputmode="numeric" placeholder="123" maxlength="3" required pattern="[0-9]{3}"></label><label>Tipo de tarjeta<select name="cardType"><option>Crédito</option><option>Débito</option></select></label><label id="installmentsLabel">Cuotas<select name="installments"><option value="1">1 cuota · sin intereses demo</option><option value="3">3 cuotas · sin intereses demo</option><option value="6">6 cuotas · sin intereses demo</option><option value="12">12 cuotas · sin intereses demo</option></select></label></div>
        <p class="form-note">Usa 4242 4242 4242 4242 o 5555 5555 5555 4444. No ingreses información de una tarjeta real.</p>`;
      document.getElementById("useTestData").onclick = () => {
        if (wallet) payForm.elements.walletPhone.value = "3001234567";
        else {
          payForm.elements.cardHolder.value = "Cliente de prueba";
          payForm.elements.cardNumber.value = "4242 4242 4242 4242";
          payForm.elements.cardExpiry.value = `12/${String(new Date().getFullYear() + 2).slice(-2)}`;
          payForm.elements.cardCvv.value = "123";
        }
        clearError();
      };
      if (wallet) {
        const phone = payForm.elements.walletPhone;
        phone.oninput = () => {
          requestedPhone = null;
          document.getElementById("walletCodeStep").hidden = true;
          payForm.elements.walletCode.disabled = true;
          payForm.elements.walletCode.value = "";
        };
        document.getElementById("requestPaymentCode").onclick = () => {
          if (!phone.reportValidity()) return;
          requestedPhone = phone.value;
          document.getElementById("walletCodeStep").hidden = false;
          document.getElementById("walletCodeHint").textContent =
            "Tu código de prueba es 123456. Escríbelo abajo. No se envió ningún SMS.";
          payForm.elements.walletCode.disabled = false;
          payForm.elements.walletCode.required = true;
          payForm.elements.walletCode.focus();
          clearError();
        };
      } else {
        payForm.elements.cardNumber.oninput = (e) => {
          e.target.value = e.target.value
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();
        };
        payForm.elements.cardExpiry.oninput = (e) => {
          const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
          e.target.value =
            digits.length > 2
              ? digits.slice(0, 2) + "/" + digits.slice(2)
              : digits;
        };
        payForm.elements.cardType.onchange = () => {
          const debit = payForm.elements.cardType.value === "Débito";
          payForm.elements.installments.value = "1";
          payForm.elements.installments.disabled = debit;
          document.getElementById("installmentsLabel").hidden = debit;
        };
      }
    }
    payForm
      .querySelectorAll('[name="method"]')
      .forEach((radio) => (radio.onchange = renderFields));
    const updateAmount = () => {
      document.getElementById("payAmount").textContent = money(
        Number(payForm.elements.amount.value),
      );
    };
    payForm.elements.amount.onchange = updateAmount;
    document.getElementById("cancelPayment").onclick = close;
    payForm.addEventListener("input", clearError);
    payForm.onsubmit = async (e) => {
      e.preventDefault();
      if (processing) return;
      const data = new FormData(payForm),
        method = data.get("method"),
        amount = Number(data.get("amount"));
      if (q.status !== "Reservada")
        return showError("La reserva ya no está activa. Revisa su estado.");
      if (amount <= 0 || amount > q.total - q.paid)
        return showError("El saldo cambió. Abre el pago nuevamente.");
      if (method === "credit") {
        const digits = String(data.get("cardNumber")).replace(/\D/g, "");
        if (!["4242424242424242", "5555555555554444"].includes(digits))
          return showError(
            "Usa una de las tarjetas ficticias indicadas o pulsa Completar con datos de prueba.",
          );
        const [month, year] = String(data.get("cardExpiry"))
            .split("/")
            .map(Number),
          now = new Date();
        if (
          2000 + year < now.getFullYear() ||
          (2000 + year === now.getFullYear() && month < now.getMonth() + 1)
        )
          return showError(
            "La tarjeta de prueba está vencida. Selecciona un vencimiento futuro.",
          );
      } else if (
        requestedPhone !== data.get("walletPhone") ||
        data.get("walletCode") !== "123456"
      ) {
        return showError(
          "Genera el código de prueba y escribe 123456 para autorizar el pago.",
        );
      }
      processing = true;
      clearError();
      const submit = document.getElementById("confirmPayment");
      submit.disabled = true;
      submit.textContent = "Procesando simulación…";
      payForm.setAttribute("aria-busy", "true");
      payForm
        .querySelectorAll("input,select,button:not(#cancelPayment)")
        .forEach((el) => (el.disabled = true));
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!document.getElementById("modal").open || !payForm.isConnected)
        return;
      const unlock = () => {
        processing = false;
        payForm.removeAttribute("aria-busy");
        payForm
          .querySelectorAll("input,select,button")
          .forEach((el) => (el.disabled = false));
        if (method === "credit" && payForm.elements.cardType.value === "Débito")
          payForm.elements.installments.disabled = true;
        submit.textContent = "Reintentar pago simulado ↗";
      };
      if (data.get("result") === "fail") {
        unlock();
        return showError(
          "Pago simulado rechazado. No se descontó dinero ni se modificó tu saldo. Selecciona Pago aprobado e inténtalo de nuevo.",
        );
      }
      if (q.status !== "Reservada" || amount > q.total - q.paid) {
        unlock();
        return showError(
          "La reserva o el saldo cambió. Cierra esta ventana y revisa tu reserva.",
        );
      }
      const label =
        method === "credit"
          ? `${data.get("cardType")} · tarjeta de prueba${data.get("cardType") === "Crédito" ? ` · ${data.get("installments")} cuota(s)` : ""}`
          : `${method === "nequi" ? "Nequi" : "Daviplata"} · billetera de prueba`;
      const payment = {
        id: id("REC"),
        quoteId: q.id,
        amount,
        date: new Date().toISOString(),
        method: label,
      };
      q.paid += amount;
      state.payments.push(payment);
      if (!save()) {
        q.paid -= amount;
        state.payments.pop();
        unlock();
        return showError(
          "No pudimos guardar el comprobante. Libera espacio local y vuelve a intentarlo.",
        );
      }
      onDone?.();
      receipt(payment);
    };
    renderFields();
    updateAmount();
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
    document.getElementById("modal")?.addEventListener("close", () => {
      const t = document.getElementById("toast");
      if (t) document.body.append(t);
    });
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
