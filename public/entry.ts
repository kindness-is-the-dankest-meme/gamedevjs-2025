declare const m: HTMLElement;

type Rndr = keyof (HTMLElementTagNameMap | SVGElementTagNameMap);
type Thng = {
  rndr: Rndr;
  data?: { [k: string]: unknown };
  kids?: Kids;
};

type Kids = (Thng | string)[];

const { from } = Array,
  { assign, fromEntries } = Object;

const peek = (as: NamedNodeMap): { [k: string]: unknown } =>
  fromEntries(from(as, ({ name, value }) => [name, value]));

const kids = (acc: Kids, node: ChildNode): Kids => {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      acc.push(scan(node as Element));
      break;
    }

    case Node.TEXT_NODE: {
      const { data } = node as Text;
      // only include nodes that *are not* a newline followed by all whitespace
      if (!/^\n\s*$/.test(data)) {
        acc.push(data);
      }
      break;
    }
  }

  return acc;
};

const scan = ({ tagName, attributes, childNodes }: Element): Thng =>
  assign(
    { rndr: tagName.toLowerCase() as Rndr },
    attributes.length && { data: peek(attributes) },
    childNodes.length && {
      kids: childNodes.values().reduce(kids, []),
    },
  );

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener("message", ({ data }) => console.log(data));
worky.postMessage(scan(m));

const bild = (thng: Thng | string): Node => {
  switch (typeof thng) {
    case "object": {
      const node = assign(document.createElement(thng.rndr), thng.data);
      thng.kids && thng.kids.forEach((kid) => node.appendChild(bild(kid)));
      return node;
    }

    case "string": {
      return document.createTextNode(thng);
    }
  }
};

console.info(bild(scan(m)));
