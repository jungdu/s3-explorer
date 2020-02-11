export enum FsType {
  FILE = "FILE",
  FOLDER = "FOLDER"
}

export interface FsObject {
  type: FsType;
  name: string;
}

export interface FsFile extends FsObject {
  type: FsType.FILE;
}

export interface FsFolder extends FsObject {
  type: FsType.FOLDER;
}
