// main process 개발할 때 변경사항이 생기면 실행된 electron을 종료하고 재시작
const path = require("path");
const { existsSync, readFileSync, unlinkSync, watchFile } = require("fs");
const { spawn } = require("child_process");

main();

function main(){
  runRendererDevServer();
  
  const mainFilePath = getMainFilePath();
  clearFile(mainFilePath);
  
  let mainProcess;
  watchFile(mainFilePath, () => {
    if(existsSync(mainFilePath)){
      if(mainProcess){
        mainProcess.kill();
        mainProcess = null;
      }
      mainProcess = runMainProcess(mainFilePath);
    }
  })

  buildMain();
}


function clearFile(filePath){
  if(existsSync(filePath)){
    unlinkSync(filePath)
  }
}

function getMainFilePath(){
  const packageJson = JSON.parse(
    readFileSync(path.resolve(__dirname, "../package.json"))
  );
  return path.resolve(__dirname, "..", packageJson.main);
}

function runMainProcess(mainFilePath){
  return spawn("yarn", ["start-electron"], {
    shell: true,
    env: process.env,
    stdio: "inherit"
  })
  .on("error", spawnError => console.error(spawnError));
}

function runRendererDevServer(){
  spawn("yarn", ["start-renderer-dev"], {
    shell: true,
    env: process.env,
    stdio: "inherit"
  })
  .on("error", spawnError => console.error(spawnError));
}

function buildMain(){
  spawn("yarn", ["watch-main-dev"], {
    shell: true,
    env: process.env,
    stdio: "inherit"
  })
  .on("error", spawnError => console.error(spawnError));
}