import { useEffect, useState } from "../lib/real.ts";

type HudProps = {
  keys: string[];
};

export const Hud = ({ keys }: HudProps) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setI((p) => p + 1), 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section title={`pond #${i}`}>
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
    </section>
  );
};
