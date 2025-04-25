import { enablePatches, produceWithPatches } from "https://esm.sh/immer@10.1.1";
import isEqual from "https://esm.sh/lodash-es@4.17.21/isEqual.js";
import isPlainObject from "https://esm.sh/lodash-es@4.17.21/isPlainObject.js";
import mergeWith from "https://esm.sh/lodash-es@4.17.21/mergeWith.js";
import { z } from "https://esm.sh/zod@3.24.3";
import { App } from "./components/App.tsx";
import {
  fcev,
  fevt,
  forEach,
  fromEvent,
  isArray,
  keys,
  type Last,
} from "./lib/free.ts";
import type { ChE, El } from "./lib/real.ts";

type Customizer = Last<Parameters<typeof mergeWith<any, any>>>;

const RenderEvent = z.object({
  type: z.literal("render"),
});

const ResizeEvent = z.object({
  type: z.literal("resize"),
  width: z.number(),
  height: z.number(),
});

const Event = z.discriminatedUnion("type", [
  RenderEvent,
  ResizeEvent,
]);

const customizer: Customizer = (a, b, k) => {
  if (k === "props" && isPlainObject(a)) {
    const bks = keys(b);
    keys(a).forEach((ak) => bks.includes(ak) || delete a[ak]);
  }

  if (k === "children" && isArray(a)) {
    a.length = b.length;
  }
};

enablePatches();
const produce = produceWithPatches((draft, state) => {
  mergeWith(draft, state, customizer);
});

const evt = fevt();
let tree: El = { tag: null };

const render = (nextTreeFn: any) => {
  const nextTree = nextTreeFn();
  const [prodTree, patches] = produce(tree, nextTree);

  if (!isEqual(nextTree, prodTree)) {
    console.error("The produced tree did not match the expected tree", {
      nextTree,
      prodTree,
    });
  }

  tree = prodTree;
  patches.forEach((patch) =>
    evt.dispatchEvent(fcev("patch", { detail: patch }))
  );
};

forEach(
  fromEvent<CustomEvent>(evt, "patch"),
  ({ detail }) => self.postMessage(detail),
);

let treeFn: any;
forEach(
  fromEvent<MessageEvent>(self, "message"),
  ({ data }) => {
    const { success, data: event, error } = Event.safeParse(data);
    if (!success) {
      console.error(error);
      console.info({ data });
      return;
    }

    switch (event.type) {
      case "render": {
        treeFn && render(treeFn);
        break;
      }

      case "resize": {
        const { width, height } = event;
        treeFn = <App width={width} height={height} />;
        render(treeFn);
        break;
      }
    }
  },
);
