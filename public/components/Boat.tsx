import { floor, rtod } from "../lib/free.ts";

type BoatProps = {
  x: number;
  y: number;
  r: number;
  s: number;
};

export const Boat = ({ x, y, r, s }: BoatProps) => {
  /**
   * `s` is 80% of the `size` declared in `./App.tsx`. If `size` is 40:
   *
   * | variable | value |
   * | -------- | ----- |
   * | `s`      | 32    |
   * | `hs`     | 16    |
   * | `qs`     | 8     |
   * | `es`     | 4     |
   * | `ss`     | 2     |
   * | `ts`     | 1     |
   * | `os`     | 0.25  |
   *
   * Variables are "half size", "quarter size", "eighth size", "thirty-second
   * size", and "one-hundred-twenty-eighth size" ... skipped "sixteenth size",
   * and "sixty-fourth size" as they would only have been used in the calulation
   * for their next sizes
   *
   * @see ./App.tsx
   * @see ./World.tsx
   */
  const hs = s / 2,
    qs = hs / 2,
    es = qs / 2,
    ts = (es / 2) / 2,
    os = (ts / 2) / 2;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${floor(rtod(r))})`}>
      <defs>
        <path
          id="boat-outline"
          d={`M -${hs} -${qs} C -${ts} -${
            qs + es
          } ${hs} -${qs} ${hs} -${os} V ${os} C ${hs} ${qs} -${ts} ${
            qs + es
          } -${hs} ${qs} Z`}
          stroke-linejoin="round"
        />
      </defs>
      <clipPath id="clip-outline">
        <use href="#boat-outline" />
      </clipPath>
      <g clip-path="url(#clip-outline)">
        <rect
          x={-hs}
          y={-(qs + es)}
          width={s}
          height={hs + qs}
          fill="magenta"
        />
        <rect
          x={-es}
          y={-(qs + es)}
          width={qs}
          height={hs + qs}
          fill="yellow"
        />
      </g>
      <use href="#boat-outline" stroke="green" stroke-width={es} fill="none" />
    </g>
  );
};
