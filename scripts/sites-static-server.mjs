import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd().endsWith("/dist") ? process.cwd() : join(process.cwd(), "dist");
const port = Number(process.env.PORT ?? 3000);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
]);

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = safePath === "/" ? "index.html" : safePath.replace(/^\/+/, "");

  return join(root, filePath.endsWith("/") ? `${filePath}index.html` : filePath);
}

const server = createServer(async (request, response) => {
  try {
    const filePath = resolvePath(request.url ?? "/");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
    });
    response.end(body);
  } catch {
    const body = await readFile(join(root, "404.html"));
    response.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    response.end(body);
  }
});

server.listen(port, () => {
  console.log(`ACA static server listening on ${port}`);
});
