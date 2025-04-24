import { useState } from "../lib/real.ts";

export const Hud = () => {
  const [i, setI] = useState(0);
  setI(i + 1);

  return (
    <section>
      <header>
        <h1>{`pond game ${i}`}</h1>
      </header>
    </section>
  );
};
