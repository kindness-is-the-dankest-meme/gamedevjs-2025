import { useEffect, useMemo, useState } from "../lib/real.ts";
import { cos, sin } from "../lib/free.ts";
import { grid, tapg } from "../app/grids.ts";
import { paths } from "../app/paths.ts";
import { rules } from "../app/rules.ts";
import { Pointer } from "./Pointer.tsx";
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

  const [pointer, setPointer] = useState(true);
  const [x, setX] = useState((cols * size) / 2 + size);
  const [y, setY] = useState((rows * size) / 2);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setX(() => (cols * size) / 2 + sin(now / 500) * size * 3);
      setY(() => (rows * size) / 2 + cos(now / 500) * size * 3);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width={`${cols * size}px`}
      height={`${rows * size}px`}
      fill="none"
    >
      <defs>
        {paths(size).map(([id, d]) => (
          <g id={id} key={id}>
            {d && <path d={d} />}
            <rect width={size} height={size} />
          </g>
        ))}
      </defs>
      <Ponds ts={ts} s={size} />
      {pointer && <Pointer x={x} y={y} />}
    </svg>
  );
};
