const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const root = __dirname;
const instance = createHash("sha256")
  .update(
    process.platform === "win32"
      ? fs.realpathSync(root).toLowerCase()
      : fs.realpathSync(root),
  )
  .digest("hex");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
};
const server = http.createServer((req, res) => {
  res.setHeader("X-Velvet-Demo", "1");
  res.setHeader("X-Velvet-Instance", instance);
  let name;
  try {
    name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const file = path.resolve(root, "." + (name === "/" ? "/index.html" : name));
  if (!file.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404).end("No encontrado");
      return;
    }
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d+)-(\d*)/.exec(range);
      if (!m) {
        res.writeHead(416).end();
        return;
      }
      const start = Number(m[1]),
        end = m[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      if (start >= stat.size || start > end) {
        res.writeHead(416).end();
        return;
      }
      res.writeHead(206, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
      });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes",
      });
      fs.createReadStream(file).pipe(res);
    }
  });
});

module.exports = server;
server.velvetInstance = instance;
if (require.main === module) {
  require("./tools/start-demo.cjs").start();
}
