// deno-lint-ignore-file no-explicit-any

export type Rndr = keyof (HTMLElementTagNameMap | SVGElementTagNameMap);
export type Data = Record<PropertyKey, unknown> | null;

type Kid = Thng<Data> | string | false | null | undefined;
export type Kids = Kid[];

export type Thng<T extends Data> = {
  rndr: Rndr;
  data?: T;
  kids?: Kids;
};

export declare namespace JSX {
  export type IntrinsicElements = { [tagName: string]: any };
  export type Element = any;
}

const { assign } = Object;
export const el = <T extends Data>(
  rndr: Thng<T>["rndr"],
  data: T,
  ...kids: Kid[]
): Kid =>
  assign(
    { rndr },
    data && { data },
    kids?.length && { kids },
  );
