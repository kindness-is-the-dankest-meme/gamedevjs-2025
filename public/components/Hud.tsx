import { type State, useStore } from "../app/store.ts";

const selectKeys = ({ keys }: State) => keys;

export const Hud = () => {
  const keys = useStore(selectKeys);

  return (
    <menu>
      <li id="n">
        <button
          type="button"
          disabled={keys.includes("w") || keys.includes("arrowup")}
        >
          &#11014;
        </button>
      </li>
      <li id="e">
        <button
          type="button"
          disabled={keys.includes("d") || keys.includes("arrowright")}
        >
          &#11157;
        </button>
      </li>
      <li id="s">
        <button
          type="button"
          disabled={keys.includes("s") || keys.includes("arrowdown")}
        >
          &#11015;
        </button>
      </li>
      <li id="w">
        <button
          type="button"
          disabled={keys.includes("a") || keys.includes("arrowleft")}
        >
          &#11013;
        </button>
      </li>
    </menu>
  );
};
