import { IpcHandler } from "@common/types";
import { ipcMain } from "electron";

export function mainOn(arg: IpcHandler) {
  ipcMain.on(arg.chanel, (event, message) => {
    arg.handler(event, JSON.parse(message));
  });
}

export function init() {}
