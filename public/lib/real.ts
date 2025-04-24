import { assign, hasOwn } from "./free.ts";

export declare namespace JSX {
  export type IntrinsicElements = { [tag: string]: unknown };
  export type Element = unknown;
}

export type Props = Record<string, unknown>;
export type Child = El | string;

type NameTag = keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
type FnTag = (data: Props | null, children: Child[]) => El;
export type Tag = NameTag | FnTag;

export type El = {
  tag: Tag | null;
  props?: Props;
  children?: Child[];
};

export const frag = null;
export const Frag = (props?: Props, children?: Child[]) =>
  el(
    frag,
    props ?? null,
    ...(children ?? []),
  );

const eln = (
  tag: NameTag | null,
  props: Props | null,
  cs: Child[],
): Child =>
  assign(
    { tag },
    props ? { props } : null,
    cs.length && {
      children: cs.map((c, i) => {
        if (typeof c === "object" && hasOwn(c, "tag")) {
          return el(c.tag, c.props ?? null, ...(c.children ?? []));
        }

        return c;
      }).filter(Boolean),
    },
  );

const elf = (
  tag: FnTag,
  props: Props | null,
  cs: Child[],
): Child => {
  const { tag: t, props: p, children: c } = tag(props ?? null, cs);
  return el(t, p ?? null, ...(c ?? []));
};

export const el = (
  tag: Tag | null,
  props: Props | null,
  ...cs: Child[]
): Child =>
  (tag === null || typeof tag === "string")
    ? eln(tag, props, cs.flat())
    : (typeof tag === "function")
    ? elf(tag, props, cs.flat())
    : tag;
