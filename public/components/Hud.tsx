import { selectKeys, selectSize } from "../app/selectors.ts";
import { store, useStore } from "../app/store.ts";
import { useCallback } from "../lib/estate.ts";
import { ArrowDown } from "./ArrowDown.tsx";
import { ArrowLeft } from "./ArrowLeft.tsx";
import { ArrowRight } from "./ArrowRight.tsx";
import { ArrowUp } from "./ArrowUp.tsx";

export const Hud = () => {
  const size = useStore(selectSize);
  const keys = useStore(selectKeys);
  const kdwn = useCallback(
    (ks: string[]) => ks.some((k) => keys.includes(k)),
    [keys],
  );

  return (
    <menu>
      <li id="n">
        <button
          type="button"
          className={kdwn(["w", "arrowup"]) && "pressed"}
          onMouseDown={() =>
            store.set((prev) =>
              !prev.keys.includes("arrowup")
                ? ({ ...prev, keys: [...prev.keys, "arrowup"] })
                : prev
            )}
          onMouseUp={() =>
            store.set((prev) =>
              prev.keys.includes("arrowup")
                ? ({
                  ...prev,
                  keys: prev.keys.filter((k) => k !== "arrowup"),
                })
                : prev
            )}
        >
          <ArrowUp size={size} />
        </button>
      </li>
      <li id="e">
        <button
          type="button"
          className={kdwn(["d", "arrowright"]) && "pressed"}
          onMouseDown={() =>
            store.set((prev) =>
              !prev.keys.includes("arrowright")
                ? ({ ...prev, keys: [...prev.keys, "arrowright"] })
                : prev
            )}
          onMouseUp={() =>
            store.set((prev) =>
              prev.keys.includes("arrowright")
                ? ({
                  ...prev,
                  keys: prev.keys.filter((k) => k !== "arrowright"),
                })
                : prev
            )}
        >
          <ArrowRight size={size} />
        </button>
      </li>
      <li id="s">
        <button
          type="button"
          className={kdwn(["s", "arrowdown"]) && "pressed"}
          onMouseDown={() =>
            store.set((prev) =>
              !prev.keys.includes("arrowdown")
                ? ({ ...prev, keys: [...prev.keys, "arrowdown"] })
                : prev
            )}
          onMouseUp={() =>
            store.set((prev) =>
              prev.keys.includes("arrowdown")
                ? ({
                  ...prev,
                  keys: prev.keys.filter((k) => k !== "arrowdown"),
                })
                : prev
            )}
        >
          <ArrowDown size={size} />
        </button>
      </li>
      <li id="w">
        <button
          type="button"
          className={kdwn(["a", "arrowleft"]) && "pressed"}
          onMouseDown={() =>
            store.set((prev) =>
              !prev.keys.includes("arrowleft")
                ? ({ ...prev, keys: [...prev.keys, "arrowleft"] })
                : prev
            )}
          onMouseUp={() =>
            store.set((prev) =>
              prev.keys.includes("arrowleft")
                ? ({
                  ...prev,
                  keys: prev.keys.filter((k) => k !== "arrowleft"),
                })
                : prev
            )}
        >
          <ArrowLeft size={size} />
        </button>
      </li>
    </menu>
  );
};
