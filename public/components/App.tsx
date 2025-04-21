import { Frag } from "../lib/real.ts";
import { Hud } from "./Hud.tsx";
import { Pond } from "./Pond.tsx";

type AppProps = {
  width: number;
  height: number;
};

const { floor } = Math;
const size = 80;

export const App = ({ width, height }: AppProps) => (
  <Frag>
    <Pond cols={floor(width / size)} rows={floor(height / size)} size={size} />
    <Hud />
  </Frag>
);
