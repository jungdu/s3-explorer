import {
  BucketNames,
  FsFolder,
  FsObject,
  FsType,
  IS3Controller
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
  @observable loading: boolean = false;
  @observable selectedBucket: string | null = null;
  @observable selectedObjects: Array<FsObject> = [];

  private generateFolder(name: string = ""): FsFolder {
    return {
      type: FsType.FOLDER,
      children: [],
      id: nanoid(),
      name
    };
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
    console.log("this.selectedObjects before :", this.selectedObjects);
    this.selectedObjects = this.selectedObjects.filter(
      selectedObject => selectedObject !== fsObject
    );
    console.log("this.selectedObjects after :", this.selectedObjects);
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

  // 지금 까지는 Tree구조로 가질 필요는 없지만
  // 이후에 필요하기 때문에 냅둠.
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
    const folder = this.generateFolder(folderName);

    if (this.selectedBucket) {
      this.s3Controller.ls(this.selectedBucket, folder.name).then(fsObjects => {
        this.setChildrenOfFoler(folder, fsObjects);
        this.setCurrentFolder(folder);
        console.log("this.currentFolder :", this.currentFolder);
      });
    } else {
      throw new Error("no selectedBucket");
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
    if (bucketName) {
      this.s3Controller.ls(bucketName).then(fsObjects => {
        this.setSelectedBucket(bucketName);
        const rootFolder = this.generateFolder();
        this.setChildrenOfFoler(rootFolder, fsObjects);
        this.setCurrentFolder(rootFolder);
        console.log("footFolder :", this.currentFolder);
      });
    }
  };

  @action
  selectObject = (selectedObject: FsObject) => {
    this.resetSelectedObjects();
    this.selectedObjects = [selectedObject];
    selectedObject.selected = true;
  };

  @action
  setBucketLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  setBucketNames(bucketNames: BucketNames) {
    this.bucketNames = bucketNames;
  }

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
  setChildrenOfFoler(fsFolder: FsFolder, fsObjects: Array<FsObject>): void {
    console.log("차일드 바뀜!!!!!");
    fsFolder.children = fsObjects;
  }

  @action
  setCurrentFolder(folder: FsFolder) {
    this.currentFolder = folder;
  }

  @action
  setDownloadFolder = (folder: string) => {
    this.downloadFolder = folder;
  };

  @action
  setSelectedBucket(bucketName: string) {
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
