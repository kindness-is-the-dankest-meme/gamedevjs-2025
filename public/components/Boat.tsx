import { selectR, selectX, selectY } from "../app/selectors.ts";
import { type State, useStore } from "../app/store.ts";
import { floor, rtod } from "../lib/free.ts";

const selectS = ({ size }: State) => floor(size * 0.8);

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

  const x = useStore(selectX);
  const y = useStore(selectY);
  const r = useStore(selectR);

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
        <filter id="boat-shadow-in">
          <feDropShadow dx="0" dy="0" stdDeviation={ts} flood-color="#444" />
        </filter>
        <filter
          id="boat-shadow-out"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feDropShadow dx="0" dy="0" stdDeviation={qs} flood-color="#444" />
        </filter>
      </defs>
      <clipPath id="clip-outline">
        <use href="#boat-outline" />
      </clipPath>
      <use
        href="#boat-outline"
        fill="#444"
        transform="scale(1.1)"
        filter="url(#boat-shadow-out)"
      />
      <g clip-path="url(#clip-outline)">
        <rect
          id="boat-bottom"
          x={-hs}
          y={-(qs + es)}
          width={s}
          height={hs + qs}
          fill="white"
        />
        <rect
          id="boat-bench"
          x={-es}
          y={-(qs + es)}
          width={qs}
          height={hs + qs}
          fill="white"
          filter="url(#boat-shadow-out)"
        />
      </g>
      <use
        href="#boat-outline"
        stroke="white"
        stroke-width={es}
        fill="none"
        filter="url(#boat-shadow-in)"
      />
    </g>
  );
};
