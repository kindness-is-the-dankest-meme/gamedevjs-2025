export const tapl = <T>(
  x: T,
  fmt: (x: T) => string = String,
) => (console.log(fmt(x)), x);
