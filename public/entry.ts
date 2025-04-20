import type { Child, Tag, Thing } from "./lib/real.ts";

declare const m: HTMLElement;

const { from } = Array;
const { assign, entries, fromEntries } = Object;

const mapn = (
  (ns: Record<string, string>) => (n: string) => ns[n] ?? n
)({
  class: "className",
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

const scan = (el: Element | NodeListOf<ChildNode>): Thing =>
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
worky.addEventListener("message", ({ data }) => {
  console.log(data);
  const nextNode = bild(data);
  m.firstChild
    ? m.replaceChildren(nextNode, m.firstChild)
    : m.appendChild(nextNode);
});
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

const cnod = (thing: Thing): Node => {
  switch (typeof thing.tag) {
    case "function":
    case "object": {
      const node = document.createDocumentFragment();
      thing.children &&
        thing.children.forEach((t) => t && node.appendChild(bild(t)));
      return node;
    }

    case "string": {
      const node = document.createElementNS(
        svgs.includes(thing.tag)
          ? "http://www.w3.org/2000/svg"
          : "http://www.w3.org/1999/xhtml",
        thing.tag,
      );
      thing.props &&
        entries(thing.props).forEach(([k, v]) =>
          node.setAttribute(k, String(v))
        );
      thing.children &&
        thing.children.forEach((t) => t && node.appendChild(bild(t)));
      return node;
    }
  }
};
const bild = (thing: Thing | string): Node => {
  switch (typeof thing) {
    case "object": {
      return cnod(thing);
    }

    case "string": {
      return document.createTextNode(thing);
    }
  }
};
