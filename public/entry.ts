import type { Child, Tag, Thing } from "./lib/real.ts";

declare const m: HTMLElement;

const { from } = Array;
const { assign, fromEntries } = Object;

const mapn = (
  (ns: Record<string, string>) => (n: string) => ns[n] ?? n
)({
  class: "className",
});

const peek = (as: NamedNodeMap): { [k: string]: unknown } =>
  fromEntries(from(as, ({ name, value }) => [mapn(name), value]));

const trim = (x: string, start: boolean, end: boolean) =>
  start ? x.trimStart() : end ? x.trimEnd() : x;

const more = (
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
       * skip text nodes that are a newline followed by all whitespace
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

const scan = ({ tagName, attributes, childNodes }: Element): Thing =>
  assign(
    { tag: tagName.toLowerCase() as Tag },
    attributes.length && { props: peek(attributes) },
    childNodes.length && {
      children: childNodes.values().toArray().reduce(more, []),
    },
  );

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener(
  "message",
  ({ data }) => console.log(JSON.stringify(data) === JSON.stringify(scan(m))),
);
worky.postMessage(scan(m));

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
      const node = assign(document.createElement(thing.tag), thing.props);
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
