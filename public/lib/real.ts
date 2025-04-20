export declare namespace JSX {
  export type IntrinsicElements = { [tag: string]: unknown };
  export type Element = unknown;
}

export type Props = Record<string, unknown>;
export type Child = Thing | string;
export type Tag =
  | keyof (HTMLElementTagNameMap & SVGElementTagNameMap)
  | ((data: Props | null, kids?: Child[]) => Thing);

export type Thing = {
  tag: Tag | null;
  props?: Props;
  children?: Child[];
};

// const { isArray } = Array;
const { assign, hasOwn } = Object;

const elf = (
  tag: Tag | null,
  props: Props | null,
  children: Child[],
): Child => {
  if (tag === null || typeof tag === "string") {
    return assign(
      { tag },
      props ? { props } : null,
      children.length && { children },
    );
  }

  if (typeof tag === "function") {
    const { tag: t, props: p, children: c } = tag(props ?? null, children);
    return elf(t, p ?? null, c ?? []);
  }

  return tag;
};

export const frag = null;
export const el = (
  tag: Tag | null,
  props: Props | null,
  ...children: Child[]
): Child =>
  elf(
    tag,
    props,
    children.flat().map((m) => {
      if (typeof m === "object" && hasOwn(m, "tag")) {
        return elf(m.tag, m.props ?? null, m.children ?? []);
      }

      return m;
    }),
  );
