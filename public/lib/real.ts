import { assign, ferr, fmap, fmev } from "./free.ts";

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

type Hctx = {
  hooks: any[];
  i: number;
};

const hreg = fmap<string, Hctx>();
let currCtx: Hctx | null = null;

const useHook = <T>(init: () => T) => {
  if (!currCtx) {
    throw ferr("`useHook` requires a component context");
  }

  const { hooks, i } = currCtx;
  (i >= hooks.length) && hooks.push(init());
  currCtx.i = i + 1;
  return hooks[i];
};

type SetState<T> = (prev: T) => T;
const isSetState = <T>(x: unknown): x is SetState<T> => typeof x === "function";
export const useState = <T>(init: T) => {
  if (!currCtx) {
    throw ferr("`useState` requires a component context");
  }

  useHook(() => init);
  const { hooks, i } = currCtx;

  const setState = (next: T | SetState<T>) => {
    hooks[i - 1] = isSetState(next) ? next(hooks[i - 1]) : next;
    self.dispatchEvent(
      fmev("message", {
        data: { type: "render" },
      }),
    );
  };

  return [hooks[i - 1], setState] as const;
};

type Effect = () => void | (() => void);
export const useEffect = (effect: Effect, deps?: unknown[]) => {
  if (!currCtx) {
    throw ferr("`useEffect` requires a component context");
  }

  const cleanup = useHook(() => null);
  const prev = useHook(() => null);
  const { hooks, i } = currCtx;

  if (!prev || !deps || deps.some((d, i) => d !== prev[i])) {
    cleanup?.();
    hooks[i - 2] = effect() || null;
    hooks[i - 1] = deps || null;
  }
};

export const useMemo = <T>(compute: () => T, deps?: unknown[]) => {
  if (!currCtx) {
    throw ferr("`useMemo` requires a component context");
  }

  const memo = useHook(() => null);
  const prev = useHook(() => null);
  const { hooks, i } = currCtx;

  if (!prev || !deps || deps.some((d, i) => d !== prev[i])) {
    const next = compute();
    hooks[i - 2] = next;
    hooks[i - 1] = deps || null;
    return next;
  }

  return memo;
};

export const el = (
  tag: Tag | null,
  props: Props | null,
  ...cs: Ch[]
) =>
(path: Path = []): ChE => {
  if (tisf(tag)) {
    const ctxid = String(props?.key ?? path.concat(tag.name).join("."));

    const prevCtx = currCtx;
    currCtx = hreg.get(ctxid) ?? {
      hooks: [],
      i: 0,
    };
    currCtx.i = 0;

    const e = ch(
      tag(props ?? null, cs.flat(Infinity).map(ci(path)).filter(Boolean)),
      path,
    );

    hreg.set(ctxid, currCtx);
    currCtx = prevCtx;

    return e;
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
export const Frag = (props?: Props, cs?: Parameters<typeof el>[3][]) =>
  el(
    frag,
    props ?? null,
    ...(cs ?? []),
  );
