export enum FsType {
  FILE = "FILE",
  FOLDER = "FOLDER"
}

interface Selectable {
  selected?: boolean;
}

export interface FsCommonFiled extends Selectable {
  id: string;
  name: string;
  type: FsType;
}

export interface FsFile extends FsCommonFiled {
  type: FsType.FILE;
}

export interface FsFolder extends FsCommonFiled {
  type: FsType.FOLDER;
  childNames: Array<string>;
}

export type FsObject = FsFile | FsFolder;

export interface IFsContorller {
  ls: (bucketName: string, folderName?: string) => Promise<Array<FsObject>>;
  download: (
    bucketName: string,
    fileName: string,
    distPath: string
  ) => Promise<string>;
  rm(bucketName: string, fileName: string): Promise<boolean>;
  upload: (bucketName: string, destDir: string, file: File) => Promise<string>;
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
