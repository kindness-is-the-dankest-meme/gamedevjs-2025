type PondsProps = {
  ts: string[][];
  s: number;
};

export const Ponds = ({ ts, s }: PondsProps) => (
  <g>
    {ts.map((r, i) =>
      r.map((c, j) => (
        <use
          key={`${i}:${j}`}
          href={`#${c || "∙"}`}
          transform={`translate(${j * s} ${i * s})`}
        />
      ))
    )}
  </g>
);
