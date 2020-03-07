import {
  BucketNames,
  FsFolder,
  FsObject,
  FsType,
  IS3Controller,
  isFolder
} from "@renderer/types/fs";
import { getNameWithoutPath } from "@renderer/utils/format";
import { action, observable } from "mobx";
import nanoid from "nanoid";

export class S3Store {
  s3Controller: IS3Controller;

  constructor(s3Controller: IS3Controller) {
    this.s3Controller = s3Controller;
  }

  @observable bucketNames: BucketNames = [];
  @observable currentFolder: FsFolder | null = null;
  @observable downloadFolder: string = "";
  fsObjectsInBucket: Map<string, FsObject> | null = null;
  @observable bucketLoading: boolean = false;
  @observable selectedBucket: string | null = null;
  @observable selectedObjects: Array<FsObject> = [];

  // TODO
  // 지금 구조는 map에 쌓이는 형태라서 memory leak이 발생할 수 있다.
  // 그러므로 openFolder를 통해서 불러올때 이전에 등록된
  // children에 대한 deregister작업이 필요하다
  // private deregisterFsObject(fsObject: FsObject): void {
  //   this.fsObjectsInBucket.delete(fsObject.name);
  // }

  private generateFolder(name: string): FsFolder {
    return {
      type: FsType.FOLDER,
      childNames: [],
      id: nanoid(),
      name
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

  private getFsObjectsInBucket(): Map<string, FsObject> {
    if (this.fsObjectsInBucket) {
      return this.fsObjectsInBucket;
    } else {
      throw new Error("no fsObjectsInBucket");
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

  private upload = (file: File): Promise<string> => {
    if (this.selectedBucket) {
      if (this.currentFolder !== null) {
        return this.s3Controller.upload(
          this.selectedBucket,
          this.currentFolder.name,
          file
        );
      } else {
        throw new Error("No currentFolder");
      }
    } else {
      throw new Error("No selectedBucket");
    }
  };

  @action
  addSelectedObject = (fsObject: FsObject) => {
    this.selectedObjects.push(fsObject);
    fsObject.selected = true;
  };

  deleteSelectedObjects = (): Promise<Array<boolean>> => {
    const prevFolder = this.currentFolder;
    let returnValue: Array<boolean>;
    return Promise.all(
      this.selectedObjects.map(selectedObj => {
        if (this.selectedBucket) {
          return this.s3Controller.rm(this.selectedBucket, selectedObj.name);
        } else {
          throw new Error("selectedBucket");
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

  downloadSelectedObject = () => {
    return Promise.all(
      this.selectedObjects.map(selectedObj => {
        if (this.selectedBucket) {
          if (selectedObj.selected) {
            selectedObj.name;
            return this.s3Controller.download(
              this.selectedBucket,
              selectedObj.name,
              `${this.downloadFolder}${getNameWithoutPath(selectedObj.name)}`
            );
          } else {
            throw new Error("SelectedObject isn't selected ");
          }
        } else {
          throw new Error("No Selected bucket");
        }
      })
    ).then(results => console.log("results :", results));
  };

  getFsObject = (name: string): FsObject => {
    console.log("name :", name);
    const targetObj = this.getFsObjectsInBucket().get(name);
    if (targetObj) {
      return targetObj;
    } else {
      throw new Error("no targetObject in fsObjects");
    }
  };

  openFolder = (folder: FsFolder) => {
    if (this.selectedBucket) {
      this.s3Controller.ls(this.selectedBucket, folder.name).then(fsObjects => {
        this.setChildrenOfFoler(folder, fsObjects);
        this.setCurrentFolder(folder);
      });
    } else {
      throw new Error("no selectedBucket");
    }
  };

  openFolderByName = (folderName: string) => {
    const folder = this.getFsObject(folderName);
    if (this.selectedBucket) {
      if (isFolder(folder)) {
        this.openFolder(folder);
      } else {
        throw new Error("Not a folder");
      }
    } else {
      throw new Error("No selectedBucket");
    }
  };

  openCurrentBucket = () => {
    if (this.selectedBucket) {
      this.selectBucket(this.selectedBucket);
    } else {
      throw new Error("no SelectedBucket");
    }
  };

  refreshCurrentFolder() {
    if (this.currentFolder) {
      return this.openFolder(this.currentFolder);
    } else {
      throw new Error("No currentFolder");
    }
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

      fsObjects.forEach(fsObj => {
        this.registerFsObject(fsObj);
        rootFolder.childNames.push(fsObj.name);
      });
      this.currentFolder = rootFolder;
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
    const newChildNames: Array<string> = [];
    childObjects.map(childObject => {
      const childName = childObject.name;
      if (this.isRegisteredObject(childName)) {
        const registedObject = this.getFsObject(childName);
        console.log("registedObject :", registedObject);
      } else {
        this.registerFsObject(childObject);
      }
      newChildNames.push(childName);
    });
    parent.childNames = newChildNames;
  }

  @action
  private setCurrentFolder(folder: FsFolder) {
    this.currentFolder = folder;
  }

  @action
  setDownloadFolder = (folder: string) => {
    this.downloadFolder = folder;
  };

  @action
  private setSelectedBucket(bucketName: string) {
    this.selectedBucket = bucketName;
  }

  uploadFiles = (files: FileList): Promise<string[]> => {
    const pms: Promise<string>[] = [];
    const prevFolder = this.currentFolder;
    for (let i = 0; i < files.length; i++) {
      console.log("files[i] :", files[i]);
      pms.push(this.upload(files[i]));
    }

    let returnValue: Array<string>;
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
