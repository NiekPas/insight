// import { flow } from "lodash";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

interface ContextBridge {
  electronAPI: {
    runPythonCode: (path: string) => Promise<[string]>;
  };
};

document.getElementById("document-upload").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted");

  // TODO handle promise rejections (e.g. the user not having selected a file) by showing an error to the user
  handleFormSubmit(e);
});

function handleFormSubmit(e: SubmitEvent): Promise<any> {
  const file = (document.getElementById('formFile') as HTMLInputElement).files[0];

  if (!file) {
    return Promise.reject(new Error('Please select a file before submitting.'));
  }

  console.log("Before analyze");
  const analyze: (file: File) => Promise<[string]> =
    (file) => (window as unknown as ContextBridge).electronAPI.runPythonCode(file.path);

  return Promise.resolve(analyze(file));
}

function extractFileText(file: File): string {
  throw new Error("Function not implemented.");
}
