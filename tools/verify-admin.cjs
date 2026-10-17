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
    const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
      }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const go = (route) => page.goto("http://127.0.0.1:4173/" + route + ".html");
    await go("paquetes");
    await page.locator('[data-edit-package="basico"]').click();
    await page.locator('#packageEdit [name="name"]').fill("Esencial QA");
    await page.locator('#packageEdit [name="price"]').fill("2000000");
    await page.locator("#packageEdit button").click();
    await page.locator('#promoEdit [name="code"]').fill("PRUEBA15");
    await page.locator('#promoEdit [name="discount"]').fill("15");
    await page.locator("#promoEdit button").click();
    await go("index");
    assert.ok(
      (await page.locator("#packageGrid").innerText()).includes("Esencial QA"),
    );
    assert.ok((await page.locator(".promo").innerText()).includes("15%"));
    await page.locator('#quoteForm [name="promo"]').fill("PRUEBA15");
    assert.ok(
      (await page.locator("#quoteSummary").innerText()).includes("1.700.000"),
    );
    await go("clientes");
    await page.locator("#newClient").click();
    await page.locator('#clientEdit [name="name"]').fill("Cliente Panel");
    await page.locator('#clientEdit [name="email"]').fill("panel@demo.local");
    await page.locator("#clientEdit button").click();
    await page.locator('[data-client="panel@demo.local"]').click();
    await page.locator('#clientEdit [name="name"]').fill("Cliente Editado");
    await page.locator("#clientEdit button").click();
    assert.ok(
      (await page.locator("#clientTable").innerText()).includes(
        "Cliente Editado",
      ),
    );
    await go("fotografias");
    await page.locator('#photoForm [name="title"]').fill("Inspiración QA");
    await page
      .locator('#photoForm [name="file"]')
      .setInputFiles({
        name: "prueba.png",
        mimeType: "image/png",
        buffer: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j/QcAAAAASUVORK5CYII=",
          "base64",
        ),
      });
    await page.locator("#photoForm button").click();
    await page.waitForFunction(() =>
      document
        .querySelector(".admin-photo-grid")
        .textContent.includes("Inspiración QA"),
    );
    await go("index");
    assert.ok(
      (await page.locator("#galleryGrid").innerText()).includes(
        "Inspiración QA",
      ),
    );
    await go("reportes");
    const pending = page.waitForEvent("download");
    await page.locator("#exportCsv").click();
    assert.equal(
      (await pending).suggestedFilename(),
      "velvet-reporte-demo.csv",
    );
    await go("cuenta");
    await page.locator('#registerForm [name="name"]').fill("Nueva Persona");
    await page.locator('#registerForm [name="email"]').fill("nueva@demo.local");
    await page.locator("#registerForm button").click();
    assert.ok(
      (await page.locator("#accountContent").innerText()).includes(
        "Nueva Persona",
      ),
    );
    await page.locator("#logout").click();
    await page.locator("#loginForm button").click();
    await page.locator("[data-cancel]").click();
    await page.locator("#confirmCancel").click();
    let state = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("velvet-demo-v1")),
    );
    assert.equal(state.quotes[0].status, "Cancelada");
    await go("configuracion");
    await page.locator("#resetDemo").click();
    await page.locator("#confirmReset").click();
    await page.waitForFunction(() => document.querySelector("#resetDemo"));
    await go("index");
    state = await page.evaluate(() => Demo.state);
    assert.equal(state.packages[0].price, 1800000);
    assert.equal(state.promotion.code, "VELVET10");
    assert.equal(state.quotes[0].status, "Reservada");
    assert.equal(state.users.length, 1);
    await page.evaluate(() =>
      Promise.all(document.getAnimations().map((a) => a.finished)),
    );
    for (const [id, file] of [
      ["experiencias", "experiencias"],
      ["paquetes", "paquetes"],
      ["personaliza", "personalizador"],
    ]) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
      await page.screenshot({ path: path.resolve("qa/" + file + ".png") });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#personaliza").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.resolve("qa/personalizador-movil.png"),
    });
    assert.deepEqual(errors, []);
    console.log(
      "OK: edición de precios/paquetes/promoción y reflejo en sitio, crear/editar cliente, subir foto y mostrar en galería, exportar CSV, registro/cierre de sesión, cancelación y restablecimiento.",
    );
  } finally {
    await browser?.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
