// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from 'electron';
import TextProcessingOptions from './types/TextProcessingOptions';

contextBridge.exposeInMainWorld('electronAPI', {
  analyzeFile: (path: string, options: TextProcessingOptions) => ipcRenderer.invoke('analyze-file', path, options)
});
