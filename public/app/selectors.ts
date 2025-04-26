import type { State } from "../app/store.ts";
import { ceil, floor } from "../lib/free.ts";

export const selectSize = ({ size }: State) => size;
export const selectWidth = ({ width }: State) => width;
export const selectHeight = ({ height }: State) => height;
export const selectKeys = ({ keys }: State) => keys;

export const selectCols = ({ size, width }: State) => ceil(width / size);
export const selectRows = ({ size, height }: State) => ceil(height / size);

export const selectOn = ({ on }: State) => on;
export const selectOe = ({ oe }: State) => oe;
export const selectOs = ({ os }: State) => os;
export const selectOw = ({ ow }: State) => ow;
