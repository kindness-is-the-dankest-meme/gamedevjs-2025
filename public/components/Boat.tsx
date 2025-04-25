import { rtod } from "../lib/free.ts";

type BoatProps = {
  x: number;
  y: number;
  r: number;
  s: number;
};

export const Boat = ({ x, y, r, s }: BoatProps) => {
  const hs = s / 2,
    qs = hs / 2,
    es = qs / 2,
    ss = es / 2,
    ts = ss / 2,
    os = (ts / 2) / 2;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rtod(r)})`}>
      <clipPath id="outline">
        <path
          d={`M -${hs} -${qs} C -${ts} -${
            qs + es
          } ${hs} -${qs} ${hs} -${os} V ${os} C ${hs} ${qs} -${ts} ${
            qs + es
          } -${hs} ${qs} Z`}
          stroke-linejoin="round"
        />
      </clipPath>
      <g clip-path="url(#outline)">
        <rect
          x={-hs}
          y={-(qs + ss)}
          width={s}
          height={hs + qs}
          fill="magenta"
        />
        <rect
          x={-es}
          y={-(qs + ss)}
          width={qs}
          height={hs + qs}
          fill="yellow"
        />
      </g>
    </g>
  );
};
