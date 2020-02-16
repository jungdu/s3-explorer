import { observable, action } from "mobx";

import {
  BucketNames,
  FsObject,
  FsFolder,
  IS3Controller
} from "@renderer/types/fs";

export class S3Store {
  s3Controller: IS3Controller;

  constructor(s3Controller: IS3Controller) {
    this.s3Controller = s3Controller;
  }

  @observable bucketNames: BucketNames = [];
  @observable fsObjects: Array<FsObject> = [];
  @observable loading: boolean = false;
  @observable selectedBucket: string | null = null;
  selectedObjects: Array<FsObject> = [];

  @action
  addSelectedObject = (selectedObject: FsObject) => {
    this.selectedObjects.push(selectedObject);
    selectedObject.selected = true;
  };

  openFolder = (folder: FsFolder) => {
    if (this.selectedBucket) {
      this.s3Controller.ls(this.selectedBucket, folder.name).then(fsObjects => {
        this.setChildrenOfFoler(folder, fsObjects);
      });
    } else {
      throw new Error("no selectedBucket");
    }
  };

  @action
  selectBucket = (bucketName: string) => {
    if (bucketName) {
      this.s3Controller.ls(bucketName).then(fsObjects => {
        this.setSelectedBucket(bucketName);
        this.setFsObjects(fsObjects);
      });
    }
  };

  @action
  selecteObject = (selectedObject: FsObject) => {
    const prevSelectedObject = this.selectedObjects;
    prevSelectedObject.forEach(fsObject => {
      fsObject.selected = false;
    });
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
  setFsObjects(fsObjects: Array<FsObject>) {
    this.fsObjects = fsObjects;
  }

  @action
  setChildrenOfFoler(fsFolder: FsFolder, fsObjects: Array<FsObject>): void {
    fsFolder.children = fsObjects;
  }

  @action
  setSelectedBucket(bucketName: string) {
    this.selectedBucket = bucketName;
  }
}
