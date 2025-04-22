import { World } from "./World.tsx";

type AppProps = {
  width: number;
  height: number;
};

const { floor } = Math;
const size = 40;

export const App = ({ width, height }: AppProps) => (
  <>
    <World cols={floor(width / size)} rows={floor(height / size)} size={size} />
    {/* <Hud /> */}
  </>
);
