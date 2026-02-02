import { MessageEnvelope } from "../messages/Contract";
import { EventType } from "./EventType";

export interface IAppWidget {
  isOpen(): boolean;
}

export interface ISDK {
  openFullScreen(url: string): void;
  closeFullScreen(destroy?: boolean): void;
  getToken(refresh?: boolean): Promise<string>;
  getAppWidget(): IAppWidget;
  getEventListeners(): { [key: string]: ((...args: any[]) => void)[] };
  _triggerListeners(type: string, payload: any, widget: IWidget): void;
}

export interface IWidget {
  sendMessage(message: MessageEnvelope): void;
  getIframe(): HTMLIFrameElement | null;
}
