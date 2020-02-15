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

export interface IFsContorller {
  ls: (bucketName: string, folderName?: string) => Promise<Array<FsObject>>;
}

export interface IS3Controller extends IFsContorller {
  setCredential: (
    accessKeyId: string,
    secretAccessKey: string
  ) => Promise<BucketNames>;
}

export type BucketNames = Array<string>;

export function isFile(fsObject: FsObject): fsObject is FsFile {
  return fsObject.type === FsType.FILE;
}

export function isFolder(fsObject: FsObject): fsObject is FsFolder {
  return fsObject.type === FsType.FOLDER;
}
