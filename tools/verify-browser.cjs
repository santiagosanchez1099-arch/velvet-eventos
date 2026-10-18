const assert = require("node:assert/strict");
const { openBrowser } = require("./open-browser.cjs");
(async () => {
  const url = "http://127.0.0.1:4317";
  let calls = [];
  assert.equal(
    await openBrowser(url, {
      platform: "win32",
      execute: async (...args) => {
        calls.push(args);
      },
    }),
    true,
  );
  assert.deepEqual(calls[0].slice(0, 2), [
    "cmd.exe",
    ["/d", "/c", "start", "", url],
  ]);
  assert.equal(calls.length, 1);
  calls = [];
  assert.equal(
    await openBrowser(url, {
      platform: "win32",
      execute: async (...args) => {
        calls.push(args);
        if (calls.length === 1) throw Error("handler failure");
      },
    }),
    true,
  );
  assert.equal(calls.length, 2);
  assert.equal(calls[1][0], "powershell.exe");
  assert.ok(calls[1][1].at(-1).includes(url));
  assert.equal(
    await openBrowser(url, {
      platform: "win32",
      execute: async () => {
        throw Error("unavailable");
      },
    }),
    false,
  );
  await assert.rejects(
    () =>
      openBrowser("http://evil.example/ & calc", {
        execute: async () => {
          throw Error("should not run");
        },
      }),
    /no valida/,
  );
  for (const platform of ["darwin", "linux"]) {
    calls = [];
    assert.equal(
      await openBrowser(url, {
        platform,
        execute: async (...args) => calls.push(args),
      }),
      true,
    );
    assert.equal(calls[0][0], platform === "darwin" ? "open" : "xdg-open");
  }
  console.log(
    "OK: solicitud Windows con start, segundo intento con PowerShell, fallo controlado sin detener servidor, validacion de direccion local y rutas Mac/Linux.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
