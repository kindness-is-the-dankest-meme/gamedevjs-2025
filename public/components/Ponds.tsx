import { selectSize, selectTs } from "../app/selectors.ts";
import { useStore } from "../app/store.ts";

export const Ponds = () => {
  const size = useStore(selectSize);
  const ts = useStore(selectTs);

  return (
    <g>
      <defs>
        <g id="ponds-shape">
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
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation={size / 8} />
        </filter>
      </defs>
      <mask id="ponds-mask">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="black"
        />
        <use href="#ponds-shape" />
      </mask>
      <g mask="url(#ponds-mask)">
        <g filter="url(#blur)" fill-opacity="0.5">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="black"
          />
          <use href="#ponds-shape" fill="hsl(100, 40%, 40%)" />
        </g>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.1)"
        />
      </g>
    </g>
  );
};
