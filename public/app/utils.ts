export const fmts = <T>(x: T): string => JSON.stringify(x, null, 2);
export const tapl = <T>(
  x: T,
  fmt?: (x: T) => string,
): T => (console.log(fmt?.(x) ?? x), x);
export const amap = (ns: Record<string, string>) => (n: unknown): string =>
  ns[String(n)] ?? String(n);
