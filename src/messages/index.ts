import { InMessagePing } from "./in/Ping";
import { InMessageRequestToken } from "./in/RequestToken";
import { InMessageOpenFullScreen } from "./in/OpenFullScreen";
import { InMessageCloseFullScreen } from "./in/CloseFullScreen";
import { InMessageDestroyFullScreen } from "./in/DestroyFullScreen";
import { InMessageSizeUpdate } from "./in/SizeUpdate";
import { InMessageRequestFullScreenState } from "./in/RequestFullScreenState";

import { OutMessagePong } from "./out/Pong";
import { OutMessageSetToken } from "./out/SetToken";
import { OutMessageFullScreenOpened } from "./out/FullScreenOpened";
import { OutMessageFullScreenClosed } from "./out/FullScreenClosed";
import { OutMessageMetaSendData } from "./out/MetaSendData";

import { MessageDefinition } from "./Contract";

export * from "./Contract";

export const IN_MESSAGES = {
  InMessagePing: InMessagePing as MessageDefinition<{ version: string }>,
  InMessageRequestToken: InMessageRequestToken as MessageDefinition<void>,
  InMessageOpenFullScreen: InMessageOpenFullScreen as MessageDefinition<string>,
  InMessageCloseFullScreen: InMessageCloseFullScreen as MessageDefinition<void>,
  InMessageDestroyFullScreen: InMessageDestroyFullScreen as MessageDefinition<void>,
  InMessageSizeUpdate: InMessageSizeUpdate as MessageDefinition<number>,
  InMessageRequestFullScreenState: InMessageRequestFullScreenState as MessageDefinition<void>,
}

export const OUT_MESSAGES = {
  OutMessagePong: OutMessagePong as MessageDefinition<{ version: string }>,
  OutMessageSetToken: OutMessageSetToken as MessageDefinition<string>,
  OutMessageFullScreenOpened: OutMessageFullScreenOpened as MessageDefinition<void>,
  OutMessageFullScreenClosed: OutMessageFullScreenClosed as MessageDefinition<void>,
  OutMessageMetaSendData: OutMessageMetaSendData as MessageDefinition<{ registeredEvents: string[] }>,
}
