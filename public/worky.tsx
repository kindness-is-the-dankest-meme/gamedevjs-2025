import { z } from "https://esm.sh/zod@3.24.3";
import { App } from "./components/App.tsx";

const ResizeEvent = z.object({
  type: z.literal("resize"),
  width: z.number(),
  height: z.number(),
});

self.addEventListener(
  "message",
  ({ data }) => {
    const { type, width, height } = ResizeEvent.parse(data);

    if (type === "resize") {
      self.postMessage(<App width={width} height={height} />);
    }
  },
);
