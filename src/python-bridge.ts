import * as path from "path";
import { PythonShell } from "python-shell";
import { app } from "electron";

const basePath = app.isPackaged ? process.resourcesPath : ".";
const scriptPath = path.join(basePath, "script.py");

async function handleRunPythonCode(path: string): Promise<any> {
  const options = { args: [path] };

  return PythonShell.run(scriptPath, options);
};

export { handleRunPythonCode };
