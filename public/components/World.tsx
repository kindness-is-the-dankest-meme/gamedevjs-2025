import { type State, useStore } from "../app/store.ts";
import { grid, tapg } from "../app/grids.ts";
import { paths } from "../app/paths.ts";
import { rules } from "../app/rules.ts";
import { useMemo } from "../lib/estate.ts";
import { ceil, floor, π } from "../lib/free.ts";
import { Boat } from "./Boat.tsx";
import { Ponds } from "./Ponds.tsx";

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rules, []);

const selectDims = ({ size, width, height }: State) => ({
  size,
  width,
  height,
});

export const World = () => {
  const { size, width, height } = useStore(selectDims);

  const cols = useMemo(() => ceil(width / size), [width, size]);
  const rows = useMemo(() => ceil(height / size), [height, size]);
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
