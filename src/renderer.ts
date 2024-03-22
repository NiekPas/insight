// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import TextProcessingOptions, { TopicModellingOptions } from "./types/TextProcessingOptions";
import WordFrequencies from "./types/WordFrequencies";

declare var bootstrap: {
  Toast: {
    getOrCreateInstance: (e: HTMLElement) => { show: () => void; };
  };
};

interface ContextBridge {
  electronAPI: {
    analyzeFile: (path: string, options: TextProcessingOptions) => Promise<string[]>;
  };
};

type WordFrequency = [string, number];

document.getElementById("document-upload").addEventListener("submit", handleFormSubmit);

// Enable form submit button after the user selects a file.
document.getElementById('formFile').addEventListener('change', function () {
  const formSubmitButton = document.getElementById('formSubmit') as HTMLButtonElement;
  formSubmitButton.disabled = (this as HTMLInputElement).files.length < 1;
});

// We need to use the 'input' event, since the 'change' handler only fires when the mouse is released.
document.getElementById('numberOfTopics').addEventListener('input', updateNumberOfTopicsLabel);
// Do this on page load to display the default number of topics right away
updateNumberOfTopicsLabel();

function handleFormSubmit(e: SubmitEvent): void {
  e.preventDefault();

  const file = (document.getElementById('formFile') as HTMLInputElement).files[0];

  if (!file) {
    displayError(new Error('Please select a file before submitting.'));
    return;
  }

  const removeStopwords = (document.getElementById('removeStopwords') as HTMLInputElement).checked;
  const removePunctuation = (document.getElementById('removePunctuation') as HTMLInputElement).checked;
  const topicModellingOptions: TopicModellingOptions = {
    runTopicModelling: (document.getElementById('runTopicModelling') as HTMLInputElement).checked,
    numberOfTopics: (document.getElementById('numberOfTopics') as HTMLInputElement).valueAsNumber
  };

  // Enforce at least 5 topics if topic modelling is checked
  if (topicModellingOptions.runTopicModelling && topicModellingOptions.numberOfTopics < 5) {
    return displayError(new Error("Topic modelling requires at least 5 topics."));
  }

  const options: TextProcessingOptions = { removeStopwords, removePunctuation, topicModellingOptions };

  runAnalysis(file, options)
    .then(parsePythonResponse)
    .then(sortByFrequency)
    .then(displayData)
    .catch(displayError);
}

function runAnalysis(file: File, options: TextProcessingOptions): Promise<string[]> {
  return (window as unknown as ContextBridge).electronAPI.analyzeFile(file.path, options);
}

function displayError(error: Error): void {
  const errorToast = document.getElementById('errorToast');
  const errorToastBody = document.getElementById('error-toast-body');

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(errorToast);
  errorToastBody.innerText = error.message;
  toastBootstrap.show();

  console.error(error);
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
    debugger;
    const jsonObject: WordFrequencies = JSON.parse(jsonString);
    debugger;
    return jsonObject;
  } catch (e) {
    console.error("Couldn't parse JSON", e);
  }
}

function sortByFrequency(wordFrequencies: WordFrequencies): WordFrequency[] {
  return Object.entries(wordFrequencies)
    .sort(([_word1, frequency1], [_word2, frequency2]) => frequency2 - frequency1);
}

function updateNumberOfTopicsLabel() {
  const numberOfTopics = (document.getElementById('numberOfTopics') as HTMLInputElement).value;
  document.getElementById('numberOfTopicsLabel').innerHTML = `Number of topics: ${numberOfTopics}`;
}
