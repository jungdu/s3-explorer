export function getNameWithoutPath(name: string): string {
  return name
    .split("/")
    .filter(splitedName => !!splitedName)
    .slice(-1)[0];
}
