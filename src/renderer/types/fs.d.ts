declare enum FsType {
  FILE = "FILE",
  FODLER = "FOLDER"
}

declare interface FsObject {
  type: FsType;
  name: string;
}

declare interface FsFile extends FsObject {
  type: FsType.FILE;
}

declare interface FsFolder extends FsObject {
  type: FsType.FODLER;
}
