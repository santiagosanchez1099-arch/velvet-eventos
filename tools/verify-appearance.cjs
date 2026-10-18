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
    await page.goto("http://127.0.0.1:4173");
    if (await page.locator("#welcomeDialog[open]").count())
      await page.locator("#skipWelcome").click();
    await page.waitForSelector("[data-assistant]");
    await page.waitForTimeout(1000);
    const admin = page.locator(".admin-access");
    assert.ok(await admin.isVisible());
    assert.ok((await admin.boundingBox()).y < 150);
    const button = page.locator(".hero .button.ivory");
    const before = await button.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    await button.hover();
    await page.waitForTimeout(350);
    const after = await button.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    assert.notEqual(before, after);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.resolve("qa/contraste-inicio-claro.png"),
    });
    await page.evaluate(() => Sections.open("paquetes"));
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.resolve("qa/contraste-paquetes.png") });
    await page.evaluate(() => Sections.open("experiencias"));
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.resolve("qa/contraste-experiencias.png"),
    });
    await page.evaluate(() => Sections.close());
    await page.locator("[data-assistant]").click();
    assert.ok(await page.locator("#assistantPanel").isVisible());
    async function ask(text) {
      await page.locator("#assistantInput").fill(text);
      await page.locator("#assistantForm button").click();
      await page.waitForSelector(".assistant-typing", { state: "detached" });
      await page.waitForFunction(
        () =>
          document.getElementById("assistantForm").getAttribute("aria-busy") ===
          "false",
      );
      return page
        .locator("#assistantLog .bot .assistant-bubble p")
        .last()
        .innerText();
    }
    assert.ok(
      (await ask("¿Qué paquetes y precios tienen?")).includes("1.800.000"),
    );
    let answer = await ask(
      "Una boda para 60 invitados con 5 millones de presupuesto",
    );
    assert.ok(answer.includes("4.250.000"), answer);
    assert.ok(answer.includes("dentro de tu presupuesto"), answer);
    await page
      .locator("#assistantLog .bot")
      .last()
      .getByRole("button", { name: "Llevar mi idea al personalizador" })
      .click();
    assert.equal(await page.locator("#eventCategory").inputValue(), "Bodas");
    assert.equal(
      await page.locator('#quoteForm [name="guests"]').inputValue(),
      "60",
    );
    assert.equal(await page.locator("#eventPackage").inputValue(), "especial");
    assert.equal(
      await page.locator('#quoteForm [name="budget"]').inputValue(),
      "5000000",
    );
    assert.ok(await page.locator("#assistantPanel").isHidden());
    await page.evaluate(() => Sections.close());
    await page.locator("[data-assistant]").click();
    answer = await ask("¿Qué incluye el plan Signature?");
    assert.ok(answer.includes("Diseño floral premium"), answer);
    answer = await ask("¿Cómo puedo pagar con Nequi?");
    assert.ok(answer.includes("123456"));
    answer = await ask("¿Cuánto cuesta la fotografía?");
    assert.ok(answer.includes("650.000"), answer);
    const sample = await page.evaluate(() => Demo.state.quotes[0]);
    answer = await ask(`¿Está disponible ${sample.date} en Hacienda del Sol?`);
    assert.ok(answer.includes("ya tiene una reserva"), answer);
    answer = await ask("2027-02-31");
    assert.ok(answer.includes("no es válida"), answer);
    answer = await ask("2028-12-12 en Jardín Velvet");
    assert.ok(answer.includes("está disponible"), answer);
    await page.evaluate(() => {
      Demo.state.packages[0].price = 2100000;
      Demo.state.promotion.code = "CALMA15";
      Demo.state.promotion.discount = 15;
    });
    answer = await ask("¿Qué paquetes tienen?");
    assert.ok(answer.includes("2.100.000"), answer);
    answer = await ask("¿Qué descuento hay?");
    assert.ok(answer.includes("CALMA15") && answer.includes("15%"), answer);
    answer = await ask("Quiero 2000 invitados");
    assert.ok(answer.includes("entre 10 y 1000"), answer);
    await ask("<img src=x onerror=alert(1)>");
    assert.equal(await page.locator("#assistantLog img").count(), 0);
    answer = await ask("¿Qué temperatura tendrá París mañana?");
    assert.ok(answer.includes("No tengo información"), answer);
    const count = await page
      .locator("#assistantLog .assistant-message")
      .count();
    await page.reload();
    if (await page.locator("#welcomeDialog[open]").count())
      await page.locator("#skipWelcome").click();
    await page.evaluate(() => Sections.close());
    await page.locator("[data-assistant]").click();
    assert.equal(
      await page.locator("#assistantLog .assistant-message").count(),
      count,
    );
    await page.locator("#assistantReset").click();
    assert.equal(
      await page.locator("#assistantLog .assistant-message").count(),
      1,
    );
    await ask("Una fiesta de cumpleaños de niña para 40 personas");
    await page.screenshot({
      path: path.resolve("qa/velvet-ia-escritorio.png"),
    });
    await page.locator("#assistantClose").click();
    assert.equal(
      await page.locator("[data-assistant]").getAttribute("aria-expanded"),
      "false",
    );
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("http://127.0.0.1:4173");
      if (await page.locator("#welcomeDialog[open]").count())
        await page.locator("#skipWelcome").click();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Desbordamiento " + width,
      );
      assert.ok(await page.locator(".admin-access").isVisible());
      if (width === 390) {
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.resolve("qa/contraste-inicio-movil.png"),
        });
        await page.evaluate(() => Sections.close());
        await page.locator("[data-assistant]").click();
        assert.equal(
          await page
            .locator("#assistantPanel")
            .evaluate((el) => el.scrollWidth > el.clientWidth + 1),
          false,
        );
        await page.screenshot({ path: path.resolve("qa/velvet-ia-movil.png") });
        await page.locator("#assistantInput").press("Escape");
        assert.ok(await page.locator("#assistantPanel").isHidden());
      }
    }
    await page.locator(".theme-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve("qa/contraste-oscuro.png") });
    const reduce = await browser.newContext({ reducedMotion: "reduce" });
    const reduced = await reduce.newPage();
    await reduced.goto("http://127.0.0.1:4173");
    assert.equal(await reduced.locator(".reveal.pending").count(), 0);
    const infinite = await reduced.evaluate(
      () =>
        document
          .getAnimations()
          .filter((a) => a.effect.getTiming().iterations === Infinity).length,
    );
    assert.equal(infinite, 0);
    await reduce.close();
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: hover cambia color; administración visible; contraste claro/oscuro; 5 anchos sin desbordamiento; IA con presupuesto, planes actuales, extras, pagos, fechas reales de demo, historial, transferencia al formulario, reinicio, Escape, texto seguro y movimiento reducido. Sin errores JS ni peticiones externas.",
    );
  } finally {
    await browser?.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
