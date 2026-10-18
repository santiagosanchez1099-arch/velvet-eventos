const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { openBrowser: launchBrowser } = require("./open-browser.cjs");
const server = require("../serve.cjs");
const host = "127.0.0.1";

async function openBrowser(url) {
  console.log(
    "\nAbre esta direccion si el navegador no se abre automaticamente:",
  );
  console.log(url);
  try {
    const file = path.resolve(__dirname, "../ABRIR-ENLACE.html");
    fs.writeFileSync(
      file,
      `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Abrir Velvet Studio</title><style>body{font:18px system-ui;background:#291626;color:#fff2de;max-width:650px;margin:12vh auto;padding:30px}a{display:block;padding:20px;background:#f3cb94;color:#291626;border-radius:12px;margin:25px 0;overflow-wrap:anywhere}p{line-height:1.7}</style><h1>Tu demo esta lista</h1><p>Abriendo Velvet Studio. Si no continua automaticamente, pulsa el enlace:</p><a href="${url}">${url}</a><p>Deja abierta la ventana del servidor mientras usas la web.</p><script>location.replace(${JSON.stringify(url)});</script></html>`,
      "utf8",
    );
    console.log(
      "Tambien puedes hacer doble clic en ABRIR-ENLACE.html dentro de esta carpeta.",
    );
  } catch {
    console.log(
      "No se pudo crear ABRIR-ENLACE.html. Usa la direccion mostrada arriba.",
    );
  }
  if (process.env.VELVET_NO_BROWSER === "1") {
    console.log("Apertura automatica desactivada por VELVET_NO_BROWSER=1.");
    return;
  }
  const accepted = await launchBrowser(url);
  console.log(
    accepted
      ? "Se envio la solicitud al navegador predeterminado. Si no aparece, usa ABRIR-ENLACE.html o copia la direccion."
      : "Windows no pudo abrir el navegador. Abre ABRIR-ENLACE.html o copia la direccion en Chrome o Edge.",
  );
}

function isThisCopy(port) {
  return new Promise((resolve) => {
    const request = http.request(
      {
        hostname: host,
        port,
        path: "/index.html",
        method: "HEAD",
        timeout: 800,
      },
      (response) => {
        const same =
          response.statusCode === 200 &&
          response.headers["x-velvet-demo"] === "1" &&
          response.headers["x-velvet-instance"] === server.velvetInstance;
        response.resume();
        resolve(same);
      },
    );
    request.on("timeout", () => request.destroy());
    request.on("error", () => resolve(false));
    request.end();
  });
}

function listen(port) {
  return new Promise((resolve, reject) => {
    function cleanup() {
      server.off("error", onError);
      server.off("listening", onReady);
    }
    function onError(error) {
      cleanup();
      reject(error);
    }
    function onReady() {
      cleanup();
      resolve(server.address().port);
    }
    server.once("error", onError);
    server.once("listening", onReady);
    server.listen(port, host);
  });
}

async function start() {
  const preferred = Number(process.env.VELVET_PORT || 4173);
  if (!Number.isInteger(preferred) || preferred < 1024 || preferred > 65535) {
    console.error("VELVET_PORT debe ser un numero entre 1024 y 65535.");
    process.exitCode = 1;
    return;
  }
  try {
    for (let attempt = 0; attempt <= 10; attempt++) {
      // Bind directly instead of checking for a free port first, avoiding a race.
      const port =
        attempt === 10 || preferred + attempt > 65535 ? 0 : preferred + attempt;
      try {
        const actual = await listen(port);
        console.log("VELVET STUDIO - DEMOSTRACION LOCAL");
        console.log(
          "\nLa web esta lista. Esta ventana mantiene la web funcionando.",
        );
        console.log(
          "Puedes minimizarla. Para detener la web, cierra esta ventana o pulsa Ctrl+C.",
        );
        console.log("\nCuenta de ejemplo: laura@demo.local (sin contrasena).");
        console.log("Todos los pagos y datos son simulados.");
        await openBrowser(`http://${host}:${actual}`);
        return;
      } catch (error) {
        if (port === 0 || !["EADDRINUSE", "EACCES"].includes(error.code))
          throw error;
        if (error.code === "EADDRINUSE" && (await isThisCopy(port))) {
          console.log(
            "Velvet Studio ya esta funcionando en esta carpeta. Abriremos esa misma web.",
          );
          console.log(
            "Puedes cerrar esta segunda ventana; conserva la ventana original del servidor.",
          );
          await openBrowser(`http://${host}:${port}`);
          return;
        }
        console.log(
          `El puerto ${port} no esta disponible. Buscando otro automaticamente...`,
        );
      }
    }
  } catch (error) {
    console.error("No pudimos iniciar la web:", error.message);
    console.error(
      "Comprueba que extrajiste toda la carpeta y que el equipo permite ejecutar servidores locales.",
    );
    process.exitCode = 1;
  }
}

module.exports = { start };
if (require.main === module) start();
