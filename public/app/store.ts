import { create, useSyncExternalStore } from "../lib/estate.ts";

export type State = {
  size: number;
  width: number;
  height: number;
  keys: string[];

  // oars
  on: number;
  oe: number;
  os: number;
  ow: number;
};

export const store = create((): State => ({
  size: 40,
  width: 0,
  height: 0,
  keys: [],

  // oars
  on: 0,
  oe: 0,
  os: 0,
  ow: 0,
}));

export const useStore = (selector: (state: State) => any) =>
  useSyncExternalStore(
    store.sub,
    () => selector(store.get()),
  );
