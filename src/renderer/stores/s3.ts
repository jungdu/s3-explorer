import { observable, action } from "mobx";
import nanoid from "nanoid";

import {
  BucketNames,
  FsObject,
  FsFolder,
  IS3Controller,
  FsType
} from "@renderer/types/fs";
import { getNameWithoutPath } from "@renderer/utils/format";

export class S3Store {
  s3Controller: IS3Controller;

  constructor(s3Controller: IS3Controller) {
    this.s3Controller = s3Controller;
  }

  @observable bucketNames: BucketNames = [];
  currentFolder: FsFolder | null = null;
  @observable filesInFolderView: Array<FsObject> = [];
  @observable downloadFolder: string = "";
  @observable fsObjects: Array<FsObject> = [];
  @observable loading: boolean = false;
  @observable selectedBucket: string | null = null;
  @observable selectedObjects: Array<FsObject> = [];

  private getRootFolder(): FsFolder {
    return {
      type: FsType.FOLDER,
      children: [],
      id: nanoid(),
      name: ""
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

  openFolder = (folder: FsFolder) => {
    if (this.selectedBucket) {
      this.s3Controller.ls(this.selectedBucket, folder.name).then(fsObjects => {
        this.setChildrenOfFoler(folder, fsObjects);
        this.setFilesInFolderView(fsObjects);
        this.currentFolder = folder;
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
        this.setFilesInFolderView(fsObjects);
        this.setFsObjects(fsObjects);
        this.currentFolder = this.getRootFolder();
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
    fsFolder.children = fsObjects;
  }

  @action
  setFilesInFolderView(fsObjects: Array<FsObject>) {
    this.filesInFolderView = fsObjects;
  }

  @action
  setDownloadFolder = (folder: string) => {
    this.downloadFolder = folder;
  };

  @action
  setFsObjects(fsObjects: Array<FsObject>) {
    this.fsObjects = fsObjects;
  }

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
