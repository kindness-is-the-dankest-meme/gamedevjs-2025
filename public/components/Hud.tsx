import { selectKeys } from "../app/selectors.ts";
import { store, useStore } from "../app/store.ts";
import { useCallback } from "../lib/estate.ts";

export const Hud = () => {
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
                ? ({ ...prev, keys: prev.keys.filter((k) => k !== "arrowup") })
                : prev
            )}
        >
          &#11014;
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
          &#11157;
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
          &#11015;
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
          &#11013;
        </button>
      </li>
    </menu>
  );
};
