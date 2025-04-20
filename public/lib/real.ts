export declare namespace JSX {
  export type IntrinsicElements = { [tag: string]: unknown };
  export type Element = unknown;
}

export type Props = Record<string, unknown>;
export type Child = El | string;
export type Tag =
  | keyof (HTMLElementTagNameMap & SVGElementTagNameMap)
  | ((data: Props | null, kids?: Child[]) => El);

export type El = {
  tag: Tag | null;
  props?: Props;
  children?: Child[];
};

// const { isArray } = Array;
const { assign, hasOwn } = Object;

export const frag = null;

export const el = (
  tag: Tag | null,
  props: Props | null,
  ...children: Child[]
): Child => {
  const cs = children.flat();

  if (tag === null || typeof tag === "string") {
    return assign(
      { tag },
      props ? { props } : null,
      cs.length && {
        children: cs.map((c) => {
          if (typeof c === "object" && hasOwn(c, "tag")) {
            return el(c.tag, c.props ?? null, ...(c.children ?? []));
          }

          return c;
        }),
      },
    );
  }

  if (typeof tag === "function") {
    const { tag: t, props: p, children: c } = tag(props ?? null, cs);
    return el(t, p ?? null, ...(c ?? []));
  }

  return tag;
};
