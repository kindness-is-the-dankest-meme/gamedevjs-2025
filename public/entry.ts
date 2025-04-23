import get from "https://esm.sh/lodash-es@4.17.21/get.js";
import { z } from "https://esm.sh/zod@3.24.3";
import type { Child, El, Props, Tag } from "./lib/real.ts";
import {
  assign,
  caf,
  entries,
  from,
  fromEntries,
  isArray,
  raf,
} from "./lib/free.ts";

declare const m: HTMLElement;

const amap = (ns: Record<string, string>) => (n: unknown): string =>
  ns[String(n)] ?? String(n);
const mapn = amap({
  class: "className",
});
const nmap = amap({
  htmlFor: "for",
  key: "data-key",
});

const peek = (as: NamedNodeMap): { [k: string]: unknown } =>
  fromEntries(from(as, ({ name, value }) => [mapn(name), value]));

const trim = (x: string, start: boolean, end: boolean) =>
  start ? x.trimStart() : end ? x.trimEnd() : x;

const children = (
  acc: Child[],
  node: ChildNode,
  i: number,
  { length }: Array<ChildNode>,
): Child[] => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      acc.push(scan(node as Element));
      break;
    }

    case Node.TEXT_NODE: {
      const { data } = node as Text;

      /**
       * skip text nodes that are a newline followed by all whitespace, this
       * actually results in some whitespace collapsing when inline elements are
       * on separate lines in the document
       */
      if (/^\n\s*$/.test(data)) {
        break;
      }

      /**
       * trim whitespace from the begining of "first" text nodes and from
       * the end of "last" text nodes
       */
      acc.push(trim(data, i === 0, i === length - 1));
      break;
    }
  }

  return acc;
};

const scan = (el: Element | HTMLCollection | NodeListOf<ChildNode>): El =>
  el instanceof Element
    ? assign(
      { tag: el.tagName.toLowerCase() as Tag },
      el.attributes.length && { props: peek(el.attributes) },
      el.childNodes.length && {
        children: el.childNodes.values().toArray().reduce(children, []),
      },
    )
    : el instanceof HTMLCollection
    ? assign(
      { tag: null },
      el.length && { children: from(el).reduce(children, []) },
    )
    : assign(
      { tag: null },
      el.length && { children: el.values().toArray().reduce(children, []) },
    );

// TODO: this should be initial state of the view, only accepting the `children`
// case might solve the whitespace problem
// console.log(scan(m.children));

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
// worky.postMessage(scan(m.childNodes));

const svgs: string[] = [
  // "a",
  // "animate",
  // "animateMotion",
  // "animateTransform",
  // "circle",
  // "clipPath",
  "defs",
  // "desc",
  // "ellipse",
  // "feBlend",
  // "feColorMatrix",
  // "feComponentTransfer",
  // "feComposite",
  // "feConvolveMatrix",
  // "feDiffuseLighting",
  // "feDisplacementMap",
  // "feDistantLight",
  // "feDropShadow",
  // "feFlood",
  // "feFuncA",
  // "feFuncB",
  // "feFuncG",
  // "feFuncR",
  // "feGaussianBlur",
  // "feImage",
  // "feMerge",
  // "feMergeNode",
  // "feMorphology",
  // "feOffset",
  // "fePointLight",
  // "feSpecularLighting",
  // "feSpotLight",
  // "feTile",
  // "feTurbulence",
  // "filter",
  // "foreignObject",
  "g",
  // "image",
  // "line",
  // "linearGradient",
  // "marker",
  // "mask",
  // "metadata",
  // "mpath",
  "path",
  // "pattern",
  // "polygon",
  // "polyline",
  // "radialGradient",
  "rect",
  // "script",
  // "set",
  // "stop",
  // "style",
  "svg",
  // "switch",
  // "symbol",
  // "text",
  // "textPath",
  // "title",
  // "tspan",
  "use",
  // "view",
] as const;

const spur = (n: Node, cs: Child[] | undefined): Node => (
  cs && cs.forEach((c) => n.appendChild(grow(c))), n
);

const twig = (n: Element, ps: Props | null | undefined): Element => (
  ps && entries(ps).forEach(([k, v]) => n.setAttribute(nmap(k), String(v))), n
);

const limb = (tag: string): Element =>
  document.createElementNS(
    svgs.includes(tag)
      ? "http://www.w3.org/2000/svg"
      : "http://www.w3.org/1999/xhtml",
    tag,
  );

const tuft = () => document.createDocumentFragment();

const tree = ({ tag, props, children }: El): Node => {
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

const leaf = (t: string): Text => document.createTextNode(t);

const grow = (el: El | string): Node => {
  switch (typeof el) {
    case "object": {
      return tree(el);
    }

    case "string": {
      return leaf(el);
    }
  }
};

const InnerSize = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

globalThis.addEventListener("resize", ({ target, type }) => {
  const { width, height } = InnerSize.parse(target);
  worky.postMessage({ type, width, height });
});

const dispatchResize = () => globalThis.dispatchEvent(new Event("resize"));
m.addEventListener("click", dispatchResize);
dispatchResize();
