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
    const go = async (route) => {
      await page.goto("http://127.0.0.1:4173/" + route + ".html");
      if (await page.locator("#welcomeDialog[open]").count())
        await page.locator("#skipWelcome").click();
    };
    const read = () =>
      page.evaluate(() => JSON.parse(localStorage.getItem("velvet-demo-v1")));
    await go("index");
    for (const plan of ["basico", "especial", "premium", "personalizado"]) {
      await page.evaluate(() => Sections.open("paquetes"));
      await page.locator(`[data-package="${plan}"]`).click();
      await page.waitForFunction(() => location.hash === "#personaliza");
      assert.equal(await page.locator("#eventPackage").inputValue(), plan);
      assert.ok(await page.locator("#plannerFeedback").isVisible());
    }
    await page.evaluate(() => Sections.open("servicios"));
    await page.locator("[data-extra]").click();
    assert.ok(
      await page.locator('#quoteForm [name="extras"][value="4"]').isChecked(),
    );
    await page.evaluate(() => Sections.open("experiencias"));
    await page.locator('[data-category="7"]').first().click();
    await page.locator("#chooseCategory").click();
    assert.equal(await page.locator("#eventCategory").inputValue(), "Bodas");
    await page.locator('#quoteForm [name="name"]').fill("Cliente Pagos Demo");
    await page.locator('#quoteForm [name="email"]').fill("pagos@demo.local");
    await page.locator('#quoteForm [name="phone"]').fill("3001234567");
    await page.locator('#quoteForm [name="date"]').fill("2027-06-12");
    await page.locator("#reserveNow").click();
    await page.locator("#paySavedQuote").click();
    assert.ok(await page.locator("#payForm").isVisible());
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="consent"]').check();
    await page
      .locator('#payForm [name="cardNumber"]')
      .fill("4111 1111 1111 1111");
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#paymentError:not([hidden])");
    assert.ok(
      (await page.locator("#paymentError").innerText()).includes(
        "tarjetas ficticias",
      ),
    );
    assert.equal((await read()).payments.length, 1);
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="cardExpiry"]').fill("01/20");
    await page.locator("#confirmPayment").click();
    assert.ok(
      (await page.locator("#paymentError").innerText()).includes("vencida"),
    );
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="result"]').selectOption("fail");
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#paymentError:not([hidden])");
    assert.ok(
      (await page.locator("#paymentError").innerText()).includes("rechazado"),
    );
    assert.equal((await read()).quotes.at(-1).paid, 0);
    await page.locator('#payForm [name="result"]').selectOption("ok");
    await page.locator('#payForm [name="installments"]').selectOption("3");
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#downloadReceipt");
    let state = await read();
    assert.ok(state.payments.at(-1).method.includes("3 cuota"));
    assert.ok(state.quotes.at(-1).paid > 0);
    assert.ok(!JSON.stringify(state).includes("4242"));
    assert.ok(!JSON.stringify(state).includes("cardCvv"));
    await page.screenshot({ path: path.resolve("qa/pago-confirmado.png") });
    await page.locator(".modal-close").click();
    await go("cuenta");
    await page.locator('#loginForm [name="email"]').fill("pagos@demo.local");
    await page.locator("#loginForm button").click();
    await page.locator("[data-pay]").click();
    await page.locator('#payForm [value="nequi"]').check();
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="consent"]').check();
    await page.locator("#confirmPayment").click();
    assert.ok(
      (await page.locator("#paymentError").innerText()).includes(
        "Genera el código",
      ),
    );
    await page.locator("#requestPaymentCode").click();
    await page.locator('#payForm [name="walletCode"]').fill("000000");
    await page.locator("#confirmPayment").click();
    assert.ok(
      (await page.locator("#paymentError").innerText()).includes("123456"),
    );
    await page.locator('#payForm [name="walletCode"]').fill("123456");
    await page.screenshot({ path: path.resolve("qa/pago-nequi.png") });
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#downloadReceipt");
    state = await read();
    assert.equal(state.quotes.at(-1).paid, state.quotes.at(-1).total);
    assert.ok(state.payments.at(-1).method.startsWith("Nequi"));
    await page.locator(".modal-close").click();
    assert.equal(await page.locator("[data-pay]").count(), 0);
    // Use the seeded reservation to exercise Daviplata and debit without changing the user's browser data.
    await page.locator("#logout").click();
    await page.locator("#loginForm button").click();
    await page.locator("[data-pay]").click();
    await page.locator('#payForm [value="daviplata"]').check();
    await page.locator("#useTestData").click();
    await page.locator("#requestPaymentCode").click();
    await page.locator('#payForm [name="walletPhone"]').fill("3001111111");
    assert.ok(await page.locator("#walletCodeStep").isHidden());
    await page.locator("#requestPaymentCode").click();
    await page.locator('#payForm [name="walletCode"]').fill("123456");
    await page.locator('#payForm [name="consent"]').check();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: path.resolve("qa/pago-daviplata-movil.png"),
    });
    assert.equal(
      await page.evaluate(
        () =>
          document.getElementById("modal").scrollWidth >
          document.getElementById("modal").clientWidth + 1,
      ),
      false,
    );
    const before = (await read()).payments.length;
    await page.locator("#confirmPayment").click();
    await page.locator("#cancelPayment").click();
    await page.waitForTimeout(850);
    assert.equal((await read()).payments.length, before);
    await page.locator("[data-pay]").click();
    await page.locator('#payForm [value="credit"]').check();
    await page.locator("#useTestData").click();
    await page.locator('#payForm [name="cardType"]').selectOption("Débito");
    assert.ok(await page.locator("#installmentsLabel").isHidden());
    await page.locator('#payForm [name="consent"]').check();
    await page.screenshot({ path: path.resolve("qa/pago-tarjeta-movil.png") });
    await page.locator("#cancelPayment").click();
    await page.locator("[data-pay]").click();
    await page.locator('#payForm [value="daviplata"]').check();
    await page.locator("#useTestData").click();
    await page.locator("#requestPaymentCode").click();
    await page.locator('#payForm [name="walletCode"]').fill("123456");
    await page.locator('#payForm [name="consent"]').check();
    await page.locator("#confirmPayment").click();
    await page.waitForSelector("#downloadReceipt");
    state = await read();
    assert.ok(state.payments.at(-1).method.startsWith("Daviplata"));
    assert.equal(state.payments.length, before + 1);
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: los 4 planes, selección repetida, categorías y extras; pago directo; validaciones de tarjeta/caducidad; rechazo y reintento; cuotas; Nequi y Daviplata con OTP y cambio de celular; cancelar durante procesamiento; débito; pagos sin datos bancarios persistidos, sin conexiones remotas ni errores JS.",
    );
  } finally {
    await browser?.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
