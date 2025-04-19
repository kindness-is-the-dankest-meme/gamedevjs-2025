import initSwc, {
  type Options,
  transform,
} from "https://esm.sh/@swc/wasm-web@1.11.21";
import { STATUS_TEXT, type StatusCode } from "jsr:@std/http/status";
import { extname, format, join, normalize, parse } from "jsr:@std/path";

type F<T> = T extends new (...args: infer A) => infer R ? (...args: A) => R
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
  base: string,
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

const pext = (path: URL) => extname(path.pathname);
/**
 * insert `import { el } from "./lib/real.ts";` for `tsx` files because we're
 * using swc's `"pragma"` transform in `swco`
 *
 * @see https://github.com/swc-project/swc/issues/2663
 */
const isrc = (path: URL, code: string) =>
  pext(path) === ".tsx" ? `import { el } from "./lib/real.ts";\n${code}` : code;
/**
 * replace the trailing `ts` or `tsx` with `js` for any "double-quoted" string
 * matches that start with `.` and end with `ts` or `tsx`
 */
const rsfx = (code: string) => code.replace(/"(\..*)\.tsx?"/g, '"$1.js"');
const rexp = (code: string) => code.replace(/\nexport { };/g, "");

await initSwc();
const swco: Options = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    // @ts-expect-error these types are just not up to date
    target: "es2024",
    loose: false,
    minify: {
      compress: false,
      mangle: false,
    },
    transform: {
      react: {
        pragma: "el",
      },
    },
  },
  module: {
    type: "es6",
  },
  minify: false,
  isModule: true,
};
const rile = (path: URL) =>
  Deno.readTextFile(path)
    .then((contents) => transform(contents, swco))
    .then(({ code }) => rexp(rsfx(isrc(path, code))));

const frmt = (dir: string, name: string, ext: string) =>
  normalize(
    format({
      base: name + ext,
      dir: join("public", dir),
      ext,
      name,
      root: "/",
    }),
  );
const mapf = (url: string): [dir: string, ext: string, path: string] => {
  const parsed = parse(decodeURIComponent(furl(url).pathname)),
    { dir } = parsed;
  let { ext, name } = parsed;

  if (ext === ".js") {
    // assume `tsx` if we don't match on `ts`
    ext = fs.includes(frmt(dir, name, ".ts")) ? ".ts" : ".tsx";
  }

  if (name === "") {
    ext = ".html";
    name = "index";
  }

  return [dir, ext, frmt(dir, name, ext)];
};

export const hreq = async ({ url }: Request): Promise<Response> => {
  const [dir, ext, path] = mapf(url);

  if (!dir.startsWith("/")) return stat(403);
  if (!fs.includes(path)) return stat(404);

  switch (ext) {
    case ".css":
    case ".html": {
      return fres(await rope(furl(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[ext] },
      });
    }

    case ".ts":
    case ".tsx": {
      return fres(await rile(furl(path, Deno.mainModule)), {
        headers: { ["Content-Type"]: MIME_TYPE[".js"] },
      });
    }
  }

  return stat(501);
};
