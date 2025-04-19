declare const m: HTMLElement;

type Rndr = keyof (HTMLElementTagNameMap | SVGElementTagNameMap);
type Data = Record<PropertyKey, unknown>;
type Kid = Thng<Data> | string | false | null | undefined;

type Thng<T extends Data> = {
  rndr: Rndr;
  data?: T;
  kids?: Kid[];
};

type Kids = Kid[];

const { from } = Array,
  { assign, fromEntries } = Object;

const nameMap: Record<string, string> = {
  ["class"]: "className",
};
const mapn = (x: string) => nameMap[x] ?? x;

const peek = (as: NamedNodeMap): { [k: string]: unknown } =>
  fromEntries(from(as, ({ name, value }) => [mapn(name), value]));

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

const scan = ({ tagName, attributes, childNodes }: Element): Thng<Data> =>
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

console.info(scan(m));
console.info(bild(
  <main id="m">
    <hr />
    <article className="the-article">
      <header>
        <h1>The Title</h1>
        <h2>A Subheading</h2>
      </header>
      <section>
        <p>Some content.</p>
        <p>
          Some <b>more</b>
          <i>content</i>.
        </p>
        <ul>
          <li>An item</li>
          <li>Another item</li>
          <li>A third item</li>
          <li>A fourth</li>
        </ul>
      </section>
      <footer>The footer</footer>
    </article>
  </main>,
));
