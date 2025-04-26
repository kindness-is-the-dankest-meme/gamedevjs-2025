import { assign, entries, fmap, fromEntries } from "./free.ts";
import { h, hreg } from "./estate.ts";

export declare namespace JSX {
  export type IntrinsicElements = { [tag: string]: unknown };
  export type Element = unknown;
}

export type El = {
  tag: TagN | null;
  props?: Props | null;
  children?: ChE[];
};

export type Props = Record<PropertyKey, any>;

export type ChE = El | string;
type ChF = (path: Path) => ChE;
export type Ch = ChE | ChF;

type TagN = keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
type TagF = (data: Props | null, children: ChE[]) => El | ChF;
export type Tag = TagN | TagF;

type Path = ("children" | number | string)[];

const _tiss = (t: Tag | null): t is TagN => typeof t === "string";
const tisf = (t: Tag | null): t is TagF => typeof t === "function";
const cisf = (c: Ch): c is ChF => typeof c === "function";

const ch = (c: Ch, path: Path): ChE => cisf(c) ? c(path) : c;
const ci = (path: Path) => (c: Ch, i: number) =>
  ch(c, [...path, "children", i]);
const cj = (cs: Ch[], path: Path): ChE[] =>
  cs.flat(Infinity).map(ci(path)).filter(Boolean);

/**
 * for my own curiosity later, this is the non-lazy version:
 *
 * ```ts
 * export const el = (
 *   tag: Tag | null,
 *   props: Props | null,
 *   ...cs: ChE[]
 * ) => {
 *   if (tisf(tag)) {
 *     return tag(
 *       props ?? null,
 *       cs.flat(Infinity).filter(Boolean),
 *     );
 *   }
 *
 *   return assign(
 *     { tag },
 *     props ? { props } : null,
 *     cs.length && {
 *       children: cs.flat(Infinity).filter(Boolean),
 *     },
 *   );
 * };
 * ```
 */

export const cbs = fmap<string, <E extends Event>(event: E) => void>();
const hcbs = (props: Props, tid: string): Props =>
  fromEntries(
    entries(props).map(([k, v]) => {
      if (k.startsWith("on") && typeof v === "function") {
        const cbid = `${tid}.${k}`;
        cbs.set(cbid, v);
        return [k, cbid];
      }

      return [k, v];
    }),
  );

export const el = (
  tag: Tag | null,
  props: Props | null,
  ...cs: Ch[]
) =>
(path: Path = []): ChE => {
  if (tisf(tag)) {
    const hid = String(props?.key ?? path.concat(tag.name).join("."));

    const pctx = h.ctx;
    h.ctx = hreg.get(hid) ?? {
      hooks: [],
      index: 0,
    };
    h.ctx.index = 0;

    const e = ch(tag(props ? hcbs(props, hid) : null, cj(cs, path)), path);

    hreg.set(hid, h.ctx);
    h.ctx = pctx;

    return e;
  }

  const tid = tag ? path.concat(tag).join(".") : path.join(".");
  return assign(
    { tag },
    props ? { props: hcbs(props, tid) } : null,
    cs.length && {
      children: cj(cs, path),
    },
  );
};

export const frag = null;
export const Frag = (props?: Props, cs?: Parameters<typeof el>[3][]) =>
  el(
    frag,
    props ?? null,
    ...(cs ?? []),
  );
