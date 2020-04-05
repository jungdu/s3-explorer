export function getNameWithoutPath(name: string): string {
  return name
    .split("/")
    .filter(splitedName => !!splitedName)
    .slice(-1)[0];
}

function getParentFolderName(name: string): string {
  return name
    .split("/")
    .filter(splitedName => !!splitedName)
    .slice(0, -1)
    .join("/");
}

function getRelativeFileName(basePath: string, absolutePath: string): string {
  if (basePath.indexOf(absolutePath) !== 0) {
    return absolutePath.replace(basePath, "");
  } else {
    throw new Error(
      `BasePath(${basePath}) doesn't contain file(${absolutePath})`
    );
  }
}
export function getRelativeParentFolderName(
  basePath: string,
  absolutePath: string
): string {
  return getParentFolderName(getRelativeFileName(basePath, absolutePath));
}

export function isFolderName(name: string) {
  return name.slice(-1) === "/";
}
