import { z } from "https://esm.sh/zod@3.24.3";
import { fevt, forEach, fromEvent, fwkr, merge } from "./lib/free.ts";
import { Patch, patch } from "./patch.ts";

declare const m: HTMLElement;
const w = fwkr("./worky.ts", { type: "module" });

const InnerSize = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

const ErrorEvent = z.object({
  type: z.literal("error"),
});

const MessageErrorEvent = z.object({
  type: z.literal("messageerror"),
});

const MessageEvent = z.object({
  type: z.literal("message"),
  data: Patch,
});

const Event = z.discriminatedUnion("type", [
  ErrorEvent,
  MessageErrorEvent,
  MessageEvent,
]);

forEach(
  merge([
    fromEvent(w, "error"),
    fromEvent(w, "messageerror"),
    fromEvent(w, "message"),
  ]),
  (e) => {
    const { success, data: event, error } = Event.safeParse(e);
    if (!success) {
      console.error(error);
      console.info({ data: e });
      return;
    }

    switch (event.type) {
      case "error":
      case "messageerror": {
        console.error(event);
        break;
      }

      case "message": {
        patch(event.data);
      }
    }
  },
);

forEach(fromEvent(globalThis, "resize"), ({ target, type }) => {
  const { width, height } = InnerSize.parse(target);
  w.postMessage({ type, width, height });
});

const dispatchResize = () => globalThis.dispatchEvent(fevt("resize"));
forEach(fromEvent(m, "click"), dispatchResize);
dispatchResize();
