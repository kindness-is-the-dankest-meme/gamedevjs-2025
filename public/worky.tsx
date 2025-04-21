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
    const { success, data: event, error } = ResizeEvent.safeParse(data);
    if (!success) {
      console.error(error);
      console.info({ data });
      return;
    }

    const { type, width, height } = event;
    if (type === "resize") {
      self.postMessage(<App width={width} height={height} />);
    }
  },
);
