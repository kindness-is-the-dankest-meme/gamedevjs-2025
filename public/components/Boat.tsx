import { type State, useStore } from "../app/store.ts";
import { floor, rtod } from "../lib/free.ts";

const selectS = ({ size }: State) => floor(size * 0.8);
const selectCx = ({ cx }: State) => cx;
const selectCy = ({ cy }: State) => cy;
const selectCr = ({ cr }: State) => cr;

export const Boat = () => {
  /**
   * `s` is 80% of `size` (defined in `../app/store.ts`), if `size` is 40:
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
   * @see ../app/store.ts
   */
  const s = useStore(selectS),
    hs = s / 2,
    qs = hs / 2,
    es = qs / 2,
    ts = (es / 2) / 2,
    os = (ts / 2) / 2;

  const x = useStore(selectCx);
  const y = useStore(selectCy);
  const r = useStore(selectCr);

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
