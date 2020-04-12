export enum ItemKey {
  DOWNLOAD_PATH = "DOWNLOAD_PATH",
}

export function setStorageItem(key: ItemKey, value: string) {
  window.localStorage.setItem(key, value);
}

export function getStorageItem(key: ItemKey): string | null {
  return window.localStorage.getItem(key);
}
