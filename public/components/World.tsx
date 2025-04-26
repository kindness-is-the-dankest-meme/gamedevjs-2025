import { grid, tapg } from "../app/grids.ts";
import { paths } from "../app/paths.ts";
import { rules } from "../app/rules.ts";
import { selectSize } from "../app/selectors.ts";
import { type State, store, useStore } from "../app/store.ts";
import { useEffect } from "../lib/estate.ts";
import { ceil, floor, random } from "../lib/free.ts";
import { Boat } from "./Boat.tsx";
import { Ponds } from "./Ponds.tsx";

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rules, []);

const selectCols = ({ size, width }: State) => ceil(width / size);
const selectRows = ({ size, height }: State) => ceil(height / size);

export const World = () => {
  const size = useStore(selectSize);
  const cols = useStore(selectCols);
  const rows = useStore(selectRows);

  useEffect(() => {
    if (cols === 0 || rows === 0) return;

    store.set((prev) => {
      const ts = tapg(genp(cols, rows));

      let i = -1, j = -1;
      while (i === -1 || j === -1) {
        const k = floor(random() * ts.length);
        const l = floor(random() * ts[k].length);

        if (ts[k][l] === "█") {
          i = k;
          j = l;
        }
      }
      const x = j * size + size / 2;
      const y = i * size + size / 2;

      return ({
        ...prev,
        ts,
        x,
        y,
      });
    });
  }, [cols, rows]);

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
      <Ponds />
      <Boat />
    </svg>
  );
};
