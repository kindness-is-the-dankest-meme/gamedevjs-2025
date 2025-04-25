import get from "https://esm.sh/lodash-es@4.17.21/get.js";
import { grow, nmap, twig } from "./app/trees.ts";
import { isArray } from "./lib/free.ts";
import type { Patch } from "./types.ts";

declare const m: HTMLElement;

export const patch = ({ op, path, value }: Patch): void => {
  switch (op) {
    case "add": {
      if (path.includes("props")) {
        twig(get(m, path.slice(0, path.indexOf("props"))), {
          [nmap(path.at(-1))]: value,
        });

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
        twig(get(m, path.slice(0, path.indexOf("props"))), {
          [nmap(path.at(-1))]: String(value),
        });

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
          // TODO: handle removing event handlers
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
};
