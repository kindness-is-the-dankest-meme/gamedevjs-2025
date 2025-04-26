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

  const skey = useCallback(
    (sk: string) =>
      store.set((prev) =>
        !prev.keys.includes(sk) ? ({ ...prev, keys: [...prev.keys, sk] }) : prev
      ),
    [],
  );

  const ukey = useCallback(
    (uk: string) =>
      store.set((prev) =>
        prev.keys.includes(uk)
          ? ({
            ...prev,
            keys: prev.keys.filter((k) => k !== uk),
          })
          : prev
      ),
    [],
  );

  return (
    <menu>
      <li id="n">
        <button
          type="button"
          className={kdwn(["w", "arrowup"]) && "pressed"}
          onMouseDown={() => skey("arrowup")}
          onMouseUp={() => ukey("arrowup")}
          onTouchCancel={() => ukey("arrowup")}
          onTouchStart={() => skey("arrowup")}
          onTouchEnd={() => ukey("arrowup")}
        >
          <ArrowUp size={size} />
        </button>
      </li>
      <li id="e">
        <button
          type="button"
          className={kdwn(["d", "arrowright"]) && "pressed"}
          onMouseDown={() => skey("arrowright")}
          onMouseUp={() => ukey("arrowright")}
          onTouchCancel={() => ukey("arrowright")}
          onTouchStart={() => skey("arrowright")}
          onTouchEnd={() => ukey("arrowright")}
        >
          <ArrowRight size={size} />
        </button>
      </li>
      <li id="s">
        <button
          type="button"
          className={kdwn(["s", "arrowdown"]) && "pressed"}
          onMouseDown={() => skey("arrowdown")}
          onMouseUp={() => ukey("arrowdown")}
          onTouchCancel={() => ukey("arrowdown")}
          onTouchStart={() => skey("arrowdown")}
          onTouchEnd={() => ukey("arrowdown")}
        >
          <ArrowDown size={size} />
        </button>
      </li>
      <li id="w">
        <button
          type="button"
          className={kdwn(["a", "arrowleft"]) && "pressed"}
          onMouseDown={() => skey("arrowleft")}
          onMouseUp={() => ukey("arrowleft")}
          onTouchCancel={() => ukey("arrowleft")}
          onTouchStart={() => skey("arrowleft")}
          onTouchEnd={() => ukey("arrowleft")}
        >
          <ArrowLeft size={size} />
        </button>
      </li>
    </menu>
  );
};
