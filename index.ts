import chalk from "chalk";
import path from "path";
import { readScript, readScriptDir } from "./src/util";
import inquirer from "inquirer";
import { compile } from "./src/util/compiler";
import { SerialPort, ReadyParser } from "serialport";

const scriptDir = path.join(__dirname, "scripts");

console.log(
  chalk.bgHex("#ccc09a")(
    "歡迎使用",
    chalk.hex("#e46c2c").visible("MapleStory"),
    "腳本編譯器！"
  )
);

const scriptFiles = readScriptDir(scriptDir);
const scriptContent = readScript(path.join(scriptDir, scriptFiles[0]));

const result = compile(scriptContent);

console.log(result);

async function main() {
  const serialList = await SerialPort.list();
  const port = new SerialPort({
    path: serialList[0].path,
    baudRate: 9600,
  });
  const parser = port.pipe(new ReadyParser({ delimiter: "ready" }));
  await open(parser);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function open(parser: ReadyParser): Promise<void> {
  return new Promise((resolve) => {
    parser.on("open", () => {
      resolve();
    });
  });
}

main().then(() => process.exit());
