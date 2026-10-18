const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--no-proxy-server"],
  });
  try {
    fs.mkdirSync("qa", { recursive: true });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [],
      remote = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        !r.url().startsWith("http://127.0.0.1:4173") &&
        !r.url().startsWith("data:")
      )
        remote.push(r.url());
    });
    const enter = async (path = "") => {
      await page.goto("http://127.0.0.1:4173/" + path);
      await page.locator("#skipWelcome").click();
    };
    const close = () => page.locator(".section-dialog-close").click();
    await enter();
    assert.equal(await page.locator("main > .section").count(), 0);
    assert.equal(await page.locator("#sectionStore > .section").count(), 11);
    assert.equal(await page.locator(".hub-card").count(), 6);
    await page.locator("#explorar").scrollIntoViewIfNeeded();
    await page.screenshot({ path: "qa/inicio-compacto.png" });
    await page.locator('.hub-card[href="#paquetes"]').click();
    assert.ok(await page.locator("#sectionDialog[open] #paquetes").isVisible());
    assert.equal(
      await page.locator("#sectionDialogBody > .section").count(),
      1,
    );
    await page.waitForTimeout(400);
    await page.screenshot({ path: "qa/planes-en-modal.png" });
    await page.locator('[data-package="especial"]').click();
    assert.ok(
      await page.locator("#sectionDialog[open] #personaliza").isVisible(),
    );
    assert.equal(await page.locator("#eventPackage").inputValue(), "especial");
    await page.locator('#quoteForm [name="name"]').fill("Cliente Modal");
    await page.locator('#quoteForm [name="email"]').fill("modal@demo.local");
    await page.locator('#quoteForm [name="phone"]').fill("3001234567");
    await page.locator('#quoteForm [name="date"]').fill("2027-11-17");
    await page.locator('#quoteForm [name="guests"]').fill("45");
    await page.locator('.section-dialog-nav a[href="#paquetes"]').click();
    await page.locator('.section-dialog-nav a[href="#personaliza"]').click();
    assert.equal(
      await page.locator('#quoteForm [name="name"]').inputValue(),
      "Cliente Modal",
    );
    assert.equal(
      await page.locator('#quoteForm [name="guests"]').inputValue(),
      "45",
    );
    await page.locator("#reserveNow").click();
    assert.ok(await page.locator("#modal[open]").isVisible());
    await page.locator("#paySavedQuote").click();
    assert.ok(await page.locator("#payForm").isVisible());
    await page.locator("#cancelPayment").click();
    assert.ok(await page.locator("#sectionDialog[open]").isVisible());
    await page.locator('.section-dialog-nav a[href="#cliente"]').click();
    await page.locator('#loginForm [name="email"]').fill("modal@demo.local");
    await page.locator("#loginForm button").click();
    assert.ok(
      (await page.locator("#accountContent").innerText()).includes(
        "Cliente Modal",
      ),
    );
    await page.locator("[data-pay]").click();
    await page.locator("#cancelPayment").click();
    await page.screenshot({ path: "qa/reservas-en-modal.png" });
    await close();
    assert.equal(await page.locator("#sectionDialog[open]").count(), 0);
    assert.equal(await page.locator("#sectionStore > .section").count(), 11);
    assert.equal(
      await page
        .locator("body")
        .evaluate(() =>
          document.documentElement.classList.contains("section-dialog-open"),
        ),
      false,
    );
    await page.locator('.hub-card[href="#cliente"]').click();
    assert.ok(
      (await page.locator("#accountContent").innerText()).includes(
        "Cliente Modal",
      ),
    );
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#sectionDialog[open]").count(), 0);
    await page.locator('#navigation a[href="#galeria"]').click();
    await page.locator('[data-gallery="Grados"]').click();
    await page.locator('[data-photo="p5"]').click();
    await page.locator("#inspireQuote").click();
    assert.equal(
      await page.locator("#eventCategory").inputValue(),
      "Graduación universitaria",
    );
    await close();
    await page.locator('#navigation a[href="#infantiles"]').click();
    await page.locator('[data-kid-theme="batman"]').click();
    assert.equal(
      await page.locator('#quoteForm [name="theme"]').inputValue(),
      "Batman",
    );
    assert.equal(
      await page.locator("#sectionDialogTitle").innerText(),
      "Cotiza y reserva tu evento",
    );
    await page.goBack();
    assert.equal(
      await page.locator("#sectionDialogTitle").innerText(),
      "Catálogo infantil",
    );
    await close();
    await enter("index.html#fechaEvento");
    await page.waitForSelector("#sectionDialog[open] #personaliza");
    assert.ok(await page.locator("#fechaEvento").isVisible());
    await close();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        `home ${width}`,
      );
      for (const id of [
        "paquetes",
        "personaliza",
        "cliente",
        "infantiles",
        "galeria",
        "ubicacion",
        "contacto",
        "servicios",
        "opiniones",
        "preguntas",
        "experiencias",
      ]) {
        // Same open API is used by the links; inspect every section at every width.
        await page.evaluate((id) => Sections.open(id), id);
        const overflow = await page
          .locator("#sectionDialogBody")
          .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
        assert.equal(overflow, false, `${id}: ${width}`);
        const d = await page.locator("#sectionDialog").boundingBox();
        assert.ok(
          d.x >= -1 && d.x + d.width <= width + 1,
          `${id} bounds ${width}`,
        );
        if (width === 390 && id === "paquetes") await page.waitForTimeout(400);
        if (width === 390 && id === "paquetes")
          await page.screenshot({ path: "qa/planes-modal-movil.png" });
        if (width === 390 && id === "cliente") await page.waitForTimeout(400);
        if (width === 390 && id === "cliente")
          await page.screenshot({ path: "qa/reservas-modal-movil.png" });
      }
      await close();
    }
    await page.locator(".theme-toggle").click();
    await page.locator('.hub-card[href="#paquetes"]').click();
    await page.screenshot({ path: "qa/planes-modal-oscuro.png" });
    await close();
    // Registration in the same shared account component.
    await page.locator('.hub-card[href="#cliente"]').click();
    await page.locator("#logout").click();
    await page
      .locator('#registerForm [name="name"]')
      .fill("Registro en ventana");
    await page
      .locator('#registerForm [name="email"]')
      .fill("registro-modal@demo.local");
    await page.locator("#registerForm button").click();
    assert.ok(
      (await page.locator("#accountContent").innerText()).includes(
        "Registro en ventana",
      ),
    );
    assert.equal(
      await page.evaluate(() => Demo.state.session),
      "registro-modal@demo.local",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: compact home; 11 live modal sections; plans to quote; form retention; reserve/payment/return; customer login/signup and history; gallery and kids to quote; Escape/back/deep link; 5 viewport widths and dark mode. No JS errors or remote requests.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
