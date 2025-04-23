export type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

export type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

export const { ceil, floor, random, PI: π } = Math;
export const { from, isArray } = Array;
export const {
  assign,
  entries,
  fromEntries,
  hasOwn,
  keys,
} = Object;
export const {
  devicePixelRatio: dpr,
  requestAnimationFrame: raf,
  cancelAnimationFrame: caf,
} = globalThis;

export const fevt: F<typeof EventTarget> = () => new EventTarget();
export const fcev: F<typeof CustomEvent> = (type, init) =>
  new CustomEvent(type, init);

export const fromEvent = async function* <E extends Event = Event>(
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

export const forEach = async <E extends Event>(
  eventStream: AsyncGenerator<E>,
  listener: (event: E, index: number) => void,
) => {
  let i = 0;
  for await (const event of eventStream) {
    listener(event, i++);
  }
};
