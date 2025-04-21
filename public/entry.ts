import { z } from "https://esm.sh/zod@3.24.3";
import type { Child, El, Props, Tag } from "./lib/real.ts";

declare const m: HTMLElement;

const { from } = Array;
const { assign, entries, fromEntries } = Object;

const amap = (ns: Record<string, string>) => (n: string) => ns[n] ?? n;
const mapn = amap({
  class: "className",
});
const nmap = amap({
  htmlFor: "for",
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

const scan = (el: Element | NodeListOf<ChildNode>): El =>
  el instanceof Element
    ? assign(
      { tag: el.tagName.toLowerCase() as Tag },
      el.attributes.length && { props: peek(el.attributes) },
      el.childNodes.length && {
        children: el.childNodes.values().toArray().reduce(children, []),
      },
    )
    : assign(
      { tag: null },
      el.length && { children: el.values().toArray().reduce(children, []) },
    );

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener(
  "message",
  ({ data }) => (m.firstChild ? m.replaceChildren : m.appendChild)(grow(data)),
);
worky.postMessage(scan(m.childNodes));

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
    // n.b. `typeof tag` is never actually `"function"` at this point, it's
    // always already been interpreted by now, but the type of `El["tag"]`
    // includes the function type of Tag
    case "function":
    // n.b. `typeof tag` is only `"object"` if `tag` is `null`
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

const Size = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

globalThis.addEventListener("resize", ({ target, type }) => {
  const { width, height } = Size.parse(target);
  worky.postMessage({ type, width, height });
});

globalThis.dispatchEvent(new Event("resize"));
