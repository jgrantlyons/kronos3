/* global chrome */

const injectForeground = async (id) => {
  chrome.scripting.executeScript({
    target: { tabId: id},
    files: ['src/foreground.js']
  });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {
    chrome.storage.sync.get('library', ({library}) => {
      var urlIsInLibrary = false;
      for (i of Object.keys(library)) {
        if (tab.url.includes(i)) urlIsInLibrary = true;
      }  
  
      if (urlIsInLibrary) injectForeground(tabId);
    });  
  }
});
