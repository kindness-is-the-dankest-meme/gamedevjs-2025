type PondProps = {
  cols: number;
  rows: number;
  size: number;
};

const corners = (s: number) => {
  const hs = s / 2;
  return [
    ["╯i", `M 0 0 H ${hs} A ${hs} ${hs} 0 0 1 0 ${hs} Z`],
    ["╰i", `M ${s} 0 V ${hs} A ${hs} ${hs} 0 0 1 ${hs} 0 Z`],
    ["╭i", `M ${s} ${s} H ${hs} A ${hs} ${hs} 0 0 1 ${s} ${hs} Z`],
    ["╮i", `M 0 ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} ${s} Z`],
    ["╭o", `M 0 0 V ${s} H ${hs} A ${hs} ${hs} 0 0 1 ${s} ${hs} V 0 Z`],
    ["╮o", `M 0 0 V ${hs} A ${hs} ${hs} 0 0 1 ${hs} ${s} H ${s} V 0 Z`],
    ["╯o", `M ${hs} 0 A ${hs} ${hs} 0 0 1 0 ${hs} V ${s} H ${s} V 0 Z`],
    ["╰o", `M 0 0 V ${s} H ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} 0 Z`],
  ];
};

export const Pond = ({ cols, rows, size }: PondProps) => (
  <svg
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox={`0 0 ${cols * size} ${rows * size}`}
    fill="none"
  >
    <defs>
      {corners(size).map(([id, d]) => (
        <g id={id} key={id}>
          <rect width={size} height={size} />
          <path d={d} />
        </g>
      ))}
      <g id="│i">
        <rect width={size} height={size} />
        <rect width={size / 2} height={size} />
      </g>
      <g id="│o">
        <rect width={size} height={size} />
        <rect x={size / 2} width={size / 2} height={size} />
      </g>
      <g id="─i">
        <rect width={size} height={size} />
        <rect width={size} height={size / 2} />
      </g>
      <g id="─o">
        <rect width={size} height={size} />
        <rect y={size / 2} width={size} height={size / 2} />
      </g>
      <g id="∙i">
        <rect width={size} height={size} />
      </g>
      <g id="∙o">
        <rect width={size} height={size} />
      </g>
    </defs>
    <g>
      <use href="#╭i" transform="translate(0,0)" />
      <use href="#╮i" transform="translate(80,0)" />
      <use href="#╰i" transform="translate(0,80)" />
      <use href="#╯i" transform="translate(80,80)" />
    </g>
  </svg>
);
