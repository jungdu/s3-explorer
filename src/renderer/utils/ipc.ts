import { IpcMessage } from "@common/types";
import { ipcRenderer } from "electron";

export function send(arg: IpcMessage) {
  const { chanel, ...message } = arg;
  ipcRenderer.send(chanel, JSON.stringify(message));
}
