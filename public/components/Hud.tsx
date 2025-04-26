type HudProps = {
  keys: string[];
};

export const Hud = ({ keys }: HudProps) => (
  <menu>
    <li>
      <button
        type="button"
        name="n"
        disabled={keys.includes("w") || keys.includes("arrowup")}
      >
        &#11014;
      </button>
    </li>
    <li>
      <button
        type="button"
        name="e"
        disabled={keys.includes("d") || keys.includes("arrowright")}
      >
        &#11157;
      </button>
    </li>
    <li>
      <button
        type="button"
        name="s"
        disabled={keys.includes("s") || keys.includes("arrowdown")}
      >
        &#11015;
      </button>
    </li>
    <li>
      <button
        type="button"
        name="w"
        disabled={keys.includes("a") || keys.includes("arrowleft")}
      >
        &#11013;
      </button>
    </li>
  </menu>
);
