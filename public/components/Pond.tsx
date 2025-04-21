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
const ns = {
  "╭": {
    u: "□─╯╰",
    r: "─╮╯",
    d: "│╯╰",
    l: "□│╯╮",
  },
  "╮": {
    u: "□─╯╰",
    r: "□│╭╰",
    d: "│╯╰",
    l: "╭╰─",
  },
  "╯": {
    u: "│╮╭",
    r: "□│╭╰",
    d: "□─╮╭",
    l: "╭╰─",
  },
  "╰": {
    u: "│╮╭",
    r: "─╮╯",
    d: "□─╮╭",
    l: "□│╯╮",
  },
  "│": {
    u: "│╮╭",
    r: "□│╭╰",
    d: "│╯╰",
    l: "□│╯╮",
  },
  "─": {
    u: "□─╯╰",
    r: "─╮╯",
    d: "□─╮╭",
    l: "╭╰─",
  },
  "■": {
    u: "■─╯╰",
    r: "■│╭╰",
    d: "■─╮╭",
    l: "■│╯╮",
  },
  "□": {
    u: "□─╯╰",
    r: "□│╭╰",
    d: "□─╮╭",
    l: "□│╯╮",
  },
  "": {
    u: "",
    r: "",
    d: "",
    l: "",
  },
} as const;

const { from } = Array;
const { floor, random } = Math;
const { keys } = Object;

const vlts = keys(ns);
type Tile = keyof typeof ns;
const isvt = (t: string): t is Tile => vlts.includes(t);

const outl = (cols: number, rows: number) => (i: number, j: number) =>
  i === 0 || i === rows - 1 || j === 0 || j === cols - 1 ? "□" : "";

const grid = (cols: number, rows: number, mapt = outl(cols, rows)) =>
  from(
    { length: rows },
    (_, i) => from({ length: cols }, (_, j) => mapt(i, j)),
  );

const s = (g: string[][]) =>
  g.map((r) => r.map((c) => c || " ").join("")).join("\n");

const genp = (cols: number, rows: number) =>
  grid(cols, rows).reduce<string[][]>((
    acr,
    r,
    i,
    rs,
  ) => (acr.push(
    r.reduce<string[]>((acc, c, j) => {
      if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
        acc[j] = c;
        return acc;
      }

      const [nu, nr, nd, nl] = [
        acr[i - 1][j],
        r[j + 1],
        rs[i + 1][j],
        acc[j - 1],
      ];

      if (!(isvt(nu) && isvt(nr) && isvt(nd) && isvt(nl))) {
        throw new Error("Invalid neighbor");
      }

      const [au, ar, ad, al] = [
        ns[nd].u || "",
        ns[nl].r || "",
        ns[nu].d || "",
        ns[nr].l || "",
      ];

      const as = (au + ar + ad + al).split("").filter((
        t,
      ) =>
        (au === "" || au.includes(t)) && (ar === "" || ar.includes(t)) &&
        (ad === "" || ad.includes(t)) && (al === "" || al.includes(t))
      ).join("");

      acc[j] = as.charAt(floor(random() * as.length));
      return acc;
    }, []),
  ),
    acr), []);

console.log(s(genp(50, 20)));

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
