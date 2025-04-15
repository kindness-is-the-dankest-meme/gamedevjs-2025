import { STATUS_TEXT, type StatusCode } from "jsr:@std/http/status";
import { extname, format, join, parse, type ParsedPath } from "jsr:@std/path";
import { transform } from "https://esm.sh/@swc/wasm-typescript@1.11.21";

type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

const fres: F<typeof Response> = (body, init) => new Response(body, init);
const stat = (code: StatusCode) =>
  fres(`${code} ${STATUS_TEXT[code]}`, {
    status: code,
    statusText: STATUS_TEXT[code],
  });

const furl: F<typeof URL> = (url, base) => new URL(url, base);
const walk = async function* (
  dir: string,
  base: string
): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(furl(dir, base))) {
    if (entry.isDirectory) {
      yield* walk(join(dir, entry.name), base);
    }

    if (entry.isFile) {
      yield join(dir, entry.name);
    }
  }
};
const fs = await Array.fromAsync(walk("public", Deno.mainModule));

const MIME_TYPE = {
  [".css"]: "text/css",
  [".html"]: "text/html",
  [".js"]: "text/javascript",
} as const;

const rope = (path: URL) =>
  Deno.open(path, { read: true }).then(({ readable }) => readable);

const rile = (path: URL) =>
  Deno.readTextFile(path)
    .then((contents) => transform(contents))
    /**
     * replace the trailing `ts` with `js` for any "double-quoted" string that
     * starts with `.` and ends with `ts`
     */
    .then(({ code }) => code.replace(/"(\..*)\.ts"/g, '"$1.js"'));

const mapf = (url: string): [ParsedPath, string] => {
  const parsed = parse(decodeURIComponent(furl(url).pathname));
  let { ext, name } = parsed;

  if (ext === ".js") {
    ext = ".ts";
  }

  if (name === "") {
    ext = ".html";
    name = "index";
  }

  return [
    parsed,
    format({
      base: name + ext,
      dir: "public",
      ext,
      name,
      root: "/",
    }),
  ];
};

export const hreq = async ({ url }: Request): Promise<Response> => {
  const [{ dir }, path] = mapf(url),
    ext = extname(path);

  if (dir !== "/") return stat(403);
  if (!fs.includes(path)) return stat(404);

  switch (ext) {
    case ".css":
    case ".html": {
      return fres(await rope(furl(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[ext] },
      });
    }

    case ".ts": {
      return fres(await rile(furl(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[".js"] },
      });
    }
  }

  return stat(501);
};
