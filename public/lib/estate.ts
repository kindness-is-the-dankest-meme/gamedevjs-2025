import { assign, ferr, fmap, fmev, fset, is } from "./free.ts";

type Hctx = {
  hooks: any[];
  index: number;
};

type SetState<T> = (prev: T) => T;
type Effect = () => void | (() => void);

export const hreg = fmap<string, Hctx>();
let hctx: Hctx | null = null;
export const h = {
  get ctx() {
    return hctx;
  },
  set ctx(v: Hctx | null) {
    hctx = v;
  },
};

const useHook = <T>(init: () => T) => {
  if (!hctx) {
    throw ferr("`useHook` requires a component context");
  }

  const { hooks, index } = hctx;
  (index >= hooks.length) && hooks.push(init());
  hctx.index = index + 1;
  return hooks[index];
};

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

export const useSyncExternalStore = <T>(
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

const isSetState = <T>(x: unknown): x is SetState<T> => typeof x === "function";
export const create = <T>(init: () => T) => {
  type State = ReturnType<typeof init>;
  type L = (curr: State, prev: State) => void;

  let state: State = init();
  const ls = fset<L>();

  const set = (part: State | ((prev: State) => State)) => {
    const next = isSetState(part) ? part(state) : part;
    if (!is(next, state)) {
      const prev = state;
      state = assign({}, state, next);
      ls.forEach((l) => l(state, prev));
    }
  };
  const get = () => state;
  const sub = (l: L) => (ls.add(l), () => ls.delete(l));

  return { set, get, sub };
};
