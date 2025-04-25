import { fevt, forEach, fromEvent, fwkr, merge } from "./lib/free.ts";
import { patch } from "./patch.ts";
import { GlobalThisEvent, WorkerEvent } from "./types.ts";

declare const m: HTMLElement;
const w = fwkr("./worky.ts", { type: "module" });

forEach(
  merge([
    fromEvent(w, "error"),
    fromEvent(w, "messageerror"),
    fromEvent(w, "message"),
  ]),
  (e) => {
    const { success, data: event, error } = WorkerEvent.safeParse(e);
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

forEach(
  merge([fromEvent(globalThis, "resize"), fromEvent(globalThis, "send")]),
  (e) => {
    const { success, data: event, error } = GlobalThisEvent.safeParse(e);
    if (!success) {
      console.error(error);
      console.info({ event: e });
      return;
    }

    const { type } = event;
    switch (type) {
      case "resize": {
        w.postMessage({ type, ...event.target });
        break;
      }

      case "send": {
        w.postMessage({ type, ...event.detail });
        break;
      }
    }
  },
);

const dispatchResize = () => globalThis.dispatchEvent(fevt("resize"));
forEach(fromEvent(m, "click"), dispatchResize);
dispatchResize();
