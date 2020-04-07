import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { init } from "./ipc";

init();

let win: BrowserWindow | null;

// 이거 없어도 REACT_DEV_TOOLS 가 적용되는데 괜히 재시작만 느리게 만드는 느낌...
// const installExtensions = async () => {
// const installer = require("electron-devtools-installer");
// const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
// const extensions = ["REACT_DEVELOPER_TOOLS"];
// return Promise.all(
//   extensions.map(name => installer.default(installer[name], forceDownload))
// ).catch(console.log);
// };

const createWindow = async () => {
  // if (process.env.NODE_ENV !== "production") {
  //   await installExtensions();
  // }

  win = new BrowserWindow({
    x: 1,
    y: 10,
    width: 700,
    height: 1000,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "1";
    win.loadURL(`http://localhost:2003`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  if (process.env.NODE_ENV !== "production") {
    // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
    win.webContents.once("dom-ready", () => {
      win!.webContents.openDevTools();
    });
  }

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
