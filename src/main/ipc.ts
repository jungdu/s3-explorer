import { HandlerEvent, Message } from "@common/types/ipc";
import S3Controller from "@main/aws/S3Controller";
import { ipcMain } from "electron";

interface HandleHandler<T extends Message.Base> extends Pick<T, "chanel"> {
  handler: HandlerEvent<Electron.IpcMainInvokeEvent, T>;
}

export function invokeHandle<T extends Message.Base>(arg: HandleHandler<T>) {
  ipcMain.handle(arg.chanel, (event, message) => {
    return arg.handler(event, message);
  });
}

export function init() {
  const s3Controller = new S3Controller();

  invokeHandle<Message.Download>({
    chanel: "DOWNLOAD",
    handler: (event, message) => {
      const { bucketName, srcFileName, destPath } = message;
      return s3Controller.download(bucketName, srcFileName, destPath);
    },
  });

  invokeHandle<Message.SetCredential>({
    chanel: "SET_CREDENTIAL",
    handler: (electronEvent, message) => {
      const { accessKeyId, secretAccessKey } = message;
      s3Controller.setCredential(accessKeyId, secretAccessKey);
      return Promise.resolve();
    },
  });

  invokeHandle<Message.Upload>({
    chanel: "UPLOAD",
    handler: (electronEvent, message) => {
      const { bucketName, destDir, filePath } = message;
      return s3Controller.upload(bucketName, destDir, filePath);
    },
  });
}
