/* Local demonstration profiles. UI permissions are simulated, not server security. */
const Profiles = (() => {
  const { state, esc, toast, modal } = Demo;
  const roles = {
    admin: {
      name: "Administración",
      description: "Acceso completo y gestión del equipo",
      pages: [
        "admin",
        "eventos",
        "clientes",
        "mensajes",
        "paquetes",
        "pagos",
        "fotografias",
        "reportes",
        "configuracion",
        "usuarios",
      ],
    },
    coordinacion: {
      name: "Coordinación",
      description: "Clientes, eventos, mensajes y seguimiento",
      pages: ["admin", "eventos", "clientes", "mensajes", "reportes"],
    },
    finanzas: {
      name: "Finanzas",
      description: "Pagos, saldos e informes",
      pages: ["admin", "pagos", "reportes"],
    },
    contenido: {
      name: "Contenido",
      description: "Paquetes, promociones y fotografías",
      pages: ["admin", "paquetes", "fotografias"],
    },
    cliente: {
      name: "Cliente",
      description: "Su cuenta, cotizaciones, reservas y pagos",
      pages: [],
    },
  };
  let changed = false;
  state.users.forEach((u) => {
    if (!u.role) {
      u.role = "cliente";
      changed = true;
    }
    if (u.active === undefined) {
      u.active = true;
      changed = true;
    }
  });
  if (!state.profilesVersion) {
    for (const u of [
      {
        id: "equipo-angie",
        name: "Angie Alape",
        email: "angie@demo.local",
        role: "admin",
        active: true,
      },
      {
        id: "equipo-sofia",
        name: "Sofía Martínez",
        email: "sofia@demo.local",
        role: "coordinacion",
        active: true,
      },
      {
        id: "equipo-daniel",
        name: "Daniel Torres",
        email: "daniel@demo.local",
        role: "finanzas",
        active: true,
      },
      {
        id: "equipo-camila",
        name: "Camila Ruiz",
        email: "camila@demo.local",
        role: "contenido",
        active: true,
      },
    ]) {
      if (!state.users.some((x) => x.email === u.email)) state.users.push(u);
    }
    state.profilesVersion = 1;
    changed = true;
  }
  if (changed) Demo.save();
  function current() {
    return (
      state.users.find(
        (u) =>
          u.email === state.adminSession &&
          u.active &&
          u.role !== "cliente" &&
          roles[u.role],
      ) || null
    );
  }
  function allowed(page) {
    const u = current();
    return !!u && roles[u.role].pages.includes(page.replace(".html", ""));
  }
  function signIn(email) {
    const user = state.users.find(
      (u) => u.email === email.toLowerCase().trim(),
    );
    if (!user)
      return "No existe ese perfil. Pide al administrador que cree tu usuario.";
    if (!user.active)
      return "Este perfil está desactivado. Contacta al administrador.";
    if (user.role === "cliente")
      return "Esta es una cuenta de cliente. Entra desde el portal Clientes.";
    state.adminSession = user.email;
    Demo.save();
    return null;
  }
  function signOut() {
    state.adminSession = null;
    Demo.save();
  }
  function access(page) {
    const user = current(),
      permitted = user && roles[user.role].pages;
    document.body.innerHTML = `<header class="site-header"><a class="brand" href="index.html">velvet<span>ESTUDIO DE CELEBRACIONES</span></a><div class="header-actions"><button class="icon theme-toggle" aria-label="Cambiar tema">◐</button><a class="portal-client" href="cuenta.html">Clientes ↗</a></div></header><main class="access-layout"><div class="access-story"><p class="eyebrow">EL EQUIPO DETRÁS DE CADA HISTORIA</p><h1>Un espacio para<br><em>crear juntos.</em></h1><p>Perfiles distintos, una misma celebración. Entra al portal del equipo con tu usuario de demostración.</p><div class="role-overview">${Object.entries(
      roles,
    )
      .filter(([id]) => id !== "cliente")
      .map(
        ([id, r]) =>
          `<div><span>✦</span><strong>${r.name}</strong><p>${r.description}</p></div>`,
      )
      .join("")}</div></div><div class="panel access-card">${
      user
        ? `<p class="eyebrow">ACCESO SEGÚN TU ROL</p><h2>Hola, ${esc(user.name.split(" ")[0])}.</h2><p>Tu perfil de ${roles[user.role].name} no tiene acceso a esta sección.</p><a class="button" href="${permitted[0]}.html">Ir a mi panel ↗</a><button class="text-button" id="switchProfile">Cambiar perfil</button>`
        : `<p class="eyebrow">PORTAL ADMINISTRATIVO</p><h2>Bienvenido al <em>equipo.</em></h2><form id="adminLogin"><label>Correo del usuario<input name="email" type="email" required placeholder="tuusuario@demo.local" autocomplete="username"></label><div id="loginError" class="payment-error" role="alert" hidden></div><button class="button" type="submit">Entrar a mi panel ↗</button></form><details class="demo-profiles"><summary>Explorar perfiles de demostración</summary>${state.users
            .filter((u) => u.active && u.role !== "cliente")
            .map(
              (u) =>
                `<button class="profile-example" data-profile-email="${esc(u.email)}"><strong>${esc(u.name)}</strong><span>${roles[u.role]?.name || u.role}</span><small>${esc(u.email)}</small></button>`,
            )
            .join(
              "",
            )}</details><p class="form-note">Acceso simulado por correo, sin contraseñas. Los roles controlan la experiencia de esta demo local.</p>`
    }<a class="text-button" href="cuenta.html">¿Quieres organizar tu evento? Crea una cuenta de cliente ↗</a></div></main><div id="toast" role="status"></div>`;
    document.getElementById("switchProfile")?.addEventListener("click", () => {
      signOut();
      location.reload();
    });
    document.getElementById("adminLogin")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = signIn(e.target.email.value);
      if (message) {
        const box = document.getElementById("loginError");
        box.hidden = false;
        box.textContent = message;
      } else location.href = allowed(page) ? page : "admin.html";
    });
    document.querySelectorAll("[data-profile-email]").forEach(
      (b) =>
        (b.onclick = () => {
          document.querySelector("#adminLogin input").value =
            b.dataset.profileEmail;
          document.getElementById("adminLogin").requestSubmit();
        }),
    );
  }
  function manageUsers(host) {
    if (!allowed("usuarios")) return;
    host.innerHTML = `<div class="notice">Crea perfiles para el equipo o clientes. Cada rol muestra solo sus herramientas. Usa información ficticia: es una demostración local.</div><div class="toolbar"><input id="userSearch" placeholder="Buscar usuario o correo…" aria-label="Buscar usuarios"><select id="userRoleFilter" aria-label="Filtrar por rol"><option value="">Todos los roles</option>${Object.entries(
      roles,
    )
      .map(([id, r]) => `<option value="${id}">${r.name}</option>`)
      .join(
        "",
      )}</select><button class="button" id="createUser">+ Crear usuario</button></div><div id="usersTable"></div><div class="role-overview role-matrix">${Object.entries(
      roles,
    )
      .map(
        ([id, r]) =>
          `<article><strong>${r.name}</strong><p>${r.description}</p></article>`,
      )
      .join("")}</div>`;
    const draw = () => {
      const query = document.getElementById("userSearch").value.toLowerCase(),
        role = document.getElementById("userRoleFilter").value;
      document.getElementById("usersTable").innerHTML =
        `<div class="table-wrap"><table><thead><tr><th>Usuario</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>${
          state.users
            .filter(
              (u) =>
                (!role || u.role === role) &&
                `${u.name} ${u.email}`.toLowerCase().includes(query),
            )
            .map(
              (u) =>
                `<tr><td><strong>${esc(u.name)}</strong>${current()?.id === u.id ? ' <span class="status">Tú</span>' : ""}</td><td>${esc(u.email)}</td><td>${roles[u.role]?.name || esc(u.role)}</td><td><span class="status">${u.active ? "Activo" : "Inactivo"}</span></td><td><button class="text-button" data-user-id="${esc(u.id)}">Editar perfil ↗</button></td></tr>`,
            )
            .join("") || '<tr><td colspan="5">Sin resultados.</td></tr>'
        }</tbody></table></div>`;
      host
        .querySelectorAll("[data-user-id]")
        .forEach(
          (b) =>
            (b.onclick = () =>
              edit(state.users.find((u) => u.id === b.dataset.userId))),
        );
    };
    function edit(user) {
      modal(
        `<p class="eyebrow">USUARIOS Y PERMISOS DE DEMOSTRACIÓN</p><h2>${user ? "Editar" : "Crear"} <em>perfil.</em></h2><form id="userForm"><label>Nombre<input name="name" value="${esc(user?.name || "")}" required minlength="2" maxlength="70"></label><label>Correo<input name="email" type="email" value="${esc(user?.email || "")}" required ${user ? "readonly" : ""}></label><label>Rol<select name="role">${Object.entries(
          roles,
        )
          .map(
            ([id, r]) =>
              `<option value="${id}" ${(user?.role || "coordinacion") === id ? "selected" : ""}>${r.name} · ${r.description}</option>`,
          )
          .join(
            "",
          )}</select></label><label>Estado<select name="active"><option value="true" ${user?.active !== false ? "selected" : ""}>Activo</option><option value="false" ${user?.active === false ? "selected" : ""}>Inactivo</option></select></label><p class="form-note">El correo identifica al usuario y no se envía ninguna invitación real. Puedes compartir ese correo para simular su acceso en este navegador.</p><div id="userError" class="payment-error" role="alert" hidden></div><button class="button">Guardar perfil</button></form>`,
      );
      document.getElementById("userForm").onsubmit = (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        data.email = data.email.toLowerCase().trim();
        const error = document.getElementById("userError");
        const fail = (text) => {
          error.hidden = false;
          error.textContent = text;
        };
        if (!roles[data.role]) return fail("Selecciona un rol válido.");
        if (!user && state.users.some((u) => u.email === data.email))
          return fail("Ese correo ya existe.");
        if (
          user?.email === state.adminSession &&
          (data.role !== "admin" || data.active !== "true")
        )
          return fail(
            "Conserva tu propio perfil activo como administrador para no perder el acceso.",
          );
        if (
          user?.role === "admin" &&
          (data.role !== "admin" || data.active !== "true") &&
          state.users.filter((u) => u.role === "admin" && u.active).length <= 1
        )
          return fail("Debe quedar al menos un administrador activo.");
        if (user) {
          Object.assign(user, {
            name: data.name,
            role: data.role,
            active: data.active === "true",
          });
          state.quotes
            .filter((q) => q.email === user.email)
            .forEach((q) => (q.name = user.name));
        } else
          state.users.push({
            id: Demo.id("USR"),
            ...data,
            active: data.active === "true",
          });
        if (Demo.save()) {
          Demo.close();
          draw();
          toast(
            "Perfil guardado. Sus permisos se aplican al entrar al portal.",
          );
        }
      };
    }
    document.getElementById("createUser").onclick = () => edit();
    document.getElementById("userSearch").oninput = draw;
    document.getElementById("userRoleFilter").onchange = draw;
    draw();
  }
  return { roles, current, allowed, signIn, signOut, access, manageUsers };
})();

// Keep both portals next to the theme control on the customer account too.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (!header || header.querySelector(".portal-client")) return;
  const actions = header.querySelector(".header-actions");
  if (!actions) return;
  const clients = document.createElement("a");
  clients.className = "portal-client";
  clients.href = "cuenta.html";
  clients.textContent = "Clientes ↗";
  clients.setAttribute("aria-label", "Abrir portal de clientes");
  const team = document.createElement("a");
  team.className = "admin-access";
  team.href = "admin.html";
  team.setAttribute("aria-label", "Abrir portal administrativo");
  team.innerHTML =
    '<span class="portal-label">Administración ↗</span><span class="portal-short">Equipo ↗</span>';
  actions.append(clients, team);
});
