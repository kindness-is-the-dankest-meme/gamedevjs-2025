declare const m: HTMLElement;

import type { Data, Kids, Rndr, Thng } from "./lib/real.ts";

const { from } = Array,
  { assign, fromEntries } = Object;

const nameMap: Record<string, string> = {
  ["class"]: "className",
};
const mapn = (x: string) => nameMap[x] ?? x;

const peek = (as: NamedNodeMap): { [k: string]: unknown } =>
  fromEntries(from(as, ({ name, value }) => [mapn(name), value]));

const trim = (x: string, start: boolean, end: boolean) =>
  start ? x.trimStart() : end ? x.trimEnd() : x;

const kids = (
  acc: Kids,
  node: ChildNode,
  i: number,
  { length }: Array<ChildNode>,
): Kids => {
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

const scan = ({ tagName, attributes, childNodes }: Element): Thng<Data> =>
  assign(
    { rndr: tagName.toLowerCase() as Rndr },
    attributes.length && { data: peek(attributes) },
    childNodes.length && {
      kids: childNodes.values().toArray().reduce(kids, []),
    },
  );

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener(
  "message",
  ({ data }) => console.log(JSON.stringify(data) === JSON.stringify(scan(m))),
);
worky.postMessage(scan(m));

const bild = (thng: Thng<Data> | string): Node => {
  switch (typeof thng) {
    case "object": {
      const node = assign(document.createElement(thng.rndr), thng.data);
      thng.kids &&
        thng.kids.forEach((kid) => kid && node.appendChild(bild(kid)));
      return node;
    }

    case "string": {
      return document.createTextNode(thng);
    }
  }
};
