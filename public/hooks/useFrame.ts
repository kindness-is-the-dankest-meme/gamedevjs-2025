import { useEffect } from "../lib/estate.ts";
import { caf, now, raf } from "../lib/free.ts";

type Fctx = {
  st: number;
  pt: number;
  ct: number;
  fn: number;
};

export const useFrame = (cb: (ctx: Fctx) => void) =>
  useEffect(() => {
    const st = now();
    let frame: number, fn = 0, pt = st;

    (function loop(ct: number) {
      frame = raf(loop);
      cb({ st, pt, ct, fn });
      pt = ct;
      fn++;
    })(pt);

    return () => caf(frame);
  }, []);
