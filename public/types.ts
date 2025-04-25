import { z } from "https://esm.sh/zod@3.24.3";

export const Patch = z.object({
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

export const InnerSize = z
  .object({
    innerWidth: z.number(),
    innerHeight: z.number(),
  })
  .transform(({ innerWidth: width, innerHeight: height }) => ({
    width,
    height,
  }));

export const ErrorEvent = z.object({
  type: z.literal("error"),
});

export const MessageErrorEvent = z.object({
  type: z.literal("messageerror"),
});

export const MessageEvent = z.object({
  type: z.literal("message"),
  data: Patch,
});

export const Event = z.discriminatedUnion("type", [
  ErrorEvent,
  MessageErrorEvent,
  MessageEvent,
]);

export const RenderMsg = z.object({
  type: z.literal("render"),
});

export const ResizeMsg = z.object({
  type: z.literal("resize"),
  /**
   * TODO: figure out how to make this use the output type of InnerSize
   * @see https://zod.dev/?id=zodtype-with-zodeffects
   */
  width: z.number(),
  height: z.number(),
});

export const Msg = z.discriminatedUnion("type", [
  RenderMsg,
  ResizeMsg,
]);
