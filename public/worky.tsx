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
import type { El } from "./lib/real.ts";

type Customizer = Last<Parameters<typeof mergeWith<any, any>>>;

const ResizeEvent = z.object({
  type: z.literal("resize"),
  width: z.number(),
  height: z.number(),
});

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
      render(<App width={width} height={height} />);
    }
  },
);
