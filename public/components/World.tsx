import { Ponds } from "./Ponds.tsx";

type WorldProps = {
  cols: number;
  rows: number;
  size: number;
};

const tiles = (s: number) => {
  const hs = s / 2;
  return [
    ["▘", `M 0 0 H ${hs} A ${hs} ${hs} 0 0 1 0 ${hs} Z`],
    ["▝", `M ${s} 0 V ${hs} A ${hs} ${hs} 0 0 1 ${hs} 0 Z`],
    ["▗", `M ${s} ${s} H ${hs} A ${hs} ${hs} 0 0 1 ${s} ${hs} Z`],
    ["▖", `M 0 ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} ${s} Z`],
    ["▛", `M 0 0 V ${s} H ${hs} A ${hs} ${hs} 0 0 1 ${s} ${hs} V 0 Z`],
    ["▜", `M 0 0 V ${hs} A ${hs} ${hs} 0 0 1 ${hs} ${s} H ${s} V 0 Z`],
    ["▟", `M ${hs} 0 A ${hs} ${hs} 0 0 1 0 ${hs} V ${s} H ${s} V 0 Z`],
    ["▙", `M 0 0 V ${s} H ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} 0 Z`],
    ["▌", `M 0 0 H ${hs} V ${s} H 0 Z`],
    ["▐", `M ${hs} 0 H ${s} V ${s} H ${hs} Z`],
    [
      "▚",
      `M 0 0 H ${hs} A ${hs} ${hs} 0 0 1 0 ${hs} V 0 0 Z M ${s} ${s} H ${hs} A ${hs} ${hs} 0 0 1 ${s} ${hs} Z`,
    ],
    [
      "▞",
      `M ${hs} 0 H ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} 0 Z M 0 ${s} V ${hs} A ${hs} ${hs} 0 0 1 ${hs} ${s} Z`,
    ],
    ["▀", `M 0 0 V ${hs} H ${s} V 0 Z`],
    ["▄", `M 0 ${hs} V ${s} H ${s} V ${hs} Z`],
    ["█", `M 0 0 H ${s} V ${s} H 0 Z`],
    ["∙"],
  ];
};

/**
 * ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙
 * ∙ ∙ ▗ ▄ ▄ ▄ ▖ ∙ ∙ ∙ ∙ ∙
 * ∙ ▗ ▟ █ █ █ ▌ ▗ ▖ ∙ ∙ ∙
 * ∙ ▐ █ ▛ ▀ ▜ ▙ ▞ ▚ ▄ ▖ ∙
 * ∙ ▐ █ ▙ ▄ ▟ █ ▌ ▝ ▀ ▘ ∙
 * ∙ ▝ ▜ █ █ █ ▛ ▘ ∙ ∙ ∙ ∙
 * ∙ ∙ ▝ ▀ ▀ ▀ ▘ ∙ ∙ ∙ ∙ ∙
 * ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙
 */
const ts = {
  "▗": {
    n: "∙▀▘▝",
    e: "▞▄▖▟",
    s: "▞▐▟▝",
    w: "∙▌▘▖",
  },
  "▖": {
    n: "∙▀▘▝",
    e: "∙▐▗▝",
    s: "▚▌▘▙",
    w: "▚▄▗▙",
  },
  "▘": {
    n: "▞▌▖▛",
    e: "∙▐▗▝",
    s: "∙▄▗▖",
    w: "▞▛▝▀",
  },
  "▝": {
    n: "▚▐▜▗",
    e: "▚▀▜▘",
    s: "∙▄▗▖",
    w: "∙▌▘▖",
  },
  "▛": {
    n: "█▄▟▙",
    e: "▚▀▜▘",
    s: "▌▘▙",
    w: "█▐▟▜",
  },
  "▜": {
    n: "█▄▟▙",
    e: "█▌▛▝",
    s: "▞▐▟▝",
    w: "▞▛▝▀",
  },
  "▟": {
    n: "▚▐▜▗",
    e: "█▌▛▙",
    s: "█▀▜▗",
    w: "▚▗▙▄",
  },
  "▙": {
    n: "▞▌▖▛",
    e: "▞▄▖▟",
    s: "█▀▖▛",
    w: "█▐▟▖",
  },
  "▌": {
    n: "▞▌▖▛",
    e: "∙▐▗▝",
    s: "▌▘▙",
    w: "█▐▟▜",
  },
  "▐": {
    n: "▚▐▜▗",
    e: "█▌▛▙",
    s: "▞▐▟▝",
    w: "∙▌▘▖",
  },
  "▚": {
    n: "▌▖▛",
    e: "▞▄▖▟",
    s: "▞▐▟▝",
    w: "█▐▟▜",
  },
  "▞": {
    n: "▐▜▗",
    e: "▚▀▜▘",
    s: "▌▘▙",
    w: "∙▌▘▖",
  },
  "▀": {
    n: "█▄▘▝",
    e: "▚▀▜▘",
    s: "∙▄▗▖",
    w: "▞▀▛▝",
  },
  "▄": {
    n: "∙▀▘▝",
    e: "▞▄▖▟",
    s: "█▀▜▛",
    w: "▚▄▗▙",
  },
  "█": {
    n: "█▄▟▙",
    e: "█▌▛▙",
    s: "█▀▜▛",
    w: "█▐▟▜",
  },
  "∙": {
    n: "∙▀▘▝",
    e: "∙▐▗▝",
    s: "∙▄▖▗",
    w: "∙▌▘▖",
  },
  "": {
    n: "",
    e: "",
    s: "",
    w: "",
  },
} as const;

const cülz = (
  acr: readonly string[][],
  r: readonly string[],
  i: number,
  rs: readonly string[][],
) =>
(acc: string[], c: string, j: number) => {
  // i === 0 || i === rows - 1 || j === 0 || j === cols - 1
  if (c !== "") {
    acc[j] = c;
    return acc;
  }

  const [nn, ne, ns, nw] = [
    acr[i - 1][j],
    r[j + 1],
    rs[i + 1][j],
    acc[j - 1],
  ];

  if (!(isvt(nn) && isvt(ne) && isvt(ns) && isvt(nw))) {
    throw new Error("Invalid neighbor");
  }

  const [an, ae, as, aw] = [
    ts[ns].n || "",
    ts[nw].e || "",
    ts[nn].s || "",
    ts[ne].w || "",
  ];

  const aa = (an + ae + as + aw).split("").filter((
    t,
  ) =>
    (an === "" || an.includes(t)) && (ae === "" || ae.includes(t)) &&
    (as === "" || as.includes(t)) && (aw === "" || aw.includes(t))
  ).join("");

  // // prefer empty spaces as neighbors to straight lines
  // if (
  //   (nn === "▀" || ne === "▐" || ns === "▄" || nw === "▌") &&
  //   aa.includes("∙")
  // ) {
  //   if (odds(7 / 10)) {
  //     acc[j] = "∙";
  //     return acc;
  //   }
  // }

  // // prefer filled spaces as neighbors to straight lines
  // if (
  //   (nn === "▄" || ne === "▌" || ns === "▀" || nw === "▐") &&
  //   aa.includes("█")
  // ) {
  //   if (odds(7 / 10)) {
  //     acc[j] = "█";
  //     return acc;
  //   }
  // }

  // prefer filled spaces as neighbors to filled spaces
  if (
    (nn === "█" || ne === "█" || ns === "█" || nw === "█" ||
      nn === "▟" || ne === "▟" || ns === "▜" || nw === "▜" ||
      nn === "▙" || ne === "▙" || ns === "▛" || nw === "▛" ||
      nn === "▄" || ne === "▌" || ns === "▀" || nw === "▐") &&
    aa.includes("█")
  ) {
    if (odds(9 / 10)) {
      acc[j] = "█";
      return acc;
    }
  }

  // prefer straight lines as neighbors to corners
  if (
    (nn === "▗" || nn === "▜" || nn === "▚" ||
      ns === "▝" || ns === "▟" || ns === "▞") &&
    aa.includes("▐")
  ) {
    if (odds(9 / 10)) {
      acc[j] = "▐";
      return acc;
    }
  }

  if (
    (nn === "▖" || nn === "▛" || nn === "▞" ||
      ns === "▘" || ns === "▙" || ns === "▚") &&
    aa.includes("▌")
  ) {
    if (odds(9 / 10)) {
      acc[j] = "▌";
      return acc;
    }
  }

  // prefer straight lines as neighbors to corners
  if (
    (ne === "▖" || ne === "▟" || ne === "▞" ||
      nw === "▗" || nw === "▙" || nw === "▚") &&
    aa.includes("▄")
  ) {
    if (odds(9 / 10)) {
      acc[j] = "▄";
      return acc;
    }
  }

  if (
    (ne === "▘" || ne === "▜" || ne === "▚" ||
      nw === "▝" || nw === "▛" || nw === "▞") &&
    aa.includes("▀")
  ) {
    if (odds(9 / 10)) {
      acc[j] = "▀";
      return acc;
    }
  }

  // // prefer empty spaces as neighbors to empty spaces
  // if (
  //   (nn === "∙" || ne === "∙" || ns === "∙" || nw === "∙") &&
  //   aa.includes("∙")
  // ) {
  //   if (odds(9 / 10)) {
  //     acc[j] = "∙";
  //     return acc;
  //   }
  // }

  // // prefer continuing vertical lines
  // if (nn === "▌" && aa.includes("▌")) {
  //   if (odds(5 / 10)) {
  //     acc[j] = "▌";
  //     return acc;
  //   }
  // }

  // if (nn === "▐" && aa.includes("▐")) {
  //   if (odds(5 / 10)) {
  //     acc[j] = "▐";
  //     return acc;
  //   }
  // }

  // // prefer continuing horizontal lines
  // if (nw === "▄" && aa.includes("▄")) {
  //   if (odds(5 / 10)) {
  //     acc[j] = "▄";
  //     return acc;
  //   }
  // }

  // if (nw === "▀" && aa.includes("▀")) {
  //   if (odds(5 / 10)) {
  //     acc[j] = "▀";
  //     return acc;
  //   }
  // }

  acc[j] = aa.charAt(floor(random() * aa.length));
  return acc;
};

const rülz = (
  acr: string[][],
  r: string[],
  i: number,
  rs: string[][],
) => (acr.push(r.reduce<string[]>(cülz(acr, r, i, rs), [])), acr);

const { from } = Array;
const { floor, random } = Math;
const { keys } = Object;

const vlts = keys(ts);
type Tile = keyof typeof ts;
const isvt = (t: string): t is Tile => vlts.includes(t);

const outl = (cols: number, rows: number) => (i: number, j: number) =>
  i === 0 || i === rows - 1 || j === 0 || j === cols - 1 ? "∙" : "";

const grid = (cols: number, rows: number, mapt = outl(cols, rows)) =>
  from(
    { length: rows },
    (_, i) => from({ length: cols }, (_, j) => mapt(i, j)),
  );

const odds = (n: number) => random() < n;

const tapl = (
  g: string[][],
) => (console.log(g.map((r) => r.map((c) => c || " ").join("")).join("\n")), g);

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>(rülz, []);

export const World = ({ cols, rows, size }: WorldProps) => (
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
          {d && <path d={d} />}
          <rect width={size} height={size} />
        </g>
      ))}
    </defs>
    <Ponds ts={tapl(genp(cols, rows))} s={size} />
  </svg>
);
