import { assign } from "./free.ts";

export declare namespace JSX {
  export type IntrinsicElements = { [tag: string]: unknown };
  export type Element = unknown;
}

export type El = {
  tag: TagN | null;
  props?: Props | null;
  children?: ChE[];
};

export type Props = Record<PropertyKey, unknown>;

export type ChE = El | string;
type ChF = (path: Path) => ChE;
export type Ch = ChE | ChF;

type TagN = keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
type TagF = (data: Props | null, children: ChE[]) => El | ChF;
export type Tag = TagN | TagF;

type Path = ("children" | number | string)[];

// const tiss = (t: Tag | null): t is TagN => typeof t === "string";
const tisf = (t: Tag | null): t is TagF => typeof t === "function";
const cisf = (c: Ch): c is ChF => typeof c === "function";

const ch = (c: Ch, path: Path): ChE => {
  if (cisf(c)) {
    return c(path);
  }

  return c;
};

const ci = (path: Path) => (c: Ch, i: number) =>
  ch(c, [...path, "children", i]);

export const el = (
  tag: Tag | null,
  props: Props | null,
  ...cs: Ch[]
) =>
(path: Path = []): ChE => {
  if (tisf(tag)) {
    return ch(
      tag(
        props ?? null,
        cs.flat(Infinity).map(ci(path)).filter(Boolean),
      ),
      path,
    );
  }

  return assign(
    { tag },
    props ? { props } : null,
    cs.length && {
      children: cs.flat(Infinity).map(ci(path)).filter(Boolean),
    },
  );
};

export const frag = null;
export const Frag = (props?: Props, cs?: Ch[]) =>
  el(
    frag,
    props ?? null,
    ...(cs ?? []),
  );
