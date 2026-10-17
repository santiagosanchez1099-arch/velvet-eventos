const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
require("node:fs").mkdirSync("qa", { recursive: true });
const assert = require("node:assert/strict");
const path = require("node:path");
(async () => {
  let browser;
  try {
    browser = await chromium.launch({
      channel: "chrome",
      headless: true,
      args: ["--no-proxy-server"],
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      }),
      page = await context.newPage(),
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
    await page.waitForSelector(".experience-card");
    await page.waitForFunction(() => {
      const v = document.getElementById("heroVideo");
      return v.readyState >= 2 && v.videoWidth > 0 && v.currentTime > 0;
    });
    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished)),
    );
    await page.screenshot({ path: path.resolve("qa/inicio-escritorio.png") });
    await page.locator(".theme-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.screenshot({ path: path.resolve("qa/inicio-oscuro.png") });
    await page.locator(".theme-toggle").click();
    await page.locator("#showAll").click();
    assert.equal(await page.locator(".experience-card").count(), 19);
    await page.locator('[data-group="Romance"]').click();
    assert.equal(await page.locator(".experience-card").count(), 4);
    await page.locator('[data-category="7"]').first().click();
    await page.locator("#chooseCategory").click();
    await page.locator('#quoteForm [name="guests"]').fill("50");
    await page.locator('#quoteForm [name="promo"]').fill("VELVET10");
    await page.locator('#quoteForm [name="extras"][value="1"]').check();
    await page.locator('#quoteForm [name="date"]').fill("2027-04-20");
    await page.locator('#quoteForm [name="name"]').fill("Cliente QA");
    await page.locator('#quoteForm [name="email"]').fill("qa@demo.local");
    await page.locator('#quoteForm [name="phone"]').fill("3001234567");
    await page.locator('#quoteForm [type="submit"]').click();
    await page.waitForSelector("#modal[open]");
    let data = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")),
    );
    let q = data.quotes.at(-1);
    assert.equal(q.total, 2835000);
    assert.equal(q.status, "Cotizada");
    await page.goto("http://127.0.0.1:4173/cuenta.html");
    await page.locator('#loginForm [name="email"]').fill("qa@demo.local");
    await page.locator("#loginForm button").click();
    await page.locator("[data-reserve]").click();
    await page.locator("[data-pay]").click();
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="consent"]').check();
    await page.locator('#payForm [name="result"]').selectOption("fail");
    await page.locator("#confirmPayment").click();
    data = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")),
    );
    await page.waitForSelector("#paymentError:not([hidden])");
    assert.equal(data.quotes.at(-1).paid, 0);
    await page.locator('#payForm [name="result"]').selectOption("ok");
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#downloadReceipt");
    data = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")),
    );
    assert.equal(data.quotes.at(-1).paid, 850500);
    const download = page.waitForEvent("download");
    await page.locator("#downloadReceipt").click();
    assert.ok((await download).suggestedFilename().endsWith(".txt"));
    await page.locator(".modal-close").click();
    await page.locator("[data-pay]").click();
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="consent"]').check();
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#downloadReceipt");
    await page.locator(".modal-close").click();
    data = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")),
    );
    assert.equal(data.quotes.at(-1).paid, q.total);
    await page.goto("http://127.0.0.1:4173");
    await page.locator('#contactForm [name="name"]').fill("Cliente QA");
    await page.locator('#contactForm [name="email"]').fill("qa@demo.local");
    await page
      .locator('#contactForm [name="message"]')
      .fill("Quiero una decoración floral especial.");
    await page.locator("#contactForm button").click();
    await page.goto("http://127.0.0.1:4173/mensajes.html");
    await page.locator("[data-reply]").first().click();
    await page
      .locator("#replyForm textarea")
      .fill("Claro, prepararemos una propuesta floral.");
    await page.locator("#replyForm button").click();
    await page.goto("http://127.0.0.1:4173/cuenta.html");
    assert.ok(
      (await page.locator("body").innerText()).includes("Claro, prepararemos"),
    );
    await page.goto("http://127.0.0.1:4173/eventos.html");
    await page.locator("[data-edit-event]").first().click();
    await page.locator('#eventEdit [name="date"]').fill(data.quotes[0].date);
    await page
      .locator('#eventEdit [name="venue"]')
      .selectOption(data.quotes[0].venue);
    await page.locator("#eventEdit button").click();
    assert.equal(await page.locator("#modal").getAttribute("open"), "");
    assert.ok(
      (await page.locator("#toast").innerText()).includes("ya está reservado"),
    );
    await page.locator(".modal-close").click();
    for (const route of [
      "admin",
      "clientes",
      "mensajes",
      "paquetes",
      "pagos",
      "fotografias",
      "reportes",
      "configuracion",
    ]) {
      await page.goto(`http://127.0.0.1:4173/${route}.html`);
      await page.waitForSelector("#adminContent");
      assert.ok((await page.locator("#adminContent").innerText()).length > 20);
      if (route === "admin")
        await page.screenshot({
          path: path.resolve("qa/panel-escritorio.png"),
          fullPage: true,
        });
    }
    await page.goto("http://127.0.0.1:4173");
    await page.locator("#invitationPreview").click();
    await page.locator("#inviteForm button").click();
    await page.waitForSelector(".invitation");
    await page.locator("#addInvitation").click();
    assert.ok(
      await page.locator('#quoteForm [name="extras"][value="0"]').isChecked(),
    );
    await page.locator("[data-chat]").first().click();
    await page.locator("[data-suggestion]").first().click();
    assert.equal(await page.locator(".bubble").count(), 3);
    await page.locator(".modal-close").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:4173");
    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished)),
    );
    await page.screenshot({ path: path.resolve("qa/inicio-movil.png") });
    await page.locator(".mobile-toggle").click();
    await page.locator("#navigation a").first().click();
    assert.equal(await page.locator("#navigation").getAttribute("class"), "");
    for (const route of [
      "index",
      "cuenta",
      "admin",
      "eventos",
      "clientes",
      "mensajes",
      "paquetes",
      "pagos",
      "fotografias",
      "reportes",
      "configuracion",
    ]) {
      await page.goto(`http://127.0.0.1:4173/${route}.html`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, "Desbordamiento móvil: " + route);
    }
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("http://127.0.0.1:4173");
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Desbordamiento a " + width,
      );
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: categorías, tema, cotización, descuento, cuenta, reserva, conflicto, rechazo/aprobación, anticipo/saldo, comprobante, contacto/respuesta, invitación, chat, 11 páginas móviles. Sin errores JS ni conexiones remotas.",
    );
    console.log("Capturas guardadas en qa/");
  } finally {
    await browser?.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
