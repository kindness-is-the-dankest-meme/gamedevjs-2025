// deno-lint-ignore-file no-explicit-any

type Rndr = keyof (HTMLElementTagNameMap | SVGElementTagNameMap);
type Data = Record<PropertyKey, unknown> | null;
type Kid = Thng<Data> | false | null | undefined;

type Thng<T extends Data> = {
  rndr: Rndr;
  data?: T;
  kids?: Kid[];
};

const { assign } = Object;

export declare namespace JSX {
  export type IntrinsicElements = { [tagName: string]: any };
  export type Element = any;
}

export const el = <T extends Data>(
  rndr: Thng<T>["rndr"],
  data: T,
  ...kids: Kid[]
): Kid =>
  assign(
    { rndr, data },
    kids?.length && { kids },
  );
