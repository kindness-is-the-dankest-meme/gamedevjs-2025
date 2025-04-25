import { fevt, forEach, fromEvent, fwkr, merge } from "./lib/free.ts";
import { patch } from "./patch.ts";
import { Event, InnerSize } from "./types.ts";

declare const m: HTMLElement;
const w = fwkr("./worky.ts", { type: "module" });

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
      console.info({ event: e });
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
