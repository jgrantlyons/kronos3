/* global chrome */

const injectForeground = async (id) => {
  await chrome.scripting.executeScript({
    target: { tabId: id},
    files: ['src/foreground.js']
  });
};

const injectForegroundNavigation = async (id) => {
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

      for (const i of Object.keys(library)) {
        if (tab.url.includes(i)) urlIsInLibrary = true;
      };

      chrome.tabs.query({}).then((activeTabs) => {
        if (urlIsInLibrary) {
          chrome.storage.sync.get('activeTabs', (obj) => {
            var focusedTabUrl;
            var pastTabUrl = false;

            for (const i of activeTabs) {
              if (i.id === tabId) {
                focusedTabUrl = new URL(i.url);
              }
            }
            
            for (const i of Object.values(obj.activeTabs)) {
              if (i.id === tabId) {
                pastTabUrl = new URL(i.url);
              }
            }

            console.log(pastTabUrl.host !== false);

            if (pastTabUrl.host !== false) {
              if (pastTabUrl.host === focusedTabUrl.host) {
                tabUpdateIsNavigational = true;
              }
            }
              
            if (tabUpdateIsNavigational === true) {
              console.log('navigational foreground injected')
              injectForegroundNavigation(tabId);
              // chrome.storage.sync.set({activeTabs});
            }
            else {
              console.log('regular foreground injected');
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
    if (request.message == 'updateActiveTabs') {
      chrome.tabs.query({}).then((activeTabs) => {
        chrome.storage.sync.set({activeTabs});
      })
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message.includes('newUrl')) {
      var message = request.message.split('-');
      var newUrl = message[1];

      chrome.tabs.query({}).then((activeTabs) => {
        for (const i of Object.values(activeTabs)) {
          if (i.url.includes(newUrl)) {
            injectForeground(i.id);
          }
        }
      });
    }
  }
)

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message.includes('urlRemoved')) {
      var message = request.message.split('-');
      var host = message[1];

      chrome.tabs.query({}).then((activeTabs) => {
        for (const i of Object.values(activeTabs)) {
          if (i.url.includes(host)) {
            chrome.tabs.sendMessage(i.id, {message: `urlRemoved-${host}`}); 
          }
        }
      })
    }
  }
)

chrome.tabs.query({}).then((activeTabs) => {
  chrome.storage.sync.set({activeTabs});
});