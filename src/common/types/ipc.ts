export type HandlerEvent<
  T extends Electron.Event,
  U extends { message: any; res: any }
> = (event: T, message: U["message"]) => Promise<U["res"]>;

export namespace Message {
  export interface Base {
    chanel: any;
    message: any;
    res: any;
  }

  export interface SetCredential {
    chanel: "SET_CREDENTIAL";
    message: {
      accessKeyId: string;
      secretAccessKey: string;
    };
    res: void;
  }

  export interface Upload {
    chanel: "UPLOAD";
    message: {
      bucketName: string;
      destDir: string;
      filePath: string;
    };
    res: string;
  }
}
