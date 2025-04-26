import { selectSize } from "../app/selectors.ts";
import { useStore } from "../app/store.ts";

type PondsProps = {
  ts: string[][];
};

export const Ponds = ({ ts }: PondsProps) => {
  const size = useStore(selectSize);

  return (
    <g>
      {ts.map((r, i) =>
        r.map((c, j) => (
          <use
            key={`${j}:${i}`}
            className="tile"
            href={`#${c || "∙"}`}
            transform={`translate(${j * size} ${i * size})`}
          />
        ))
      )}
    </g>
  );
};
