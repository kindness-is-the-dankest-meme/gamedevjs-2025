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
  cx: number;
  cy: number;
  cr: number;
  px: number;
  py: number;
  pr: number;
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
  cx: 0,
  cy: 0,
  cr: -π / 2,
  px: 0,
  py: 0,
  pr: -π / 2,
}));

export const useStore = (selector: (state: State) => any) =>
  useSyncExternalStore(
    store.sub,
    () => selector(store.get()),
  );
