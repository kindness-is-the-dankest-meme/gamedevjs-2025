import { grid, tapg } from "../app/grids.ts";
import { paths } from "../app/paths.ts";
import { rules } from "../app/rules.ts";
import { useMemo } from "../lib/estate.ts";
import { floor, π } from "../lib/free.ts";
import { Boat } from "./Boat.tsx";
import { Ponds } from "./Ponds.tsx";

type WorldProps = {
  cols: number;
  rows: number;
  size: number;
};

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rules, []);

export const World = ({ cols, rows, size }: WorldProps) => {
  const ts = useMemo(() => tapg(genp(cols, rows)), [cols, rows]);

  return (
    <svg
      width={`${cols * size}px`}
      height={`${rows * size}px`}
      fill="none"
    >
      <defs>
        {paths(size).map(([id, d]) => (
          <g id={id} key={id}>
            {d && <path d={d} className="tile" />}
            <rect width={size} height={size} />
          </g>
        ))}
      </defs>
      <Ponds ts={ts} s={size} />
      <Boat
        x={(cols * size) / 2}
        y={(rows * size) / 2}
        r={-π / 2}
        s={floor(size * 0.8)}
      />
    </svg>
  );
};
