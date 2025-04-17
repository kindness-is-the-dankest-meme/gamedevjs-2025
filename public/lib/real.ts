type Rndr = keyof (HTMLElementTagNameMap | SVGElementTagNameMap);
type Data = Record<PropertyKey, unknown>;
type Kid = Thng<Data> | false | null | undefined;

type Thng<T extends Data> = {
  rndr: Rndr;
  data?: T;
  kids?: Kid[];
};

const { assign } = Object;

export const el = <T extends Data>(
  rndr: Thng<T>["rndr"],
  data: T,
  ...kids: Kid[]
): Kid =>
  assign(
    { rndr, data },
    kids?.length && { kids },
  );
