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
  merge([fromEvent(globalThis, "resize"), fromEvent(globalThis, "rpc")]),
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
        /**
         * n.b. `event.target` is a transformed `InnerSize` object
         * @see ./types.ts
         */
        w.postMessage({ type, ...event.target });
        break;
      }

      case "rpc": {
        /**
         * n.b. `event.detail` an object with a `cbid` string (path to the
         * callback in `cbcks`) and an `args` tuple that's just the serialized
         * event object (e.g. `{ type: "pointermove", x: 0, y: 0 }`)
         *
         * @see ./types.ts
         * @see ./worky.ts
         */
        w.postMessage({ type, ...event.detail });
        break;
      }
    }
  },
);

const dispatchResize = () => globalThis.dispatchEvent(fevt("resize"));
dispatchResize();

forEach(fromEvent(globalThis, "keyup"), (e) => console.log(e));
