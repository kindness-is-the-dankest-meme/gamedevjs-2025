import type { Tile } from "./tiles.ts";

export const paths = (s: number): [Omit<Tile, "">, string][] => {
  const hs = s / 2,
    a = (x: number, y: number) => `A ${hs} ${hs} 0 0 1 ${x} ${y}`,
    mh = (mx: number, my: number, hx: number) => `M ${mx} ${my} H ${hx}`,
    mv = (mx: number, my: number, vy: number) => `M ${mx} ${my} V ${vy}`,
    nw = `${mh(0, 0, hs)} ${a(0, hs)}`,
    ne = `${mv(s, 0, hs)} ${a(hs, 0)}`,
    se = `${mh(s, s, hs)} ${a(s, hs)}`,
    sw = `${mv(0, s, hs)} ${a(hs, s)}`;

  return [
    ["▘", `${nw} Z`],
    ["▝", `${ne} Z`],
    ["▗", `${se} Z`],
    ["▖", `${sw} Z`],
    ["▛", `${mv(0, 0, s)} H ${hs} ${a(s, hs)} V 0 Z`],
    ["▜", `${mv(0, 0, hs)} ${a(hs, s)} H ${s} V 0 Z`],
    ["▟", `M ${hs} 0 ${a(0, hs)} V ${s} H ${s} V 0 Z`],
    ["▙", `${mv(0, 0, s)} H ${s} V ${hs} ${a(hs, 0)} Z`],
    ["▌", `${mh(0, 0, hs)} V ${s} H 0 Z`],
    ["▐", `${mh(hs, 0, s)} V ${s} H ${hs} Z`],
    ["▚", `${nw} Z ${se} Z`],
    ["▞", `${ne} Z ${sw} Z`],
    ["╲", `${mv(0, 0, hs)} ${a(hs, s)} H ${s} V ${hs} ${a(hs, 0)} Z`],
    ["╱", `M ${hs} 0 ${a(0, hs)} V ${s} H ${hs} ${a(s, hs)} V 0 Z`],
    ["▀", `${mv(0, 0, hs)} H ${s} V 0 Z`],
    ["▄", `${mv(0, hs, s)} H ${s} V ${hs} Z`],
    ["█", `${mh(0, 0, s)} V ${s} H 0 Z`],
    ["∙", ""],
  ];
};
