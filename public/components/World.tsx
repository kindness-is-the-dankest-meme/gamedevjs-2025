import { grid, tapg } from "../app/grids.ts";
import { rules } from "../app/rules.ts";
import { tiles } from "../app/tiles.ts";
import { Ponds } from "./Ponds.tsx";

type WorldProps = {
  cols: number;
  rows: number;
  size: number;
};

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rules, []);

export const World = ({ cols, rows, size }: WorldProps) => (
  <svg
    width={`${cols * size}px`}
    height={`${rows * size}px`}
    fill="none"
  >
    <defs>
      {tiles(size).map(([id, d]) => (
        <g id={id} key={id}>
          {d && <path d={d} />}
          <rect width={size} height={size} />
        </g>
      ))}
    </defs>
    <Ponds ts={tapg(genp(cols, rows))} s={size} />
  </svg>
);
