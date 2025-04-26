import { store } from "../app/store.ts";
import { useFrame } from "../hooks/useFrame.ts";
import { min } from "../lib/free.ts";
import { Hud } from "./Hud.tsx";
import { World } from "./World.tsx";

const gkeys = () => {
  const { keys: ks, on, oe, os, ow } = store.get();

  if (ks.includes("w") || ks.includes("arrowup")) {
    store.set((prev) => ({
      ...prev,
      on: min(prev.on + 1, 40),
    }));
  } else if (on > 0) {
    console.log(`blast off n with ${on}`);
    store.set((prev) => ({
      ...prev,
      on: 0,
    }));
  }

  if (ks.includes("d") || ks.includes("arrowright")) {
    store.set((prev) => ({
      ...prev,
      oe: min(prev.oe + 1, 40),
    }));
  } else if (oe > 0) {
    console.log(`blast off e with ${oe}`);
    store.set((prev) => ({
      ...prev,
      oe: 0,
    }));
  }

  if (ks.includes("s") || ks.includes("arrowdown")) {
    store.set((prev) => ({
      ...prev,
      os: min(prev.os + 1, 40),
    }));
  } else if (os > 0) {
    console.log(`blast off s with ${os}`);
    store.set((prev) => ({
      ...prev,
      os: 0,
    }));
  }

  if (ks.includes("a") || ks.includes("arrowleft")) {
    store.set((prev) => ({
      ...prev,
      ow: min(prev.ow + 1, 40),
    }));
  } else if (ow > 0) {
    console.log(`blast off w with ${ow}`);
    store.set((prev) => ({
      ...prev,
      ow: 0,
    }));
  }
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
