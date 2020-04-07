import S3Controller from "@renderer/utils/aws/S3Controller";
import { action, observable } from "mobx";
import nanoid from "nanoid";
import path from "path";
import {
  getNameWithoutPath,
  getRelativeParentFolderName,
  isFolderName,
} from "@common/utils/format";
import {
  getAllLocalFilesInFolder,
  isDirectory,
} from "@common/utils/fileSystem";
import {
  BucketNames,
  FsFolder,
  FsObject,
  FsType,
  isFolder,
} from "@renderer/types/fs";

export class S3Store {
  s3Controller: S3Controller;

  constructor(s3Controller: S3Controller) {
    this.s3Controller = s3Controller;
  }

  @observable bucketNames: BucketNames = [];
  @observable currentFolder: FsFolder | null = null;
  @observable downloadPath: string = "";
  fsObjectsInBucket: Map<string, FsObject> | null = null;
  @observable bucketLoading: boolean = false;
  @observable currentBucket: string | null = null;
  @observable selectedObjects: Array<FsObject> = [];

  private generateFolder(name: string): FsFolder {
    return {
      type: FsType.FOLDER,
      childNames: [],
      id: nanoid(),
      name,
    };
  }

  // TODO 필요할 날이 올 것 같음
  // private getRootFolder(): FsFolder {
  //   const rootFolder = this.getFsObject("/");
  //   if (rootFolder) {
  //     if (isFolder(rootFolder)) {
  //       return rootFolder;
  //     } else {
  //       throw new Error("rootFolder is not type of Folder");
  //     }
  //   } else {
  //     throw new Error("no rootFolder");
  //   }
  // }

  private deregisterFsObject(fsObjName: string): void {
    this.getFsObjectsInBucket().delete(fsObjName);
  }

  private deregisterFsObjects(
    fsObjNames: Array<string>,
    parentName?: string
  ): void {
    if (parentName) {
      fsObjNames.forEach(fsObjName => {
        this.deregisterFsObject(parentName + fsObjName);
      });
    } else {
      fsObjNames.forEach(fsObjName => {
        this.deregisterFsObject(fsObjName);
      });
    }
  }

  private getCurrentFolder(): FsFolder {
    if (this.currentFolder) {
      return this.currentFolder;
    } else {
      throw new Error("No current folder");
    }
  }

  private getFsObjectsInBucket(): Map<string, FsObject> {
    if (this.fsObjectsInBucket) {
      return this.fsObjectsInBucket;
    } else {
      throw new Error("No fsObjectsInBucket");
    }
  }

  private getSelectedBucket(): string {
    if (this.currentBucket) {
      return this.currentBucket;
    } else {
      throw new Error("No currentBucket");
    }
  }

  private isRegisteredObject(objectName: string): boolean {
    return this.getFsObjectsInBucket().has(objectName);
  }

  private registerFsObject(fsObject: FsObject): void {
    this.getFsObjectsInBucket().set(fsObject.name, observable(fsObject));
  }

  private registerRootFolder(): FsFolder {
    const rootFolder = this.generateFolder("");
    this.getFsObjectsInBucket().set("/", rootFolder);
    return rootFolder;
  }

  private resetFolderViewStatus() {
    this.setCurrentBucket(null);
    this.fsObjectsInBucket = null;
    this.setCurrentFolder(null);
    this.resetSelectedObjects();
  }

  @action
  private setBucketLoading(loading: boolean) {
    this.bucketLoading = loading;
  }

  @action
  private setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

  @action
  private setCurrentFolder(folder: FsFolder | null) {
    this.currentFolder = folder;
  }

  @action
  private setCurrentBucket(bucketName: string | null) {
    this.currentBucket = bucketName;
  }

  private uploadFile = (
    fileName: string,
    uploadTo?: string
  ): Promise<string> => {
    return this.s3Controller.upload(
      this.getSelectedBucket(),
      uploadTo ? uploadTo : this.getCurrentFolder().name,
      fileName
    );
  };

  private uploadFolder = (localFolderPath: string): Promise<string[]> => {
    return getAllLocalFilesInFolder(localFolderPath).then(localFilePaths => {
      return Promise.all<string>(
        localFilePaths.map(localFilePath => {
          const destFolderInBucket = path.join(
            this.getCurrentFolder().name,
            getNameWithoutPath(localFolderPath),
            getRelativeParentFolderName(localFolderPath, localFilePath)
          );
          return this.uploadFile(localFilePath, destFolderInBucket);
        })
      );
    });
  };

  @action
  addSelectedObject = (fsObject: FsObject) => {
    this.selectedObjects.push(fsObject);
    fsObject.selected = true;
  };

  createFolder = (folderName: string) => {
    this.s3Controller.mkdir(this.getSelectedBucket(), folderName).then(() => {
      this.refreshCurrentFolder();
    });
  };

  deleteSelectedObjects = (): Promise<Array<boolean>> => {
    const prevFolder = this.currentFolder;
    let returnValue: Array<boolean>;
    return Promise.all(
      this.selectedObjects.map(selectedObj => {
        if (isFolderName(selectedObj.name)) {
          return this.s3Controller.rmFolder(
            this.getSelectedBucket(),
            selectedObj.name
          );
        } else {
          return this.s3Controller.rmFile(
            this.getSelectedBucket(),
            selectedObj.name
          );
        }
      })
    )
      .then(result => {
        returnValue = result;
        if (prevFolder === this.currentFolder) {
          return this.refreshCurrentFolder();
        } else {
          return null;
        }
      })
      .then(() => returnValue);
  };

  @action
  deselectObject = (fsObject: FsObject) => {
    this.selectedObjects = this.selectedObjects.filter(
      selectedObject => selectedObject !== fsObject
    );
    fsObject.selected = false;
  };

  downloadSelectedObjects = () => {
    return Promise.all(
      this.selectedObjects.map(selectedObj => {
        if (selectedObj.selected) {
          selectedObj.name;
          return this.s3Controller.download(
            this.getSelectedBucket(),
            selectedObj.name,
            `${this.downloadPath}${getNameWithoutPath(selectedObj.name)}`
          );
        } else {
          throw new Error("SelectedObject isn't selected ");
        }
      })
    ).then(() => {
      // TODO 다운로드 완료된 파일들 다운로드 완료 되었다고 표시
    });
  };

  getFsObject = (name: string): FsObject => {
    const targetObj = this.getFsObjectsInBucket().get(name);
    if (targetObj) {
      return targetObj;
    } else {
      throw new Error("No targetObject in fsObjects");
    }
  };

  openFolder = (folder: FsFolder) => {
    this.resetSelectedObjects();
    this.s3Controller
      .ls(this.getSelectedBucket(), folder.name)
      .then(fsObjects => {
        this.setChildrenOfFoler(folder, fsObjects);
        this.setCurrentFolder(folder);
      });
  };

  openFolderByName = (folderName: string) => {
    const folder = this.getFsObject(folderName);
    if (isFolder(folder)) {
      this.openFolder(folder);
    } else {
      throw new Error("Not a folder");
    }
  };

  openCurrentBucket = () => {
    this.selectBucket(this.getSelectedBucket());
  };

  refreshCurrentFolder() {
    return this.openFolder(this.getCurrentFolder());
  }

  @action
  resetSelectedObjects = () => {
    this.selectedObjects.forEach(fsObject => {
      fsObject.selected = false;
    });
  };

  @action
  selectBucket = (bucketName: string) => {
    this.s3Controller.ls(bucketName).then(fsObjects => {
      this.fsObjectsInBucket = new Map<string, FsObject>();
      const rootFolder = this.registerRootFolder();
      this.setCurrentBucket(bucketName);
      this.setChildrenOfFoler(rootFolder, fsObjects);
      this.setCurrentFolder(rootFolder);
    });
  };

  @action
  selectObject = (selectedObject: FsObject) => {
    this.resetSelectedObjects();
    this.selectedObjects = [selectedObject];
    selectedObject.selected = true;
  };

  setCredential = (accessKeyId: string, secretAccessKey: string) => {
    this.setBucketLoading(true);
    this.resetFolderViewStatus();

    return this.s3Controller
      .setCredential(accessKeyId, secretAccessKey)
      .then(bucketNames => {
        this.setBucketLoading(false);
        this.setBucketNames(bucketNames);
      })
      .catch(err => {
        this.setBucketLoading(false);
        // TODO 에러 처리
        throw err;
      });
  };

  @action
  setChildrenOfFoler(parent: FsFolder, childObjects: Array<FsObject>): void {
    let prevChildNames = parent.childNames;
    const newChildNames: Array<string> = [];
    childObjects.forEach(childObject => {
      const childName = childObject.name;
      if (!this.isRegisteredObject(childName)) {
        this.registerFsObject(childObject);
      } else {
        prevChildNames = prevChildNames.filter(
          prevChildName => prevChildName !== childName
        );
      }
      newChildNames.push(childName);
    });
    parent.childNames = newChildNames;
    this.deregisterFsObjects(prevChildNames);
  }

  @action
  setDownloadPath = (folder: string) => {
    this.downloadPath = folder;
  };

  uploadFiles = (files: FileList): Promise<(string | string[])[]> => {
    const pms: Promise<string | string[]>[] = [];
    const prevFolder = this.currentFolder;
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i].path;
      if (isDirectory(filePath)) {
        pms.push(this.uploadFolder(filePath));
      } else {
        pms.push(this.uploadFile(filePath));
      }
    }

    let returnValue: Array<string | string[]>;

    // TODO 업로드 실패한 파일 처리 해야함.
    return Promise.all(pms)
      .then(result => {
        returnValue = result;
        // 업로드가 끝나도록 같은 FolderView를 보는 상황
        if (prevFolder === this.currentFolder) {
          return this.refreshCurrentFolder();
        } else {
          return null;
        }
      })
      .then(() => returnValue);
  };
}
