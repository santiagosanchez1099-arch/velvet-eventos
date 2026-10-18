const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const run = promisify(execFile);

async function openBrowser(url, options = {}) {
  // Only launch the loopback URL constructed by our server, never arbitrary shell text.
  if (!/^http:\/\/127\.0\.0\.1:\d{1,5}\/?$/.test(url))
    throw Error("Direccion local no valida");
  const execute = options.execute || run;
  const platform = options.platform || process.platform;
  const commands =
    platform === "win32"
      ? [
          ["cmd.exe", ["/d", "/c", "start", "", url]],
          [
            "powershell.exe",
            [
              "-NoProfile",
              "-NonInteractive",
              "-Command",
              `Start-Process -FilePath '${url}'`,
            ],
          ],
        ]
      : [[platform === "darwin" ? "open" : "xdg-open", [url]]];
  for (const [command, args] of commands) {
    try {
      await execute(command, args, { windowsHide: true, timeout: 7000 });
      return true;
    } catch {
      // A missing handler or failed command should not stop the demo server.
    }
  }
  return false;
}

module.exports = { openBrowser };
