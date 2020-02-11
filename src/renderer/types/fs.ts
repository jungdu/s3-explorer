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

export function isFile(fsObject: FsObject): fsObject is FsFile {
  return fsObject.type === FsType.FILE;
}

export function isFolder(fsObject: FsObject): fsObject is FsFolder {
  return fsObject.type === FsType.FOLDER;
}
