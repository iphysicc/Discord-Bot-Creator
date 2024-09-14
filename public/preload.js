const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },

  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory')
});

console.log('Preload script loaded');