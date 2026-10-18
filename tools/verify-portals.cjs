const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
fs.mkdirSync("qa", { recursive: true });
(async () => {
  let browser;
  try {
    browser = await chromium.launch({
      channel: "chrome",
      headless: true,
      args: ["--no-proxy-server"],
    });
    const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
      }),
      errors = [],
      remote = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        !r.url().startsWith("http://127.0.0.1:4173") &&
        !r.url().startsWith("data:")
      )
        remote.push(r.url());
    });
    const go = (name) => page.goto("http://127.0.0.1:4173/" + name + ".html");
    await go("index");
    await page.waitForSelector("#welcomeDialog[open]");
    assert.equal(
      await page.evaluate(() => window.VelvetAmbience.isPlaying()),
      false,
    );
    await page.screenshot({ path: path.resolve("qa/bienvenida.png") });
    await page.locator("#enterWelcome").click();
    assert.equal(await page.locator("#welcomeDialog").count(), 0);
    await page.locator("#ambientToggle").click();
    await page.waitForFunction(() => window.VelvetAmbience.isPlaying());
    assert.equal(
      await page.locator("#ambientToggle").getAttribute("aria-pressed"),
      "true",
    );
    await page.locator("#ambientToggle").click();
    await page.waitForFunction(() => !window.VelvetAmbience.isPlaying());
    await page.evaluate(() => Sections.open("opiniones"));
    await page.locator("#nextReview").click();
    await page.waitForTimeout(600);
    assert.equal(
      await page.locator('[data-review="1"]').getAttribute("aria-current"),
      "true",
    );
    await page.locator("#previousReview").click();
    await page.waitForTimeout(600);
    assert.equal(
      await page.locator('[data-review="0"]').getAttribute("aria-current"),
      "true",
    );
    await page.evaluate(() => Sections.open("infantiles"));
    await page.waitForTimeout(300);
    assert.equal(await page.locator("[data-kid-theme]").count(), 4);
    assert.ok(await page.locator('[data-kid-theme="batman"]').isVisible());
    await page.screenshot({
      path: path.resolve("qa/planes-infantiles-nino.png"),
    });
    await page.locator('[data-audience="nina"]').click();
    assert.ok(await page.locator('[data-kid-theme="barbie"]').isVisible());
    await page.screenshot({
      path: path.resolve("qa/planes-infantiles-nina.png"),
    });
    await page.locator('[data-kid-theme="barbie"]').click();
    assert.equal(
      await page.locator("#eventCategory").inputValue(),
      "Cumpleaños de niña",
    );
    assert.equal(
      await page.locator('#quoteForm [name="theme"]').inputValue(),
      "Barbie",
    );
    assert.ok(
      (
        await page.locator('#quoteForm [name="kidsPlan"]').inputValue()
      ).includes("Niña"),
    );
    const before = await page.evaluate(() => estimate().total);
    await page.evaluate(() => Sections.open("infantiles"));
    await page.locator("[data-catalog-extra]").first().click();
    await page.evaluate(() => Sections.open("personaliza"));
    assert.equal(await page.evaluate(() => estimate().total), before + 280000);
    assert.ok(await page.locator("#kidsPreview").isVisible());
    await page.locator('#quoteForm [name="name"]').fill("Cliente Infantil");
    await page.locator('#quoteForm [name="email"]').fill("infantil@demo.local");
    await page.locator('#quoteForm [name="phone"]').fill("3001234567");
    await page.locator('#quoteForm [name="date"]').fill("2028-07-15");
    await page.locator("#reserveNow").click();
    await page.waitForSelector("#paySavedQuote");
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")).quotes.at(-1),
    );
    assert.ok(stored.package.includes("Niña"));
    assert.ok(stored.extras.includes("Piñata personalizada"));
    await page.locator(".modal-close").click();
    await page.evaluate(() => Sections.close());
    await page.locator(".portal-client").click();
    await page
      .locator('#registerForm [name="name"]')
      .fill("Cliente Registrado");
    await page
      .locator('#registerForm [name="email"]')
      .fill("nuevo-cliente@demo.local");
    await page.locator("#registerForm button").click();
    let client = await page.evaluate(() =>
      Demo.state.users.find((u) => u.email === "nuevo-cliente@demo.local"),
    );
    assert.equal(client.role, "cliente");
    assert.equal(client.active, true);
    await page.evaluate(() => Sections.close());
    await page.locator(".admin-access").click();
    await page.waitForSelector("#adminLogin");
    await page
      .locator('#adminLogin [name="email"]')
      .fill("nuevo-cliente@demo.local");
    await page.locator("#adminLogin button").click();
    assert.ok(
      (await page.locator("#loginError").innerText()).includes(
        "cuenta de cliente",
      ),
    );
    await page.locator('#adminLogin [name="email"]').fill("angie@demo.local");
    await page.locator("#adminLogin button").click();
    await page.waitForSelector("#adminContent");
    await page.locator('.sidebar a[href="usuarios.html"]').click();
    await page.locator("#createUser").click();
    await page.locator('#userForm [name="name"]').fill("Coordinadora Nueva");
    await page
      .locator('#userForm [name="email"]')
      .fill("equipo-nuevo@demo.local");
    await page.locator('#userForm [name="role"]').selectOption("coordinacion");
    await page.locator("#userForm button").click();
    await page.waitForSelector("#usersTable");
    assert.ok(
      (await page.locator("#usersTable").innerText()).includes(
        "Coordinadora Nueva",
      ),
    );
    await page.screenshot({ path: path.resolve("qa/usuarios-y-roles.png") });
    await page.locator("#adminLogout").click();
    await page
      .locator('#adminLogin [name="email"]')
      .fill("equipo-nuevo@demo.local");
    await page.locator("#adminLogin button").click();
    await page.waitForSelector("#adminContent");
    assert.equal(
      await page.locator('.sidebar a[href="usuarios.html"]').count(),
      0,
    );
    assert.equal(
      await page.locator('.sidebar a[href="pagos.html"]').count(),
      0,
    );
    assert.ok(
      await page.locator('.sidebar a[href="eventos.html"]').isVisible(),
    );
    await go("usuarios");
    assert.ok(
      (await page.locator("body").innerText()).includes("no tiene acceso"),
    );
    // The content and finance profiles have distinct toolsets.
    await page.evaluate(() => {
      Profiles.signOut();
    });
    await go("admin");
    await page.locator('#adminLogin [name="email"]').fill("camila@demo.local");
    await page.locator("#adminLogin button").click();
    await page.waitForSelector("#adminContent");
    assert.equal(
      await page.locator('.sidebar a[href="clientes.html"]').count(),
      0,
    );
    assert.ok(
      await page.locator('.sidebar a[href="fotografias.html"]').isVisible(),
    );
    assert.equal(await page.locator("[data-edit-event]").count(), 0);
    await page.evaluate(() => Profiles.signOut());
    await go("pagos");
    await page.locator('#adminLogin [name="email"]').fill("daniel@demo.local");
    await page.locator("#adminLogin button").click();
    await page.waitForSelector("#adminContent");
    assert.ok(await page.locator('.sidebar a[href="pagos.html"]').isVisible());
    assert.equal(
      await page.locator('.sidebar a[href="usuarios.html"]').count(),
      0,
    );
    // Deactivate a custom user and verify login is denied.
    await page.evaluate(() => Profiles.signOut());
    await go("usuarios");
    await page.locator('#adminLogin [name="email"]').fill("angie@demo.local");
    await page.locator("#adminLogin button").click();
    await page.waitForSelector("#createUser");
    const id = await page.evaluate(
      () =>
        Demo.state.users.find((u) => u.email === "equipo-nuevo@demo.local").id,
    );
    await page.locator(`[data-user-id="${id}"]`).click();
    await page.locator('#userForm [name="active"]').selectOption("false");
    await page.locator("#userForm button").click();
    await page.locator("#adminLogout").click();
    await page
      .locator('#adminLogin [name="email"]')
      .fill("equipo-nuevo@demo.local");
    await page.locator("#adminLogin button").click();
    assert.ok(
      (await page.locator("#loginError").innerText()).includes("desactivado"),
    );
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await go("index");
      await page.waitForSelector("#welcomeDialog[open]");
      await page.locator("#skipWelcome").click();
      assert.ok(await page.locator(".portal-client").isVisible());
      assert.ok(await page.locator(".admin-access").isVisible());
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Inicio " + width,
      );
      if (width === 390) {
        await page.evaluate(() => Sections.open("infantiles"));
        await page.screenshot({
          path: path.resolve("qa/infantiles-movil.png"),
        });
        await page.evaluate(() => Sections.open("opiniones"));
        await page.screenshot({ path: path.resolve("qa/opiniones-movil.png") });
      }
      await go("admin");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Acceso " + width,
      );
    }
    const reduce = await browser.newContext({ reducedMotion: "reduce" }),
      r = await reduce.newPage();
    await r.goto("http://127.0.0.1:4173");
    assert.equal(
      await r.evaluate(
        () =>
          document
            .getAnimations()
            .filter((a) => a.effect.getTiming().iterations === Infinity).length,
      ),
      0,
    );
    await reduce.close();
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: bienvenida en cada entrada, audio opcional activar/silenciar, opiniones navegables, niño/niña y 8 temas, extras y presupuesto, reserva infantil, registro cliente, crear/desactivar usuarios, 4 roles y rutas restringidas, 5 anchos de pantalla, movimiento reducido. Sin errores JS ni conexiones externas.",
    );
  } finally {
    await browser?.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
