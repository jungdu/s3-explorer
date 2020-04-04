import { getAllLocalFilesInFolder } from "@common/utils/fileSystem";
import { getNameWithoutPath } from "@common/utils/format";
import S3Controller from "@renderer/utils/aws/S3Controller";
import fs from "fs";
import { action, observable } from "mobx";
import nanoid from "nanoid";
import path from "path";
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
  @observable downloadFolder: string = "";
  fsObjectsInBucket: Map<string, FsObject> | null = null;
  @observable bucketLoading: boolean = false;
  @observable selectedBucket: string | null = null;
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
    if (this.selectedBucket) {
      return this.selectedBucket;
    } else {
      throw new Error("No selectedBucket");
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

  @action
  private setBucketLoading(loading: boolean) {
    this.bucketLoading = loading;
  }

  @action
  private setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

  @action
  private setCurrentFolder(folder: FsFolder) {
    this.currentFolder = folder;
  }

  @action
  private setSelectedBucket(bucketName: string) {
    this.selectedBucket = bucketName;
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

  private uploadFolder = (folderPath: string): Promise<string[]> => {
    return getAllLocalFilesInFolder(folderPath).then(filePaths => {
      const destFolderInBucket = path.join(
        this.getCurrentFolder().name,
        getNameWithoutPath(folderPath)
      );

      return Promise.all<string>(
        filePaths.map(filePath => this.uploadFile(filePath, destFolderInBucket))
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
        return this.s3Controller.rm(this.getSelectedBucket(), selectedObj.name);
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

  downloadSelectedObject = () => {
    return Promise.all(
      this.selectedObjects.map(selectedObj => {
        if (selectedObj.selected) {
          selectedObj.name;
          return this.s3Controller.download(
            this.getSelectedBucket(),
            selectedObj.name,
            `${this.downloadFolder}${getNameWithoutPath(selectedObj.name)}`
          );
        } else {
          throw new Error("SelectedObject isn't selected ");
        }
      })
    ).then(results => console.log("results :", results));
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
      this.setSelectedBucket(bucketName);
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
  setDownloadFolder = (folder: string) => {
    this.downloadFolder = folder;
  };

  uploadFiles = (files: FileList): Promise<(string | string[])[]> => {
    const pms: Promise<string | string[]>[] = [];
    const prevFolder = this.currentFolder;
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i].path;
      if (fs.statSync(filePath).isDirectory()) {
        pms.push(this.uploadFolder(filePath));
      } else {
        pms.push(this.uploadFile(filePath));
      }
    }

    let returnValue: Array<string | string[]>;
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
