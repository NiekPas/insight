import { flow } from "lodash";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

const runPythonButton = document.getElementById('python');

interface ContextBridge {
  electronAPI: {
    runPythonCode: () => Promise<void>;
  };
};

runPythonButton.addEventListener('click', async () => {
  await (window as unknown as ContextBridge).electronAPI.runPythonCode();
});

interface WordFrequencyData {
  // TODO
}

interface DocumentTermMatrix {
  // TODO
}

document.getElementById("document-upload").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("form submitted");

  handleEvent(e);
});

function handleEvent(e: SubmitEvent): Promise<WordFrequencyData> {
  const file = (document.getElementById('formFile') as HTMLInputElement).files[0];

  if (!file) {
    return Promise.reject(new Error('Please select a file before submitting.'));
  }

  const analyze: (file: File) => WordFrequencyData =
    flow([extractFileText, preProcess, documentTermMatrix, wordFrequencies]);
  return Promise.resolve(analyze(file));
}

function extractFileText(file: File): string {
  throw new Error("Function not implemented.");
}

function documentTermMatrix(text: string): Promise<DocumentTermMatrix> {
  throw new Error("Function not implemented");
};

function wordFrequencies(_: _): Promise<WordFrequencyData> {
  throw new Error("Function not implemented.");
};

// Doing this the ugly way because JS _still_ doesn't support properly typed function composition, nor does it have a pipe operator... I miss Haskell :(
function preProcess(text: string): [string] {
  return removeStopwords(lemmatize(tokenize(removeChars(text))));
};

function tokenize(text: string): [string] {
  throw new Error("Function not implemented.");
}

function removeStopwords(words: [string]): [string] {
  throw new Error("Function not implemented.");
}

function removeChars(text: string): string {
  throw new Error("Function not implemented.");
}

function lemmatize(words: [string]): [string] {
  throw new Error("Function not implemented.");
}
