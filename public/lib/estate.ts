import { assign, fset, is } from "./free.ts";

type SetState<T> = (prev: T) => T;
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
