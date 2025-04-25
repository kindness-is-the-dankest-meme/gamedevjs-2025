import { from } from "../lib/free.ts";
import { tapl } from "./utils.ts";

const outl = (cols: number, rows: number) => (i: number, j: number) =>
  i === 0 || i === rows - 1 || j === 0 || j === cols - 1 ? "∙" : "";
export const grid = (cols: number, rows: number, mapt = outl(cols, rows)) =>
  from(
    { length: rows },
    (_, i) => from({ length: cols }, (_, j) => mapt(i, j)),
  );

const cstr = (c: string) => c || " ";
const rstr = (r: string[]) => r.map(cstr).join(" ");
const gstr = (g: string[][]) => g.map(rstr).join("\n");
export const tapg = (g: string[][]) => tapl(g, gstr);
