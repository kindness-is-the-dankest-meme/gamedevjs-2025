import { create } from "../lib/estate.ts";
import { caf, ceil, min, now, raf } from "../lib/free.ts";
import { useEffect, useSyncExternalStore } from "../lib/real.ts";
import { Hud } from "./Hud.tsx";
import { World } from "./World.tsx";

type State = {
  size: number;
  width: number;
  height: number;
  keys: string[];

  // oars
  on: number;
  oe: number;
  os: number;
  ow: number;
};

export const store = create((): State => ({
  size: 40,
  width: 0,
  height: 0,
  keys: [],

  // oars
  on: 0,
  oe: 0,
  os: 0,
  ow: 0,
}));

const useStore = (selector: (state: State) => any) =>
  useSyncExternalStore(
    store.sub,
    () => selector(store.get()),
  );

const selectSwhk = ({ size, width, height, keys }: State) => ({
  size,
  width,
  height,
  keys,
});

export const App = () => {
  const { size, width, height, keys } = useStore(selectSwhk);

  useEffect(() => {
    const st = now();
    let frame: number, fn = 0, pt = st;

    (function loop(t: number) {
      const dt = t - pt, et = t - st;
      pt = t;
      fn++;

      frame = raf(loop);
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
    })(pt);

    return () => caf(frame);
  }, []);

  return (
    <>
      <figure>
        <World
          cols={ceil(width / size)}
          rows={ceil(height / size)}
          size={size}
        />
        <figcaption>
          <Hud keys={keys} />
        </figcaption>
      </figure>
    </>
  );
};
