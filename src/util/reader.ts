import fs from "fs";

const scriptExtentions = [".mss"];

export const readScriptDir = (dir: string): string[] => {
  const files = fs.readdirSync(dir);
  return files.filter((file) => scriptExtentions.includes(file.slice(-4)));
};

export const readScript = (path: string): string => {
  const script = fs.readFileSync(path, "utf-8");
  return script;
};
