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
      missing = [],
      remote = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) missing.push(r.url());
    });
    page.on("request", (r) => {
      if (
        !r.url().startsWith("http://127.0.0.1:4173") &&
        !r.url().startsWith("data:")
      )
        remote.push(r.url());
    });
    await page.goto("http://127.0.0.1:4173");
    for (let load = 0; load < 2; load++) {
      if (load) await page.reload();
      await page.waitForSelector("#welcomeDialog[open]");
      const box = await page.locator("#welcomeDialog").boundingBox();
      assert.deepEqual(
        [Math.round(box.width), Math.round(box.height)],
        [1440, 1000],
      );
      assert.equal(
        await page.evaluate(() => VelvetAmbience.isPlaying()),
        false,
      );
      await page.waitForTimeout(800);
      if (!load)
        await page.screenshot({
          path: "qa/presentacion-pantalla-completa.png",
        });
      await page.locator("#enterWelcome").click();
    }
    await page.evaluate(() => Sections.open("ubicacion"));
    const paths = [];
    for (let i = 0; i < 4; i++) {
      await page.locator("#routeOrigin").selectOption(String(i));
      paths.push(await page.locator("#mapRoute").getAttribute("d"));
      const link = new URL(
        await page.locator("#realDirections").getAttribute("href"),
      );
      assert.ok(
        link.searchParams.get("destination").includes("Parque de la 93"),
      );
      assert.ok(link.searchParams.get("origin"));
      assert.equal(
        await page.locator("#realDirections").getAttribute("target"),
        "_blank",
      );
    }
    assert.equal(new Set(paths).size, 4);
    await page.locator("#mapZoomIn").click();
    assert.notEqual(
      await page.locator(".local-map svg").getAttribute("viewBox"),
      "0 0 800 480",
    );
    await page.locator("#mapZoomOut").click();
    assert.equal(
      await page.locator(".local-map svg").getAttribute("viewBox"),
      "0 0 800 480",
    );
    await page.waitForTimeout(900);
    await page.screenshot({ path: "qa/ubicacion-bogota.png" });
    const photos = await page.evaluate(() => Demo.state.photos);
    assert.ok(photos.length >= 31);
    assert.equal(photos.find((p) => p.id === "p6").src, "imagen11.png");
    assert.equal(photos.find((p) => p.id === "p1").category, "Quinceañeras");
    assert.equal(
      await page.evaluate(() => Demo.categories[6].image),
      "graduacion.png",
    );
    // Decode every image, including photos below the viewport.
    const bad = await page.evaluate(async () => {
      const urls = [
        ...new Set([
          ...Demo.state.photos.filter((p) => !p.video).map((p) => p.src),
          ...Demo.categories.map((c) => c.image),
        ]),
      ];
      const outcomes = await Promise.all(
        urls.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(null);
              img.onerror = () => resolve(src);
              img.src = src;
            }),
        ),
      );
      return outcomes.filter(Boolean);
    });
    assert.deepEqual(bad, []);
    await page.evaluate(() => Sections.open("galeria"));
    await page.locator('[data-gallery="Grados"]').click();
    assert.equal(await page.locator("#galleryGrid .gallery-item").count(), 2);
    await page.locator('[data-photo="cur-grados"]').click();
    await page.locator("#inspireQuote").click();
    assert.equal(
      await page.locator("#eventCategory").inputValue(),
      "Graduación de bachillerato",
    );
    assert.equal(new URL(page.url()).hash, "#personaliza");
    await page.evaluate(() => Sections.open("paquetes"));
    await page.locator('[data-package="premium"]').click();
    assert.equal(await page.locator("#eventPackage").inputValue(), "premium");
    assert.equal(await page.locator("#continuePlan").count(), 0);
    await page.evaluate(() => Sections.open("galeria"));
    await page.locator('[data-gallery="Familia"]').click();
    await page.locator("#galeria").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: "qa/galeria-familia-corregida.png" });
    // Create a contact sheet in the browser without modifying the generated images.
    const audit = await browser.newPage({
      viewport: { width: 1440, height: 600 },
    });
    await audit.goto("http://127.0.0.1:4173");
    await audit.setContent(
      `<body style="margin:0;display:grid;grid-template-columns:repeat(4,1fr);background:#eee;font:14px Arial">${["bautizo", "comunion", "romance", "adultos"].map((n) => `<figure style="margin:8px"><img style="width:100%;height:320px;object-fit:cover" src="http://127.0.0.1:4173/assets/celebracion-${n}.png"><figcaption>${n}</figcaption></figure>`).join("")}</body>`,
    );
    await audit.waitForTimeout(700);
    await audit.screenshot({ path: "qa/nuevas-imagenes.png" });
    await audit.close();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ["inicio", "galeria", "personaliza", "ubicacion"]) {
        await page.evaluate(
          (id) => (id === "inicio" ? Sections.close() : Sections.open(id)),
          id,
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          ),
          false,
          `${id}: ${width}`,
        );
      }
      if (width === 390) {
        await page.evaluate(() => Sections.open("ubicacion"));
        await page.waitForTimeout(900);
        await page.screenshot({ path: "qa/ubicacion-movil.png" });
        assert.ok(await page.locator(".mobile-quickbar").isVisible());
        const bar = await page.locator(".mobile-quickbar").boundingBox();
        const chat = await page.locator(".assistant-launcher").boundingBox();
        assert.ok(chat.y + chat.height < bar.y);
      }
    }
    await page.reload();
    await page.waitForSelector("#welcomeDialog[open]");
    await page.waitForSelector("#welcomeDialog", {
      state: "detached",
      timeout: 7000,
    });
    const video = await page.evaluate(() => {
      const v = document.querySelector("#heroVideo");
      return {
        width: v.videoWidth,
        height: v.videoHeight,
        duration: v.duration,
        ready: v.readyState,
      };
    });
    assert.equal(video.width, 1280);
    assert.equal(video.height, 720);
    assert.ok(video.duration >= 12 && video.duration < 14 && video.ready >= 2);
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    assert.deepEqual(remote, []);
    console.log(
      "OK: full-screen welcome on entry/reload/auto-close, 4 map origins, zoom and route links, 31 local media, image decoding, gallery to quote, direct plans, 5 screen widths, mobile quick actions, steady video playback. No missing resources, JS errors or automatic remote requests.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
