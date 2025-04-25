import { create } from "../lib/estate.ts";
import { ceil } from "../lib/free.ts";
import { useStore } from "../lib/real.ts";
import { Hud } from "./Hud.tsx";
import { World } from "./World.tsx";

type State = {
  size: number;
  width: number;
  height: number;
  keys: string[];
};

export const store = create((): State => ({
  size: 40,
  width: 0,
  height: 0,
  keys: [],
}));

export const App = () => {
  const { size, width, height, keys } = useStore(store.sub, store.get);

  return (
    <>
      <World cols={ceil(width / size)} rows={ceil(height / size)} size={size} />
      <Hud keys={keys} />
    </>
  );
};
