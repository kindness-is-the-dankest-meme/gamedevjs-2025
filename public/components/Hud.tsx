import { useEffect, useState } from "../lib/real.ts";

export const Hud = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setI((p) => p + 1), 10_000);
    return () => clearInterval(interval);
  }, []);

  return <section title={`pond #${i}`} />;
};
