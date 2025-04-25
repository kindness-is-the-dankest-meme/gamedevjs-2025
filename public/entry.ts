import get from "https://esm.sh/lodash-es@4.17.21/get.js";
import { z } from "https://esm.sh/zod@3.24.3";
import { caf, forEach, fromEvent, isArray, raf } from "./lib/free.ts";
import { grow, nmap } from "./app/trees.ts";

declare const m: HTMLElement;

let frameId = 0;

const Patch = z.object({
  op: z.enum(["add", "remove", "replace"]),
  path: z.array(
    z.union([
      z.enum(["tag", "props", "children"]),
      z.number(),
      z.string(),
    ]),
  ),
  value: z.any(),
});

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener("error", (e) => console.error(e));
worky.addEventListener("messageerror", (e) => console.error(e));
worky.addEventListener(
  "message",
  ({ data }) => {
    caf(frameId);
    frameId = raf(() => {});

    const { success, data: patch, error } = Patch.safeParse(data);
    if (!success) {
      console.error(error);
      console.info({ data });
      return;
    }

    const { op, path, value } = patch;
    switch (op) {
      case "add": {
        if (path.includes("props")) {
          get(m, path.slice(0, path.indexOf("props")))
            ?.setAttribute(
              nmap(path.at(-1)),
              String(value),
            );

          return;
        }

        if (path.includes("children")) {
          get(m, path.slice(0, path.lastIndexOf("children")), m).appendChild(
            grow(
              isArray(value) ? { tag: null, children: value } : value,
            ),
          );

          return;
        }

        console.log(patch);
        break;
      }

      case "replace": {
        if (path.includes("props")) {
          get(m, path.slice(0, path.indexOf("props")))
            ?.setAttribute(
              nmap(path.at(-1)),
              String(value),
            );

          return;
        }

        if (path.includes("children")) {
          get(m, path.slice(0, path.lastIndexOf("children")), m)
            .replaceChildren(
              grow(
                isArray(value) ? { tag: null, children: value } : value,
              ),
            );

          return;
        }

        console.log(patch);
        break;
      }

      case "remove": {
        if (path.includes("props")) {
          get(m, path.slice(0, path.indexOf("props")))
            ?.removeAttribute(
              nmap(path.at(-1)),
            );

          return;
        }

        if (path.includes("children")) {
          get(m, path)?.remove();
          return;
        }

        console.log(patch);
        break;
      }

      default: {
        console.log(patch);
      }
    }
  },
);

const InnerSize = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

forEach(fromEvent(globalThis, "resize"), ({ target, type }) => {
  const { width, height } = InnerSize.parse(target);
  worky.postMessage({ type, width, height });
});

const dispatchResize = () => globalThis.dispatchEvent(new Event("resize"));
forEach(fromEvent(m, "click"), dispatchResize);
dispatchResize();
