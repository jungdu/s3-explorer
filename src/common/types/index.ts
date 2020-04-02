interface IpcHandlerGen<T extends IpcMessage> extends Pick<T, "chanel"> {
  handler: (event: Electron.IpcMainEvent, message: Omit<T, "chanel">) => void;
}

type UploadMessage = {
  chanel: "UPLOAD";
  bucketName: string;
  destDir: string;
  filePath: string;
};

type DownloadMessage = {
  chanel: "DOWNLOAD";
  signedUrl: string;
  downloadPath: string;
};

type UploadHander = IpcHandlerGen<UploadMessage>;
type DownloadHandler = IpcHandlerGen<DownloadMessage>;

export type IpcMessage = UploadMessage | DownloadMessage;
export type IpcHandler = UploadHander | DownloadHandler;
