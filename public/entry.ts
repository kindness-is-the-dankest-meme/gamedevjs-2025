declare const m: HTMLElement;

type Tree = {
  thing: string;
  stuff?: {
    [k: string]: unknown;
    babes?: (Tree | string)[];
  };
};

const peer = (as: NamedNodeMap): { [k: string]: unknown } => {
  const amap: { [k: string]: unknown } = {};

  for (const a of as) {
    amap[a.name] = a.value;
  }

  return amap;
};

const look = (el: Element): Tree => {
  const thing = el.tagName.toLowerCase(),
    stuff = el.hasAttributes() && peer(el.attributes),
    babes = el.hasChildNodes()
      ? Object.values(el.childNodes).map<Tree | string>((node) =>
          node.nodeName === "#text"
            ? (node as Text).data
            : look(node as Element)
        )
      : undefined;

  return {
    thing: thing,
    ...((el.hasAttributes() || el.hasChildNodes()) && {
      stuff: {
        ...stuff,
        babes,
      },
    }),
  };
};

console.log(JSON.stringify(look(m), null, 2));

const worky = new Worker("./worky.ts", { type: "module" });
worky.addEventListener("message", ({ data }) => console.log(data));
