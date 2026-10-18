const { spawn } = require("node:child_process");
const http = require("node:http");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, ".."),
  env = { ...process.env, VELVET_NO_BROWSER: "1" };
function launch(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: root,
    env,
    windowsHide: true,
    ...options,
  });
  child.log = "";
  child.stdout.on("data", (x) => (child.log += x));
  child.stderr.on("data", (x) => (child.log += x));
  child.finished = new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code) => resolve(code));
  });
  return child;
}
function waitReady(child) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(Error("No inicio: " + child.log)),
      10000,
    );
    function check() {
      if (child.log.includes("La web esta lista")) {
        clearTimeout(timer);
        resolve();
      } else if (child.exitCode !== null) {
        clearTimeout(timer);
        reject(Error(child.log));
      } else setTimeout(check, 50);
    }
    check();
  });
}
function get(route = "/") {
  return new Promise((resolve, reject) =>
    http
      .get("http://127.0.0.1:4173" + route, (res) => {
        let text = "";
        res.on("data", (x) => (text += x));
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, text }),
        );
      })
      .on("error", reject),
  );
}
(async () => {
  let first, other;
  try {
    first = launch(process.execPath, ["tools/start-demo.cjs"]);
    await waitReady(first);
    let response = await get();
    assert.equal(response.status, 200);
    assert.equal(response.headers["x-velvet-demo"], "1");
    assert.ok(response.text.includes("Velvet"));
    for (const route of ["/cuenta.html", "/demo.js", "/assets/eventos.mp4"])
      assert.equal((await get(route)).status, 200);
    const duplicate = launch(
      '"' + path.join(root, "ABRIR-VELVET.bat") + '"',
      [],
      { shell: true, cwd: path.dirname(root) },
    );
    assert.equal(await duplicate.finished, 0, duplicate.log);
    assert.ok(duplicate.log.includes("ya esta funcionando"), duplicate.log);
    assert.ok(duplicate.log.includes("4173"));
    first.kill();
    await first.finished;
    first = null;
    other = http.createServer((req, res) => res.end("Otra aplicacion"));
    await new Promise((resolve, reject) => {
      other.once("error", reject);
      other.listen(4173, "127.0.0.1", resolve);
    });
    const conflict = launch(process.execPath, ["tools/start-demo.cjs"]);
    assert.equal(await conflict.finished, 1);
    assert.ok(conflict.log.includes("otra aplicacion"), conflict.log);
    await new Promise((resolve) => other.close(resolve));
    other = null;
    console.log(
      "OK: iniciador arranca servidor, rutas y video; BAT desde una carpeta distinta con espacios; segundo doble clic reutiliza la web; puerto ajeno muestra instrucciones. No se abrieron navegadores durante la prueba.",
    );
  } finally {
    if (first) {
      first.kill();
      await first.finished;
    }
    if (other) await new Promise((resolve) => other.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
