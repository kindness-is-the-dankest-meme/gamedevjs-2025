import { z } from "https://esm.sh/zod@3.24.3";

const Patch = z.object({
  op: z.enum(["add", "remove", "replace"]),
  path: z.array(
    z.union([
      z.enum(["tag", "props", "children"]),
      z.number(),
      z.string(),
    ]),
  ),
  value: z.any(),
});

export type Patch = z.infer<typeof Patch>;

const InnerSize = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

const Rpc = z.object({
  cbid: z.string(),
  args: z.tuple([z.any()]),
});

const ResizeEvent = z.object({
  type: z.literal("resize"),
  target: InnerSize,
});
const KeyDownEvent = z.object({
  type: z.literal("keydown"),
  key: z.string(),
});
const KeyUpEvent = z.object({
  type: z.literal("keyup"),
  key: z.string(),
});
const RpcEvent = z.object({
  type: z.literal("rpc"),
  detail: Rpc,
});

export const GlobalThisEvent = z.discriminatedUnion("type", [
  ResizeEvent,
  KeyDownEvent,
  KeyUpEvent,
  RpcEvent,
]);

const ErrorEvent = z.object({ type: z.literal("error") });
const MessageErrorEvent = z.object({ type: z.literal("messageerror") });
const MessageEvent = z.object({
  type: z.literal("message"),
  data: Patch,
});

export const WorkerEvent = z.discriminatedUnion("type", [
  ErrorEvent,
  MessageErrorEvent,
  MessageEvent,
]);

const RenderMsg = z.object({ type: z.literal("render") });
const ResizeMsg = z.object({
  type: z.literal("resize"),
  /**
   * TODO: figure out how to make this use the output type of `InnerSize`, what
   * I'd like to do is something like:
   *
   * ```ts
   * const ResizeMsg = z.output(InnerSize).merge(z.object({
   *   type: z.literal("resize"),
   * }));
   * ```
   *
   * @see https://zod.dev/?id=zodtype-with-zodeffects
   */
  width: z.number(),
  height: z.number(),
});
const KeysMsg = z.object({
  type: z.literal("keys"),
  keys: z.array(z.string()),
});
const RpcMsg = Rpc.merge(z.object({
  type: z.literal("rpc"),
}));

export const Msg = z.discriminatedUnion("type", [
  RenderMsg,
  ResizeMsg,
  KeysMsg,
  RpcMsg,
]);
