import { STATUS_TEXT, type StatusCode } from "jsr:@std/http/status";
import { format, join, parse } from "jsr:@std/path";
import initSwc, { transform } from "https://esm.sh/@swc/wasm-web@1.11.20";

type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

const response: F<typeof Response> = (body, init) => new Response(body, init);
const statusResponse = (code: StatusCode) =>
  response(`${code} ${STATUS_TEXT[code]}`, {
    status: code,
    statusText: STATUS_TEXT[code],
  });

const url: F<typeof URL> = (url, base) => new URL(url, base);
const walk = async function* (
  dir: string,
  base: string
): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(url(dir, base))) {
    if (entry.isDirectory) {
      yield* walk(join(dir, entry.name), base);
    }

    if (entry.isFile) {
      yield join(dir, entry.name);
    }
  }
};
const files = await Array.fromAsync(walk("public", Deno.mainModule));

const MIME_TYPE = {
  [".css"]: "text/css",
  [".html"]: "text/html",
  [".js"]: "text/javascript",
} as const;

const readable = (path: URL) =>
  Deno.open(path, { read: true }).then(({ readable }) => readable);

await initSwc();
const compiled = (path: URL) =>
  Deno.readTextFile(path)
    .then((contents) => transform(contents))
    /**
     * replace the trailing `ts` with `js` for any string that starts with `.`
     * and ends with `ts`
     */
    .then(({ code }) => code.replace(/"(\..*)\.ts"/g, '"$1.js"'));

export const handleRequest = async (req: Request): Promise<Response> => {
  const parsed = parse(decodeURIComponent(url(req.url).pathname));
  let { dir, ext, name } = parsed;

  if (dir !== "/") return statusResponse(403);

  if (ext === ".js") {
    ext = ".ts";
  }

  if (name === "") {
    ext = ".html";
    name = "index";
  }

  const path = format({
    base: name + ext,
    dir: "public",
    ext,
    name,
    root: "/",
  });

  if (!files.includes(path)) {
    return statusResponse(404);
  }

  switch (ext) {
    case ".css":
    case ".html": {
      return response(await readable(url(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[ext] },
      });
    }

    case ".ts": {
      return response(await compiled(url(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[".js"] },
      });
    }
  }

  return statusResponse(501);
};
