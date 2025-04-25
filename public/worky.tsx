import { enablePatches, produceWithPatches } from "https://esm.sh/immer@10.1.1";
import isEqual from "https://esm.sh/lodash-es@4.17.21/isEqual.js";
import isPlainObject from "https://esm.sh/lodash-es@4.17.21/isPlainObject.js";
import mergeWith from "https://esm.sh/lodash-es@4.17.21/mergeWith.js";
import { App } from "./components/App.tsx";
import {
  fcev,
  forEach,
  fromEvent,
  ftgt,
  isArray,
  keys,
  type Last,
} from "./lib/free.ts";
import { cbcks, type El } from "./lib/real.ts";
import { Msg } from "./types.ts";

type Customizer = Last<Parameters<typeof mergeWith<any, any>>>;

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

const tgt = ftgt();
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
    tgt.dispatchEvent(fcev("patch", { detail: patch }))
  );
};

forEach(
  fromEvent<CustomEvent>(tgt, "patch"),
  ({ detail }) => self.postMessage(detail),
);

let treeFn: any;
forEach(
  fromEvent<MessageEvent>(self, "message"),
  ({ data }) => {
    const { success, data: msg, error } = Msg.safeParse(data);
    if (!success) {
      console.error(error);
      console.info({ data });
      return;
    }

    switch (msg.type) {
      case "render": {
        treeFn && render(treeFn);
        break;
      }

      case "resize": {
        const { width, height } = msg;
        treeFn = <App width={width} height={height} />;
        render(treeFn);
        break;
      }

      case "send": {
        const { callback, args } = msg;
        cbcks.get(callback)?.(...args);
        break;
      }
    }
  },
);
