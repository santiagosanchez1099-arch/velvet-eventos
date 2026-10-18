/* Velvet IA demo: offline intent matching, contextual advice and real UI actions. */
(() => {
  "use strict";
  const launcher = document.querySelector("[data-assistant]");
  if (!launcher) return;
  const { state, money } = Demo,
    key = "velvet-assistant-v2";
  const initialContext = () => ({
    category: null,
    guests: null,
    budget: null,
    packageId: null,
    date: null,
    venue: null,
    lastIntent: null,
  });
  let context = initialContext(),
    history = [],
    timer = null,
    busy = false;
  try {
    const stored = JSON.parse(sessionStorage.getItem(key));
    if (stored && Array.isArray(stored.messages)) {
      history = stored.messages
        .filter(
          (m) => ["user", "bot"].includes(m.role) && typeof m.text === "string",
        )
        .slice(-30);
      context = { ...context, ...stored.context };
    }
  } catch {}
  const panel = document.createElement("aside");
  panel.id = "assistantPanel";
  panel.className = "assistant-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "assistantTitle");
  panel.innerHTML = `<header class="assistant-heading"><img src="ia.png" alt=""><div><h2 id="assistantTitle">Velvet IA</h2><p>Tu cómplice para celebrar</p></div><div class="assistant-controls"><button type="button" id="assistantReset" aria-label="Nueva conversación" title="Nueva conversación">↺</button><button type="button" id="assistantClose" aria-label="Cerrar asistente">×</button></div></header><p class="assistant-disclaimer">Asistente de demostración · Respuestas locales sobre esta web, sin IA externa.</p><div class="assistant-log" id="assistantLog" role="log" aria-live="polite" aria-label="Conversación con Velvet IA" tabindex="0"></div><div class="assistant-suggestions" aria-label="Preguntas sugeridas"><button type="button" data-ask="¿Qué paquetes y precios tienen?">Paquetes y precios</button><button type="button" data-ask="Quiero organizar una boda">Organizar mi evento</button><button type="button" data-ask="¿Cómo pago con Nequi o tarjeta?">Cómo pagar</button><button type="button" data-ask="Quiero consultar una fecha disponible">Fechas</button></div><form id="assistantForm" class="assistant-compose"><input id="assistantInput" name="question" required maxlength="500" autocomplete="off" aria-label="Pregunta a Velvet IA" placeholder="Cuéntame qué quieres celebrar…"><button type="submit" aria-label="Enviar pregunta">↑</button></form>`;
  document.body.append(panel);
  const log = document.getElementById("assistantLog"),
    form = document.getElementById("assistantForm"),
    input = document.getElementById("assistantInput");
  function persist() {
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({ context, messages: history.slice(-30) }),
      );
    } catch {}
  }
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  function scroll() {
    log.scrollTop = log.scrollHeight;
  }
  function draw(message) {
    const row = document.createElement("div");
    row.className =
      "assistant-message " + (message.role === "user" ? "user" : "bot");
    if (message.role === "bot") {
      const mark = document.createElement("span");
      mark.textContent = "✦";
      mark.setAttribute("aria-hidden", "true");
      row.append(mark);
    }
    const bubble = document.createElement("div");
    bubble.className = "assistant-bubble";
    const paragraph = document.createElement("p");
    paragraph.textContent = message.text;
    bubble.append(paragraph);
    if (message.role === "bot" && Array.isArray(message.actions)) {
      const actions = document.createElement("div");
      actions.className = "assistant-actions";
      message.actions.slice(0, 4).forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action.label;
        button.onclick = () => perform(action);
        actions.append(button);
      });
      bubble.append(actions);
    }
    row.append(bubble);
    log.append(row);
    scroll();
  }
  function add(role, text, actions = []) {
    const message = { role, text, actions };
    history.push(message);
    if (history.length > 30) {
      history.shift();
      log.firstElementChild?.remove();
    }
    draw(message);
    persist();
  }
  function welcome() {
    add(
      "bot",
      "¡Hola! Soy Velvet IA. ✦ Te ayudo a encontrar un plan, calcular un presupuesto orientativo y preparar tu celebración.\n\nCuéntame qué evento imaginas y para cuántas personas. Por ejemplo: “Una boda para 60 invitados”.",
      [
        { label: "Ver los paquetes", ask: "¿Qué paquetes y precios tienen?" },
        {
          label: "Tengo un presupuesto",
          ask: "Quiero elegir un plan según mi presupuesto",
        },
      ],
    );
  }
  function setBusy(value) {
    busy = value;
    form.querySelector("button").disabled = value;
    panel.querySelectorAll("[data-ask]").forEach((b) => (b.disabled = value));
    form.setAttribute("aria-busy", String(value));
  }
  function open() {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    input.focus({ preventScroll: true });
    scroll();
  }
  function close() {
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus({ preventScroll: true });
  }
  function personalize() {
    const detail = { ...context };
    close();
    window.dispatchEvent(new CustomEvent("velvet:personalize", { detail }));
  }
  function perform(action) {
    if (action.ask) return send(action.ask);
    if (action.plan) {
      context.packageId = action.plan;
      persist();
      return personalize();
    }
    if (action.type === "personalize") return personalize();
    if (action.type === "account") {
      close();
      if (window.Sections) Sections.open("cliente");
      else location.href = "cuenta.html";
      return;
    }
    if (action.type === "gallery") {
      close();
      if (window.Sections) return Sections.open("galeria");
      document.getElementById("galeria").scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
      return;
    }
    if (action.type === "theme") {
      state.theme = action.theme;
      document.documentElement.dataset.theme = state.theme;
      Demo.save();
      add(
        "bot",
        `Listo, activé el tema ${action.theme === "dark" ? "oscuro" : "claro"}.`,
      );
      return;
    }
    if (action.type === "contact") {
      close();
      if (window.Sections) return Sections.open("contacto");
      document
        .getElementById("contacto")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
  function extractContext(text) {
    const t = normalize(text);
    const count =
      t.match(/(?:para\s+)?(\d{1,4})\s*(?:invitados|personas|asistentes)/) ||
      (context.lastIntent === "guests" ? t.match(/^\s*(\d{1,4})\s*$/) : null);
    if (count) {
      const n = Number(count[1]);
      if (n >= 10 && n <= 1000) context.guests = n;
    }
    const moneyMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(millones|millon|mil)\b/);
    if (moneyMatch)
      context.budget = Math.round(
        Number(moneyMatch[1].replace(",", ".")) *
          (moneyMatch[2] === "mil" ? 1000 : 1000000),
      );
    else if (
      /presupuesto|tengo|cuento con/.test(t) ||
      context.lastIntent === "budget"
    ) {
      const number = t.match(/(?:\$\s*)?(\d[\d.,]{4,})/);
      if (number) context.budget = Number(number[1].replace(/[.,]/g, ""));
    }
    const events = [
      [/pedida|propuesta de matrimonio/, 15],
      [/boda|matrimonio|casamiento/, 7],
      [/quince|15 anos/, 8],
      [/cumple.*adult|adult.*cumple/, 2],
      [/cumple.*nina|nina.*cumple/, 1],
      [/cumple.*nino|nino.*cumple/, 0],
      [/grado.*nina/, 4],
      [/grado.*nino/, 3],
      [/universidad|universitaria/, 6],
      [/bachiller/, 5],
      [/revelacion.*nina/, 10],
      [/revelacion/, 9],
      [/baby|babyshower/, 11],
      [/bautizo/, 12],
      [/comunion/, 13],
      [/aniversario/, 14],
      [/pedida|propuesta de matrimonio/, 15],
      [/cena romantica/, 16],
      [/empresa|corporativ/, 17],
      [/celebracion especial/, 18],
    ];
    const category = events.find(([pattern]) => pattern.test(t));
    if (category) context.category = Demo.categories[category[1]].name;
    const plans = [
      [/premium|signature/, "premium"],
      [/especial/, "especial"],
      [/basico|esencial/, "basico"],
      [/a tu manera|plan personalizado/, "personalizado"],
    ];
    const selected = plans.find(([pattern]) => pattern.test(t));
    if (selected) context.packageId = selected[1];
    if (/hacienda/.test(t)) context.venue = "Hacienda del Sol · Chía";
    else if (/imperial/.test(t)) context.venue = "Salón Imperial · Bogotá";
    else if (/jardin/.test(t)) context.venue = "Jardín Velvet · Bogotá";
    else if (/mi ubicacion|mi casa/.test(t)) context.venue = "En mi ubicación";
    let date = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (!date) {
      const local = t.match(/\b(\d{2})\/(\d{2})\/(\d{4})\b/);
      if (local) date = [local[0], local[3], local[2], local[1]];
    }
    if (date) {
      const candidate = `${date[1]}-${date[2]}-${date[3]}`,
        d = new Date(candidate + "T12:00:00");
      if (!Number.isNaN(d.getTime()) && Demo.dateKey(d) === candidate)
        context.date = candidate;
      else context.date = null;
    }
    return { count, moneyMatch, category, selected, date };
  }
  function response(text) {
    const t = normalize(text),
      previous = context.lastIntent,
      found = extractContext(text);
    if (
      found.count &&
      (Number(found.count[1]) < 10 || Number(found.count[1]) > 1000)
    )
      return {
        text: "El personalizador de esta demo admite entre 10 y 1000 invitados. Dime una cantidad dentro de ese rango para calcular el estimado.",
        actions: [],
      };
    if (found.date && !context.date)
      return {
        text: "Esa fecha no es válida. Escríbela como AAAA-MM-DD o DD/MM/AAAA; por ejemplo 2027-06-20.",
        actions: [],
      };
    const personalizeAction = {
      label: "Llevar mi idea al personalizador",
      type: "personalize",
    };
    if (
      /nequi|daviplata|tarjeta|pago|pagar|anticipo|saldo|comprobante|cuotas/.test(
        t,
      )
    ) {
      context.lastIntent = "payments";
      return {
        text: "Puedes simular pagos con Nequi, Daviplata o tarjeta de crédito/débito.\n\n• Reserva tu evento y elige “Simular pago ahora”, o abre una reserva en Mi cuenta.\n• Puedes pagar el 30% de anticipo o el saldo completo.\n• En tarjeta, pulsa “Completar con datos de prueba”.\n• En Nequi y Daviplata, genera el código y escribe 123456.\n\nDespués obtendrás un comprobante descargable. Todo es ficticio: no se cobra dinero.",
        actions: [
          { label: "Ir a mis reservas", type: "account" },
          personalizeAction,
        ],
      };
    }
    if (/descuento|promocion|codigo|cupon/.test(t)) {
      context.lastIntent = "promotion";
      return {
        text: state.promotion.active
          ? `La promoción activa es ${state.promotion.code}: ${state.promotion.discount}% de descuento en nuevas cotizaciones. Escríbela en “Código de promoción” al personalizar tu evento. Los precios guardados anteriormente se conservan.`
          : "En este momento no hay una promoción activa. Puedes personalizar tu evento para conocer el estimado actual.",
        actions: [personalizeAction],
      };
    }
    if (
      /fecha|disponib|calendario|reservar|reserva/.test(t) ||
      found.date ||
      (previous === "availability" &&
        /hacienda|imperial|jardin|mi ubicacion/.test(t))
    ) {
      context.lastIntent = "availability";
      if (context.date && context.date < Demo.future(0))
        return {
          text: "Esa fecha ya pasó. Indícame una fecha futura en formato AAAA-MM-DD, por ejemplo 2027-06-20, y el lugar: Jardín Velvet, Salón Imperial o Hacienda del Sol.",
          actions: [personalizeAction],
        };
      if (context.date && context.venue) {
        const occupied = Demo.occupied(context.date, context.venue);
        return {
          text: `Para el ${context.date}, ${context.venue} ${occupied ? "ya tiene una reserva activa. Puedes probar otra fecha o lugar." : "está disponible en el calendario de esta demostración."}\n\nEsto es una consulta: la fecha solo se reserva al completar la solicitud.`,
          actions: [
            personalizeAction,
            { label: "Consultar mis reservas", type: "account" },
          ],
        };
      }
      return {
        text: `La disponibilidad depende de la fecha y del lugar.${context.date ? " Ya tengo la fecha " + context.date + "." : ""}\n\nIndícame ${context.date ? "el lugar" : "una fecha en formato AAAA-MM-DD y el lugar"}, por ejemplo: “2027-06-20 en Jardín Velvet”. También puedes usar el calendario del personalizador.`,
        actions: [personalizeAction],
      };
    }
    if (
      /ubicacion|cobertura|direccion|donde|chia|cajica|calera/.test(t) &&
      !found.date
    ) {
      context.lastIntent = "coverage";
      return {
        text: "La cobertura ilustrativa es Bogotá, Chía, Cajicá y La Calera. La ubicación de referencia del estudio es Chapinero, Bogotá.\n\nEn la demo puedes elegir Jardín Velvet, Salón Imperial, Hacienda del Sol o “En mi ubicación” e indicar una dirección.",
        actions: [
          { label: "Ver contacto y cobertura", type: "contact" },
          personalizeAction,
        ],
      };
    }
    if (
      /fotograf|catering|musica|dj|invitacion|regalo|sorpresa|servicios?|extras/.test(
        t,
      )
    ) {
      context.lastIntent = "extras";
      return {
        text:
          "Puedes completar tu celebración con estos servicios de demostración:\n\n" +
          state.extras.map((x) => `• ${x.name}: ${money(x.price)}`).join("\n") +
          "\n\nLas invitaciones digitales tienen un diseñador con vista previa. Puedes añadir estos servicios en el personalizador.",
        actions: [
          personalizeAction,
          { label: "Ver inspiración", type: "gallery" },
        ],
      };
    }
    if (/oscuro|claro|tema diurno|tema nocturno/.test(t))
      return {
        text: "Puedes cambiar el tema desde el botón ◐ de la parte superior. Si quieres, lo activo por ti.",
        actions: [
          { label: "Activar tema oscuro", type: "theme", theme: "dark" },
          { label: "Activar tema claro", type: "theme", theme: "light" },
        ],
      };
    if (/cuenta|registr|iniciar sesion|contrasena/.test(t))
      return {
        text: "En Mi cuenta puedes crear un perfil de prueba o entrar con el correo utilizado en tu cotización. El acceso es simulado y no pide contraseña.\n\nPara explorar un ejemplo puedes usar laura@demo.local. Allí aparecen cotizaciones, reservas, pagos y respuestas a tus mensajes.",
        actions: [{ label: "Abrir Mi cuenta", type: "account" }],
      };
    if (/contact|whatsapp|hablar|telefono|horario|atienden|atencion/.test(t))
      return {
        text: "Puedes dejar un mensaje en Contacto o abrir la conversación simulada de WhatsApp desde la portada. En esta demo los mensajes se guardan localmente y el administrador puede responderlos desde su panel.\n\nEl horario ilustrativo es de lunes a sábado, 9 a. m. a 6 p. m.",
        actions: [{ label: "Ir al formulario de contacto", type: "contact" }],
      };
    if (
      /tematica|colores|decoracion|inspiracion|galeria/.test(t) &&
      !found.category
    )
      return {
        text: "Puedes elegir jardín encantado, elegancia clásica, boho natural, universo de colores o una idea propia. Combina paletas como crema/rosa/dorado, lavanda/plata o verde salvia/blanco.\n\nTambién puedes cambiar entre flores y velas, globos y fondos temáticos, montaje natural o escenario contemporáneo.",
        actions: [
          { label: "Explorar la galería", type: "gallery" },
          personalizeAction,
        ],
      };
    if (
      /que (?:tipos de )?eventos|tipos de (?:eventos|celebraciones)|que celebraciones|eventos organizan|que organizan/.test(
        t,
      )
    )
      return {
        text: "Organizamos cumpleaños de niños, niñas y adultos; grados infantiles, de bachillerato y universidad; bodas, quinceañeras, revelaciones, baby showers, bautizos, comuniones, aniversarios, pedidas de mano, cenas románticas, eventos empresariales y celebraciones especiales.\n\nCada categoría tiene inspiración y opciones para personalizar. ¿Cuál imaginas?",
        actions: [
          { label: "Quiero una boda", ask: "Quiero organizar una boda" },
          { label: "Un cumpleaños", ask: "Quiero organizar un cumpleaños" },
          personalizeAction,
        ],
      };
    if (/cumpleanos/.test(t) && !found.category)
      return {
        text: "¡Celebremos ese cumpleaños! Tenemos opciones para niños, niñas y adultos. Cuéntame cuál de estas celebraciones buscas y cuántas personas asistirían.",
        actions: [
          { label: "De niño", ask: "Cumpleaños de niño" },
          { label: "De niña", ask: "Cumpleaños de niña" },
          { label: "De adultos", ask: "Cumpleaños de adultos" },
        ],
      };
    if (/presupuesto/.test(t) && !context.budget) {
      context.lastIntent = "budget";
      return {
        text: "Cuéntame tu presupuesto aproximado en COP y cuántas personas asistirían. Por ejemplo: “Tengo 5 millones para 60 invitados”.\n\nTe indicaré qué base encaja y llevaré los datos al personalizador. Los servicios adicionales se cotizan aparte.",
        actions: [
          {
            label: "Ver precios de los paquetes",
            ask: "¿Qué paquetes y precios tienen?",
          },
        ],
      };
    }
    if (/incluye|detalle del plan/.test(t) && context.packageId) {
      const plan = state.packages.find((p) => p.id === context.packageId);
      if (plan)
        return {
          text:
            plan.name +
            " parte de " +
            money(plan.price) +
            " para 30 invitados e incluye:\n\n" +
            plan.features.map((f) => "• " + f).join("\n") +
            "\n\nPuedes añadir servicios o invitados en el personalizador.",
          actions: [{ label: "Elegir " + plan.name, plan: plan.id }],
        };
    }
    if (
      found.category ||
      found.count ||
      found.moneyMatch ||
      (previous === "budget" && context.budget) ||
      found.selected
    ) {
      const guests = context.guests || 30,
        extra = Math.max(0, guests - 30) * 35000;
      let plan = state.packages.find((p) => p.id === context.packageId);
      if (context.budget && !found.selected) {
        const fits = state.packages
          .filter(
            (p) =>
              p.id !== "personalizado" && p.price + extra <= context.budget,
          )
          .sort((a, b) => b.price - a.price);
        plan =
          fits[0] ||
          state.packages.slice().sort((a, b) => a.price - b.price)[0];
      }
      plan =
        plan ||
        state.packages.find((p) => p.id === "especial") ||
        state.packages[0];
      context.packageId = plan.id;
      context.lastIntent = context.guests ? "planning" : "guests";
      const total = plan.price + extra,
        over = context.budget && total > context.budget;
      return {
        text: `${context.category ? "¡" + context.category + "!" : "¡Vamos a darle forma a tu evento!"} ${context.guests ? "Para " + guests + " invitados" : "Si empezamos con una base de 30 invitados"}, el plan ${plan.name} tiene un estimado de ${money(total)}.\n\nBase del paquete: ${money(plan.price)}.\nInvitados extra: ${money(extra)} ($35.000 por persona a partir de 30).\n${context.budget ? `Presupuesto indicado: ${money(context.budget)}. ${over ? "La base supera ese presupuesto; puedes ajustar opciones en el personalizador." : "La base está dentro de tu presupuesto."}\n` : ""}\nEste cálculo no incluye extras ni descuentos. ${context.guests ? "Puedes llevar esta idea al formulario y seguir eligiendo." : "¿Cuántas personas asistirían?"}`,
        actions: [
          personalizeAction,
          {
            label: "Qué incluye " + plan.name,
            ask: "¿Qué incluye el plan " + plan.name + "?",
          },
        ],
      };
    }
    if (/paquete|precio|costo|cuesta|planes|incluye|economico/.test(t)) {
      context.lastIntent = "packages";
      return {
        text:
          "Estos son los paquetes actuales, con base para 30 invitados:\n\n" +
          state.packages
            .map(
              (p) =>
                `• ${p.name} (${p.label}): ${money(p.price)}. ${p.features.join(", ")}.`,
            )
            .join("\n\n") +
          "\n\nCada invitado adicional suma $35.000. ¿Qué vas a celebrar y cuántos invitados imaginas?",
        actions: state.packages
          .slice(0, 3)
          .map((p) => ({ label: "Elegir " + p.name, plan: p.id })),
      };
    }
    if (/^\s*(hola|buenas|buenos dias|buenas tardes|hey|holi)[! .?]*$/.test(t))
      return {
        text: "¡Hola! ✦ Me alegra acompañarte. ¿Qué vamos a celebrar y para cuántas personas? También puedo orientarte sobre precios, fechas y pagos simulados.",
        actions: [
          { label: "Ver paquetes", ask: "¿Qué paquetes tienen?" },
          personalizeAction,
        ],
      };
    if (/gracias|perfecto|genial/.test(t))
      return {
        text: "¡Con gusto! Cuando quieras, llevamos tu idea al personalizador. Allí puedes elegir cada detalle, guardar tu cotización y reservar.",
        actions: [personalizeAction],
      };
    if (/quien eres|eres una ia|inteligencia|como funcionas/.test(t))
      return {
        text: "Soy Velvet IA, la asistente de demostración de Velvet Studio. Respondo con reglas locales y los datos de esta web: no estoy conectada a Gemini ni a otra IA externa. Puedo recordar lo que me cuentas durante esta sesión y ayudarte a preparar un evento.",
        actions: [
          { label: "Ver paquetes", ask: "¿Qué paquetes tienen?" },
          personalizeAction,
        ],
      };
    context.lastIntent = null;
    return {
      text: "Puedo ayudarte con celebraciones, paquetes, precios, presupuesto, servicios, fechas, reservas y pagos de esta demo.\n\nNo tengo información para responder eso con precisión. Prueba: “Una boda para 60 invitados con 5 millones de presupuesto”.",
      actions: [
        { label: "Paquetes y precios", ask: "¿Qué paquetes y precios tienen?" },
        { label: "Consultar una fecha", ask: "Consultar disponibilidad" },
      ],
    };
  }
  function send(text) {
    const question = text.trim().slice(0, 500);
    if (!question || busy) return;
    add("user", question);
    input.value = "";
    setBusy(true);
    const typing = document.createElement("div");
    typing.className = "assistant-message assistant-typing";
    typing.setAttribute("role", "status");
    typing.setAttribute("aria-label", "Velvet IA está escribiendo");
    typing.innerHTML =
      '<span aria-hidden="true">✦</span><div class="assistant-bubble" aria-hidden="true"><i></i><i></i><i></i></div>';
    log.append(typing);
    scroll();
    timer = setTimeout(
      () => {
        typing.remove();
        try {
          const reply = response(question);
          add("bot", reply.text, reply.actions);
        } catch {
          add(
            "bot",
            "No pude preparar esa respuesta. Prueba preguntarme por paquetes, fechas o pagos.",
          );
        }
        setBusy(false);
        timer = null;
      },
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 500,
    );
  }
  launcher.onclick = () => (panel.hidden ? open() : close());
  document.getElementById("assistantClose").onclick = close;
  document.getElementById("assistantReset").onclick = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    setBusy(false);
    history = [];
    context = initialContext();
    log.replaceChildren();
    welcome();
    input.value = "";
    input.focus();
  };
  form.onsubmit = (e) => {
    e.preventDefault();
    send(input.value);
  };
  panel
    .querySelectorAll("[data-ask]")
    .forEach((b) => (b.onclick = () => send(b.dataset.ask)));
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });
  if (history.length) history.forEach(draw);
  else welcome();
})();
