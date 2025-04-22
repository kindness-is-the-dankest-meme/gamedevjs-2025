import { World } from "./World.tsx";

type AppProps = {
  width: number;
  height: number;
};

const { ceil } = Math;
const size = 40;

export const App = ({ width, height }: AppProps) => (
  <>
    <World cols={ceil(width / size)} rows={ceil(height / size)} size={size} />
    {/* <Hud /> */}
  </>
);
