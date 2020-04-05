import fs from "fs";
import path from "path";

interface LocalFileAndFolderPaths {
  filePaths: string[];
  folderPaths: string[];
}

export function getAllLocalFilesInFolder(
  folderPath: string
): Promise<string[]> {
  return new Promise<string[]>(resolve => {
    getLocalFilesInAFolder(folderPath).then(({ filePaths, folderPaths }) => {
      if (folderPaths.length > 0) {
        Promise.all(
          folderPaths.map(localPath => {
            return getAllLocalFilesInFolder(localPath);
          })
        ).then(results => {
          let resultFilePaths: string[] = [];
          results.forEach(result => {
            resultFilePaths = [...resultFilePaths, ...result];
          });
          resolve(resultFilePaths);
        });
      } else {
        resolve(filePaths);
      }
    });
  });
}

function getLocalFilesInAFolder(
  folderPath: string
): Promise<LocalFileAndFolderPaths> {
  return new Promise<LocalFileAndFolderPaths>((resolve, reject) => {
    fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
      if (err) {
        reject(err);
      }

      const filePaths: string[] = [];
      const folderPaths: string[] = [];
      data.forEach(dirent => {
        if (dirent.isDirectory()) {
          folderPaths.push(path.resolve(folderPath, dirent.name));
        } else {
          filePaths.push(path.resolve(folderPath, dirent.name));
        }
      });

      resolve({ filePaths, folderPaths });
    });
  });
}

export function isDirectory(filePath: string): boolean {
  return fs.statSync(filePath).isDirectory();
}
