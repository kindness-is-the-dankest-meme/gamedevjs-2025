import { isvt, nbors } from "../app/tiles.ts";

const { floor, random } = Math;
const odds = (n: number) => random() < n;

const cules = (
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
    nbors[ns].n,
    nbors[nw].e,
    nbors[nn].s,
    nbors[ne].w,
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

export const rules = (
  acr: string[][],
  r: string[],
  i: number,
  rs: string[][],
) => (acr.push(r.reduce<string[]>(cules(acr, r, i, rs), [])), acr);
