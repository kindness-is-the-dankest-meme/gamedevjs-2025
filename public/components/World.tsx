import { grid, tapg } from "../app/grids.ts";
import { paths } from "../app/paths.ts";
import { rules } from "../app/rules.ts";
import { selectCols, selectRows, selectSize } from "../app/selectors.ts";
import { useStore } from "../app/store.ts";
import { useMemo } from "../lib/estate.ts";
import { Boat } from "./Boat.tsx";
import { Ponds } from "./Ponds.tsx";

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rules, []);

export const World = () => {
  const size = useStore(selectSize);
  const cols = useStore(selectCols);
  const rows = useStore(selectRows);

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
      <Ponds ts={ts} />
      <Boat />
    </svg>
  );
};
