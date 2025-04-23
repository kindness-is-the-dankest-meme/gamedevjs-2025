export const tapl = <T>(
  x: T,
  fmt: (x: T) => string,
) => (console.log(fmt(x)), x);
