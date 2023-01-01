/* global chrome */
chrome.tabs.query({}).then((activeTabs) => {
  chrome.storage.sync.set({activeTabs});
});

const injectForeground = async (id) => {
  await chrome.scripting.executeScript({
    target: { tabId: id},
    files: ['src/foreground.js']
  });
};

const injectForegroundIntoNavigationalTab = async (id) => {
  await chrome.scripting.executeScript({
    target: { tabId: id}, 
    files: ['src/foreground-navigation.js']
  });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {
    chrome.storage.sync.get('library', ({library}) => {
      var urlIsInLibrary = false;
      var tabUpdateIsNavigational = false;

      for (i of Object.keys(library)) {
        if (tab.url.includes(i)) urlIsInLibrary = true;
      };

      chrome.tabs.query({}).then((activeTabs) => {
        if (urlIsInLibrary) {
          chrome.storage.sync.get('activeTabs', (obj) => {
            var focusedTabUrl = new URL(activeTabs[tab.index].url);
            var pastTabUrl = new URL(obj.activeTabs[tab.index].url);
  
            if (focusedTabUrl.host === pastTabUrl.host) tabUpdateIsNavigational = true;
              
            if (tabUpdateIsNavigational === true) {
              injectForegroundIntoNavigationalTab(tabId)
            }
            else {
              injectForeground(tabId);
              chrome.storage.sync.set({activeTabs});
            }
          });
        }
      });
    });  
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "updateActiveTabs") {
      chrome.tabs.query({}).then((activeTabs) => {
        chrome.storage.sync.set({activeTabs});
      })
    }
  }
);