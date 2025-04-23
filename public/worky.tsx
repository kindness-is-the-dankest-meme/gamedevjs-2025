import { enablePatches, produceWithPatches } from "https://esm.sh/immer@10.1.1";
import isEqual from "https://esm.sh/lodash-es@4.17.21/isEqual.js";
import isPlainObject from "https://esm.sh/lodash-es@4.17.21/isPlainObject.js";
import mergeWith from "https://esm.sh/lodash-es@4.17.21/mergeWith.js";
import { z } from "https://esm.sh/zod@3.24.3";
import { App } from "./components/App.tsx";
import type { El } from "./lib/real.ts";

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
type Customizer = Last<Parameters<typeof mergeWith<any, any>>>;
type F<T> = T extends new (...args: infer A) => infer R ? (...args: A) => R
  : never;

const { isArray } = Array;
const { keys } = Object;

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

const fevt: F<typeof EventTarget> = () => new EventTarget();
const fcev: F<typeof CustomEvent> = (type, init) => new CustomEvent(type, init);

const evt = fevt();
let tree: El = { tag: null };

const render = (nextTree: any) => {
  const [prodTree, patches] = produce(tree, nextTree);

  if (!isEqual(nextTree, prodTree)) {
    console.log({
      nextTree,
      prodTree,
    });
  }

  tree = prodTree;
  patches.forEach((patch) =>
    evt.dispatchEvent(fcev("patch", { detail: patch }))
  );
};

const fromEvent = async function* <E extends Event>(
  target: EventTarget,
  type: string,
): AsyncGenerator<E> {
  let { promise, resolve } = Promise.withResolvers<void>();

  const events = new Set<E>(),
    listener = (event: Event) => {
      events.add(event as E);
      resolve();

      ({ promise, resolve } = Promise.withResolvers<void>());
    };

  try {
    target.addEventListener(type, listener);

    while (true) {
      await promise;
      yield* events.values();
      events.clear();
    }
  } finally {
    target.removeEventListener(type, listener);
  }
};

const forEach = async <E extends Event>(
  eventStream: AsyncGenerator<E>,
  listener: (event: E, index: number) => void,
) => {
  let i = 0;
  for await (const event of eventStream) {
    listener(event, i++);
  }
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
