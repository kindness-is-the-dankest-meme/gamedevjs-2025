export type F<T> = T extends new (...args: infer A) => infer R
  ? (...args: A) => R
  : never;

export type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

export const { ceil, cos, floor, max, min, random, sin, PI: π } = Math;
export const ππ = π * 2;
export const rtod = (r: number) => ((r * 180) / π) % 360;
export const dtor = (d: number) => ((d * π) / 180) % ππ;

export const { from, isArray } = Array;
export const {
  assign,
  entries,
  fromEntries,
  hasOwn,
  is,
  keys,
} = Object;
const { now: n } = performance;
export const now = n.bind(performance);

export const {
  devicePixelRatio: dpr,
  requestAnimationFrame: raf,
  cancelAnimationFrame: caf,
} = globalThis;

export const fres: F<typeof Response> = (body, init) =>
  new Response(body, init);
export const furl: F<typeof URL> = (url, base) => new URL(url, base);
export const fwkr: F<typeof Worker> = (url, options) =>
  new Worker(url, options);
export const ftgt: F<typeof EventTarget> = () => new EventTarget();
export const fevt: F<typeof Event> = (type, init) => new Event(type, init);
export const fcev: F<typeof CustomEvent> = (type, init) =>
  new CustomEvent(type, init);
export const fmev: F<typeof MessageEvent> = (type, init) =>
  new MessageEvent(type, init);
export const ferr: F<typeof Error> = (message, options) =>
  new Error(message, options);

// TODO: figure out how to make these type work
export const fmap /* : F<typeof Map> */ = <K, V>(
  iterable?: Iterable<readonly [K, V]> | null,
) => new Map<K, V>(iterable);
export const fset /* : F<typeof Set> */ = <T>(iterable?: Iterable<T> | null) =>
  new Set<T>(iterable);

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

export const merge = async function* <E extends Event>(
  iters: AsyncGenerator<E>[],
): AsyncGenerator<E> {
  let { promise, resolve } = Promise.withResolvers<void>();
  const events = new Set<E>(),
    listener = (event: Event) => {
      events.add(event as E);
      resolve();

      ({ promise, resolve } = Promise.withResolvers<void>());
    };

  iters.forEach((iter) => forEach(iter, listener));

  while (true) {
    await promise;
    yield* events.values();
    events.clear();
  }
};
