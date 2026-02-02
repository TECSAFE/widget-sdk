import { ISDK, IWidget } from "../types/Context";

export interface MessageEnvelope<P = any> {
  type: string;
  payload: P;
}

export interface WidgetMessageEvent<P> {
  event: P;
  respond: (msg: MessageEnvelope) => void;
}

export interface MessageDefinition<P> {
  type: string;
  create: (payload: P) => MessageEnvelope<P>;
  defaultHandler?: (e: WidgetMessageEvent<P>, sdk: ISDK, widget: IWidget) => void | Promise<void>;
}

export function defineMessage<P>(
  type: string,
  defaultHandler?: (e: WidgetMessageEvent<P>, sdk: ISDK, widget: IWidget) => void | Promise<void>,
): MessageDefinition<P> {
  return {
    type,
    create: (payload: P) => ({ type, payload }),
    defaultHandler,
  };
}
