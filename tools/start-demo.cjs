const http = require("node:http");
const { execFile } = require("node:child_process");
const server = require("../serve.cjs");
const url = "http://127.0.0.1:4173";

function openBrowser() {
  console.log(
    "\nAbre esta direccion si el navegador no se abre automaticamente:",
  );
  console.log(url);
  if (process.env.VELVET_NO_BROWSER === "1") return;
  const command =
    process.platform === "win32"
      ? "rundll32.exe"
      : process.platform === "darwin"
        ? "open"
        : "xdg-open";
  const args =
    process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url];
  execFile(command, args, { windowsHide: true }, (error) => {
    if (error)
      console.log("Puedes copiar la direccion anterior en tu navegador.");
  });
}

function inspectExisting() {
  const request = http.get(url, { timeout: 2500 }, (response) => {
    const isVelvet =
      response.statusCode === 200 && response.headers["x-velvet-demo"] === "1";
    response.resume();
    if (isVelvet) {
      console.log(
        "Velvet Studio ya esta funcionando. Abriremos esa misma web.",
      );
      console.log(
        "Puedes cerrar esta segunda ventana; conserva la ventana original del servidor.",
      );
      openBrowser();
    } else {
      console.error(
        "El puerto 4173 esta ocupado por otra aplicacion o una version anterior.",
      );
      console.error(
        "Cierra el servidor anterior, si lo tienes abierto, y vuelve a hacer doble clic en ABRIR-VELVET.bat.",
      );
      process.exitCode = 1;
    }
  });
  request.on("timeout", () => request.destroy(new Error("timeout")));
  request.on("error", () => {
    console.error("El puerto 4173 esta ocupado y no pudimos comprobar la web.");
    console.error("Cierra el servidor anterior y vuelve a intentarlo.");
    process.exitCode = 1;
  });
}

server.once("error", (error) => {
  if (error.code === "EADDRINUSE") return inspectExisting();
  console.error("No pudimos iniciar la web:", error.message);
  console.error(
    "Comprueba que extrajiste toda la carpeta antes de abrir ABRIR-VELVET.bat.",
  );
  process.exitCode = 1;
});
server.listen(4173, "127.0.0.1", () => {
  console.log("VELVET STUDIO - DEMOSTRACION LOCAL");
  console.log("\nLa web esta lista. Esta ventana mantiene la web funcionando.");
  console.log(
    "Puedes minimizarla. Para detener la web, cierra esta ventana o pulsa Ctrl+C.",
  );
  console.log("\nCuenta de ejemplo: laura@demo.local (sin contrasena).");
  console.log("Todos los pagos y datos son simulados.");
  openBrowser();
});
