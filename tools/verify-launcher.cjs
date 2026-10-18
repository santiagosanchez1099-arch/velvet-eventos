const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const children = new Set(),
  blockers = new Set();
function launch(preferred, entry = "tools/start-demo.cjs", bat = false) {
  const child = spawn(
    bat ? '"' + path.join(root, "ABRIR-VELVET.bat") + '"' : process.execPath,
    bat ? [] : [entry],
    {
      cwd: bat ? path.dirname(root) : root,
      env: {
        ...process.env,
        VELVET_NO_BROWSER: "1",
        VELVET_PORT: String(preferred),
      },
      windowsHide: true,
      shell: bat,
    },
  );
  child.log = "";
  child.stdout.on("data", (x) => (child.log += x));
  child.stderr.on("data", (x) => (child.log += x));
  child.finished = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  children.add(child);
  return child;
}
async function waitReady(child) {
  const end = Date.now() + 15000;
  while (Date.now() < end) {
    const match = child.log.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) return Number(match[1]);
    if (child.exitCode !== null) throw Error(child.log);
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  throw Error("No inicio: " + child.log);
}
async function finish(child) {
  const code = await Promise.race([
    child.finished,
    new Promise((_, reject) => {
      const timer = setTimeout(
        () => reject(Error("No termino: " + child.log)),
        15000,
      );
      timer.unref();
    }),
  ]);
  children.delete(child);
  return code;
}
async function stop(child) {
  child.kill();
  await child.finished;
  children.delete(child);
}
function get(port, route = "/") {
  return new Promise((resolve, reject) =>
    http
      .get(`http://127.0.0.1:${port}${route}`, (res) => {
        let text = "";
        res.on("data", (x) => (text += x));
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, text }),
        );
      })
      .on("error", reject),
  );
}
async function block(port, silent = false) {
  const server = http.createServer((req, res) => {
    if (silent) return;
    res.setHeader("X-Velvet-Demo", "1");
    res.setHeader("X-Velvet-Instance", "a-different-project-folder");
    res.end("Otra copia del proyecto");
  });
  const sockets = new Set();
  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.on("close", () => sockets.delete(socket));
  });
  server.sockets = sockets;
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  blockers.add(server);
  return server;
}
async function unblock(server) {
  server.sockets.forEach((s) => s.destroy());
  await new Promise((resolve) => server.close(resolve));
  blockers.delete(server);
}
(async () => {
  try {
    // Let the OS allocate an isolated test port. Never stop or claim port 4173.
    const reservation = await block(0);
    const base = reservation.address().port;
    assert.ok(base < 65525);
    await unblock(reservation);
    let first = launch(base);
    assert.equal(await waitReady(first), base);
    const response = await get(base);
    assert.equal(response.status, 200);
    assert.equal(response.headers["x-velvet-demo"], "1");
    assert.match(response.headers["x-velvet-instance"], /^[a-f0-9]{64}$/);
    for (const route of ["/cuenta.html", "/demo.js", "/assets/eventos.mp4"])
      assert.equal((await get(base, route)).status, 200);
    const duplicate = launch(base);
    assert.equal(await finish(duplicate), 0, duplicate.log);
    assert.ok(duplicate.log.includes("ya esta funcionando"), duplicate.log);
    assert.ok(duplicate.log.includes(":" + base));
    await stop(first);
    const other = await block(base);
    first = launch(base, "serve.cjs");
    assert.equal(await waitReady(first), base + 1);
    assert.equal((await get(base)).text, "Otra copia del proyecto");
    assert.equal(
      (await get(base + 1)).headers["x-velvet-instance"],
      response.headers["x-velvet-instance"],
    );
    const duplicateFallback = launch(base);
    assert.equal(await finish(duplicateFallback), 0, duplicateFallback.log);
    assert.ok(duplicateFallback.log.includes("ya esta funcionando"));
    assert.ok(duplicateFallback.log.includes(":" + (base + 1)));
    await stop(first);
    await unblock(other);
    // Multiple busy ports, an unresponsive server, and OS-selected fallback.
    for (let i = 0; i < 10; i++) await block(base + i, i === 4);
    first = launch(base);
    const actual = await waitReady(first);
    assert.ok(actual < base || actual >= base + 10, first.log);
    assert.equal((await get(actual)).status, 200);
    await stop(first);
    const invalid = launch("invalid");
    assert.equal(await finish(invalid), 1);
    assert.ok(invalid.log.includes("entre 1024 y 65535"));
    console.log(
      "OK: servidor y video; reutiliza solo esta copia; evita otra copia de Velvet; serve.cjs usa puerto alternativo; doble clic reutiliza ese puerto; diez puertos ocupados; servidor sin respuesta; puerto automatico del sistema; configuracion invalida. Sin detener la demo existente ni abrir navegadores.",
    );
  } finally {
    for (const child of children) {
      if (child.exitCode === null) child.kill();
      await child.finished.catch(() => {});
    }
    for (const server of [...blockers]) await unblock(server);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
