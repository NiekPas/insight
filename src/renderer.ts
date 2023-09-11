// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import WordFrequencies from "./types/WordFrequencies";

interface ContextBridge {
  electronAPI: {
    runPythonCode: (path: string) => Promise<string[]>;
  };
};

type WordFrequency = [string, number];

document.getElementById("document-upload").addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e: SubmitEvent): void {
  e.preventDefault();

  const file = (document.getElementById('formFile') as HTMLInputElement).files[0];

  if (!file) {
    displayError(new Error('Please select a file before submitting.'));
    return;
  }

  wordFrequenciesFromFile(file)
    .then(parsePythonResponse)
    .then(sortByFrequency)
    .then(displayData)
    .catch(displayError);
}

function wordFrequenciesFromFile(file: File): Promise<string[]> {
  return (window as unknown as ContextBridge).electronAPI.runPythonCode(file.path);
}

function displayError(error: Error): void {
  // TODO: prettier errors
  alert(error);
}

function displayData(wordFrequencies: WordFrequency[]): void {
  document.getElementById('data').innerHTML = wordFrequenciesTable(wordFrequencies);
}

function wordFrequenciesTable(wordFrequencies: WordFrequency[]): string {
  return `
  <table class="table">
    <thead>
      <tr><th scope="col">Word</th><th scope="col">Frequency</th></tr>
    </thead>
    <tbody>
      ${wordFrequencies.map(generateRow).join('')}
    </tbody>
  </table>
  `;
}

function generateRow([word, frequency]: [string, number]): string {
  return `<tr><td>${word}</td><td>${frequency}</td>`;
}
function parsePythonResponse(jsonStrings: string[]): WordFrequencies {
  // We receive the response as an array of strings which together form a JSON string,
  // so we need to concatenate the array and then parse it into a JSON object.
  const jsonString = jsonStrings.join('');

  // Parse the JSON string into an object
  try {
    const jsonObject: WordFrequencies = JSON.parse(jsonString);
    return jsonObject;
  } catch (e) {
    console.error("Couldn't parse JSON", e);
  }
}

function sortByFrequency(wordFrequencies: WordFrequencies): WordFrequency[] {
  return Object.entries(wordFrequencies)
    .sort(([_word1, frequency1], [_word2, frequency2]) => frequency2 - frequency1);
}
