import { create, useSyncExternalStore } from "../lib/estate.ts";
import { π } from "../lib/free.ts";

export type State = {
  width: number;
  height: number;
  keys: string[];

  // tiles
  size: number;
  ts: string[][];

  // oars
  on: number;
  oe: number;
  os: number;
  ow: number;

  // boat
  v: number;
  a: number;

  x: number;
  y: number;
  r: number;
};

export const store = create((): State => ({
  width: 0,
  height: 0,
  keys: [],

  // tiles
  size: 40,
  ts: [],

  // oars
  on: 0,
  oe: 0,
  os: 0,
  ow: 0,

  // boat
  v: 0,
  a: 0,

  x: 0,
  y: 0,
  r: -π / 2,
}));

export const useStore = (selector: (state: State) => any) =>
  useSyncExternalStore(
    store.sub,
    () => selector(store.get()),
  );
