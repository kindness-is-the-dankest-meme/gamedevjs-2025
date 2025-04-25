import { entries, fcev } from "../lib/free.ts";
import type { ChE, El, Props } from "../lib/real.ts";
import { svgs } from "./constants.ts";
import { amap, tapl } from "./utils.ts";

export const nmap = amap({
  htmlFor: "for",
  key: "data-key",
});

// TODO: serialize some other event properties
const omap = (n: string) => ({ type, x, y }: MouseEvent) =>
  globalThis.dispatchEvent(
    fcev("send", { detail: { callback: n, args: [{ type, x, y }] } }),
  );

export const spur = (n: Node, cs: ChE[] | undefined): Node => (
  cs && cs.forEach((c) => n.appendChild(grow(c))), n
);

export const twig = (n: Element, ps: Props | null | undefined): Element => (
  ps &&
  entries(ps).forEach(([k, v]) =>
    k.startsWith("on")
      ? n.addEventListener(k.substring(2).toLowerCase(), omap(v))
      : n.setAttribute(nmap(k), String(v))
  ), n
);

export const limb = (tag: string): Element =>
  document.createElementNS(
    svgs.includes(tag)
      ? "http://www.w3.org/2000/svg"
      : "http://www.w3.org/1999/xhtml",
    tag,
  );

export const tuft = () => document.createDocumentFragment();

export const tree = ({ tag, props, children }: El): Node => {
  switch (typeof tag) {
    /**
     * `typeof tag` is never actually `"function"` at this point, it's always
     * already been interpreted by now, but the type of `El["tag"]` includes the
     * function `Tag` type
     *
     * `typeof tag` is only `"object"` if `tag` is `null` , so this branch
     * really _only_ handles document fragments
     */
    case "function":
    case "object": {
      return spur(tuft(), children);
    }

    case "string": {
      return spur(twig(limb(tag), props), children);
    }
  }
};

export const leaf = (t: string): Text => document.createTextNode(t);

export const grow = (el: El | string): Node => {
  switch (typeof el) {
    case "object": {
      return tree(el);
    }

    case "string": {
      return leaf(el);
    }
  }
};
