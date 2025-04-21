type PondProps = {
  cols: number;
  rows: number;
  size: number;
};

const tiles = (s: number) => {
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
    ["│i", `M 0 0 H ${hs} V ${s} H 0 Z`],
    ["│o", `M ${hs} 0 H ${s} V ${s} H ${hs} Z`],
    ["─i", `M 0 0 V ${hs} H ${s} V 0 Z`],
    ["─o", `M 0 ${hs} V ${s} H ${s} V ${hs} Z`],
    ["■i", `M 0 0 H ${s} V ${s} H 0 Z`],
    ["□o"],
  ];
};

/**
 * ∙ ╭ ─ ─ ╮ ∙
 * ╭ ╯ ∙ ∙ ╰ ╮
 * │ ∙ ╭ ╮ ∙ │
 * │ ∙ ╰ ╯ ∙ │
 * ╰ ╮ ∙ ∙ ╭ ╯
 * ∙ ╰ ─ ─ ╯ ∙
 */
const allowedNeighbors = {
  "╭": {
    up: "∙─╯╰",
    right: "─╮╯",
    down: "│╯╰",
    left: "∙│╯╮",
  },
  "╮": {
    up: "∙─╯╰",
    right: "∙│╭╰",
    down: "│╯╰",
    left: "╭╰─",
  },
  "╯": {
    up: "│╮╭",
    right: "∙│╭╰",
    down: "∙─╮╭",
    left: "╭╰─",
  },
  "╰": {
    up: "│╮╭",
    right: "─╮╯",
    down: "∙─╮╭",
    left: "∙│╯╮",
  },
  "│": {
    up: "│╮╭",
    right: "∙│╭╰",
    down: "│╯╰",
    left: "∙│╯╮",
  },
  "─": {
    up: "∙─╯╰",
    right: "─╮╯",
    down: "∙─╮╭",
    left: "╭╰─",
  },
  "■": {
    up: "∙─╯╰",
    right: "∙│╭╰",
    down: "∙─╮╭",
    left: "∙│╯╮",
  },
  "□": {
    up: "∙─╯╰",
    right: "∙│╭╰",
    down: "∙─╮╭",
    left: "∙│╯╮",
  },
} as const;

export const Pond = ({ cols, rows, size }: PondProps) => (
  <svg
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
    viewBox={`0 0 ${cols * size} ${rows * size}`}
    fill="none"
  >
    <defs>
      {tiles(size).map(([id, d]) => (
        <g id={id} key={id}>
          <rect width={size} height={size} />
          {d && <path d={d} />}
        </g>
      ))}
    </defs>
    <g>
      <use href="#╭i" transform="translate(0,0)" />
      <use href="#╮i" transform="translate(80,0)" />
      <use href="#╰i" transform="translate(0,80)" />
      <use href="#╯i" transform="translate(80,80)" />
      <use href="#╯i" transform="translate(0,0)" />
      <use href="#╰i" transform="translate(80,0)" />
      <use href="#╭i" transform="translate(160,0)" />
      <use href="#╮i" transform="translate(240,0)" />
      <use href="#╭o" transform="translate(0,80)" />
      <use href="#╮o" transform="translate(80,80)" />
      <use href="#╯o" transform="translate(160,80)" />
      <use href="#╰o" transform="translate(240,80)" />
      <use href="#│i" transform="translate(0,160)" />
      <use href="#│o" transform="translate(80,160)" />
      <use href="#─i" transform="translate(160,160)" />
      <use href="#─o" transform="translate(240,160)" />
      <use href="#■i" transform="translate(0,240)" />
      <use href="#□o" transform="translate(80,240)" />
    </g>
    <g transform="translate(320,0)">
      <use href="#╭i" transform="translate(0,0)" />
      <use href="#╮i" transform="translate(80,0)" />
      <use href="#╭o" transform="translate(160,0)" />
      <use href="#╮o" transform="translate(240,0)" />
      <use href="#╰i" transform="translate(0,80)" />
      <use href="#╯i" transform="translate(80,80)" />
      <use href="#╰o" transform="translate(160,80)" />
      <use href="#╯o" transform="translate(240,80)" />
      <use href="#─o" transform="translate(0,160)" />
      <use href="#─i" transform="translate(80,160)" />
      <use href="#│o" transform="translate(160,160)" />
      <use href="#│i" transform="translate(240,160)" />
      <use href="#□o" transform="translate(0,240)" />
      <use href="#■i" transform="translate(80,240)" />
    </g>
  </svg>
);
