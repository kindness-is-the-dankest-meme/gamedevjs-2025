import { store } from "../app/store.ts";
import { useFrame } from "../hooks/useFrame.ts";
import { cos, min, sin, π } from "../lib/free.ts";
import { Hud } from "./Hud.tsx";
import { World } from "./World.tsx";

const MAX_FORCE = 100;

const gkeys = () => {
  const { keys, on, oe, os, ow, v, a, x, y, r } = store.get();
  let fv = 0, fa = 0;

  const ikdwn = (ks: string[]) => ks.some((k) => keys.includes(k));

  if (ikdwn(["w", "arrowup"])) {
    store.set((prev) => ({
      ...prev,
      on: min(prev.on + 1, MAX_FORCE),
    }));
  } else if (on > 0) {
    fv = on / 15;

    store.set((prev) => ({
      ...prev,
      on: 0,
    }));
  }

  if (ikdwn(["d", "arrowright"])) {
    store.set((prev) => ({
      ...prev,
      oe: min(prev.oe + 1, MAX_FORCE),
    }));
  } else if (oe > 0) {
    fa = oe / 100 * π / 4;

    store.set((prev) => ({
      ...prev,
      oe: 0,
    }));
  }

  if (ikdwn(["s", "arrowdown"])) {
    store.set((prev) => ({
      ...prev,
      os: min(prev.os + 1, MAX_FORCE),
    }));
  } else if (os > 0) {
    fv = -os / 15;

    store.set((prev) => ({
      ...prev,
      os: 0,
    }));
  }

  if (ikdwn(["a", "arrowleft"])) {
    store.set((prev) => ({
      ...prev,
      ow: min(prev.ow + 1, MAX_FORCE),
    }));
  } else if (ow > 0) {
    fa = ow / 100 * -π / 4;

    store.set((prev) => ({
      ...prev,
      ow: 0,
    }));
  }

  const nv = (v + fv) * 0.99;
  const na = (a + fa) * 0.9;
  const nr = r + na;

  store.set((prev) => ({
    ...prev,
    v: nv,
    a: na,
    x: x + cos(nr) * nv,
    y: y + sin(nr) * nv,
    r: nr,
  }));
};

export const App = () => {
  useFrame(gkeys);

  return (
    <>
      <figure>
        <World />
        <figcaption>
          <Hud />
        </figcaption>
      </figure>
    </>
  );
};
