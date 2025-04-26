import { selectSize, selectTs } from "../app/selectors.ts";
import { useStore } from "../app/store.ts";

export const Ponds = () => {
  const size = useStore(selectSize);
  const ts = useStore(selectTs);

  return (
    <g>
      {ts.map((r: string[], i: number) =>
        r.map((c: string, j: number) => (
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
