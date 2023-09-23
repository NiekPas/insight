import * as path from "path";
import { Options, PythonShell } from "python-shell";
import { app } from "electron";
import TextProcessingOptions from "./types/TextProcessingOptions";

const basePath = app.isPackaged ? process.resourcesPath : ".";
const scriptPath = path.join(basePath, "script.py");

async function handleAnalyzeFile(path: string, textProcessingOptions: TextProcessingOptions): Promise<string[]> {
  const args: string[] = [path, ...toArgStrings(textProcessingOptions)];
  const options: Options = { args };

  return PythonShell.run(scriptPath, options);
};

function toArgStrings(textProcessingOptions: TextProcessingOptions): string[] {
  let args = [];

  if (textProcessingOptions.removeStopwords) { args.push("--remove-stopwords"); };
  if (textProcessingOptions.removePunctuation) { args.push("--remove-punctuation"); };

  return args;
}

export { handleAnalyzeFile };
