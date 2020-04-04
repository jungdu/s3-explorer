import { Message } from "@common/types/ipc";
import { ipcRenderer } from "electron";

export function invoke<T extends Message.Base>(
  arg: Pick<T, "chanel" | "message">
): Promise<T["res"]> {
  const { chanel, message } = arg;
  return new Promise(resolve => {
    ipcRenderer.invoke(chanel, message).then(result => {
      resolve(result);
    });
  });
}
