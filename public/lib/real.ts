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

const cise = (c: Child): c is El => typeof c === "object" && hasOwn(c, "tag");
const tisn = (
  tag: Tag | null,
): tag is NameTag | null => (tag === null || typeof tag === "string");
const tisf = (tag: Tag | null): tag is FnTag => typeof tag === "function";

const elc = (c: Child): Child =>
  cise(c) ? el(c.tag, c.props ?? null, ...(c.children ?? [])) : c;

const eln = (
  tag: NameTag | null,
  props: Props | null,
  cs: Child[],
): Child =>
  assign(
    { tag },
    props ? { props } : null,
    cs.length && {
      children: cs.flat().map(elc).filter(Boolean),
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
  tisn(tag) ? eln(tag, props, cs) : tisf(tag) ? elf(tag, props, cs) : tag;

// export const el = (
//   tag: Tag | null,
//   props: Props | null,
//   ...cs: Child[]
// ): Child => {
//   const elp = (
//     tag: Tag | null,
//     props: Props | null,
//     cs: Child[],
//     path: ("children" | number)[],
//   ): Child => {
//     if (isn(tag)) {
//       return assign(
//         { tag },
//         props ? { props } : null,
//         cs.length && {
//           children: cs.flat().map((c, i) =>
//             ise(c)
//               ? elp(c.tag, c.props ?? null, c.children ?? [], [
//                 ...path,
//                 "children",
//                 i,
//               ])
//               : c
//           ).filter(Boolean),
//         },
//       );
//     }

//     if (isf(tag)) {
//       const { tag: t, props: p, children: c } = tag(props ?? null, cs);
//       return elp(t, p ?? null, c ?? [], path);
//     }
//     return tag;
//   };

//   return elp(tag, props, cs, []);
// };
