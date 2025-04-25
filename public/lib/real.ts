import { assign, entries, ferr, fmap, fmev, fromEntries } from "./free.ts";

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

type Hctx = {
  hooks: any[];
  index: number;
};

const hreg = fmap<string, Hctx>();
let hctx: Hctx | null = null;

const useHook = <T>(init: () => T) => {
  if (!hctx) {
    throw ferr("`useHook` requires a component context");
  }

  const { hooks, index } = hctx;
  (index >= hooks.length) && hooks.push(init());
  hctx.index = index + 1;
  return hooks[index];
};

type SetState<T> = (prev: T) => T;
const isSetState = <T>(x: unknown): x is SetState<T> => typeof x === "function";
export const useState = <T>(init: T) => {
  if (!hctx) {
    throw ferr("`useState` requires a component context");
  }

  useHook(() => init);
  const { hooks, index } = hctx;

  const setState = (next: T | SetState<T>) => {
    hooks[index - 1] = isSetState(next) ? next(hooks[index - 1]) : next;
    self.dispatchEvent(
      fmev("message", {
        data: { type: "render" },
      }),
    );
  };

  return [hooks[index - 1], setState] as const;
};

type Effect = () => void | (() => void);
export const useEffect = (effect: Effect, deps?: unknown[]) => {
  if (!hctx) {
    throw ferr("`useEffect` requires a component context");
  }

  const cleanup = useHook(() => null);
  const prev = useHook(() => null);
  const { hooks, index } = hctx;

  if (!prev || !deps || deps.some((d, i) => d !== prev[i])) {
    cleanup?.();
    hooks[index - 2] = effect() || null;
    hooks[index - 1] = deps || null;
  }
};

export const useMemo = <T>(compute: () => T, deps?: unknown[]) => {
  if (!hctx) {
    throw ferr("`useMemo` requires a component context");
  }

  const memo = useHook(() => null);
  const prev = useHook(() => null);
  const { hooks, index } = hctx;

  if (!prev || !deps || deps.some((d, i) => d !== prev[i])) {
    const next = compute();
    hooks[index - 2] = next;
    hooks[index - 1] = deps || null;
    return next;
  }

  return memo;
};

export const useStore = <T>(
  sub: (cb: () => void) => () => void,
  get: () => T,
): T => {
  if (!hctx) {
    throw ferr("`useStore` requires a component context");
  }

  useHook(() => get());
  useHook(() => null);
  const { hooks, index } = hctx;

  useEffect(() => {
    const unsub = sub(() => {
      hooks[index - 2] = get();
      self.dispatchEvent(
        fmev("message", {
          data: { type: "render" },
        }),
      );
    });

    hooks[index - 1] = unsub;
    return unsub;
  }, [sub]);

  return hooks[index - 2];
};

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

    const pctx = hctx;
    hctx = hreg.get(hid) ?? {
      hooks: [],
      index: 0,
    };
    hctx.index = 0;

    const e = ch(tag(props ? hcbs(props, hid) : null, cj(cs, path)), path);

    hreg.set(hid, hctx);
    hctx = pctx;

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
