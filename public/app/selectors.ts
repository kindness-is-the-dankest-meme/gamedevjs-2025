import type { State } from "../app/store.ts";

export const selectWidth = ({ width }: State) => width;
export const selectHeight = ({ height }: State) => height;
export const selectKeys = ({ keys }: State) => keys;

export const selectSize = ({ size }: State) => size;
export const selectTs = ({ ts }: State) => ts;

export const selectOn = ({ on }: State) => on;
export const selectOe = ({ oe }: State) => oe;
export const selectOs = ({ os }: State) => os;
export const selectOw = ({ ow }: State) => ow;
