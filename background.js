/* global chrome */
const injectForeground = (id) => {
  chrome.scripting.executeScript({
    target: { tabId: id},
    files: ['src/foreground.js']
  });
}

const initialize = async () => {
  await chrome.storage.sync.set({activeTabs: []});

  chrome.tabs.query({}).then((queryInfo) => {
    let activeTabs = [];

    queryInfo.map((tabInfo) => {
      let tabData = {
        [`${tabInfo.id}`]: {
          url: [`${tabInfo.url}`],
          count: 0,
          isActive: false
        }
      };

      activeTabs.push(tabData)

      if (!tabInfo.url.includes('chrome://' || '')) {
        // TODO: if in library...
      injectForeground(tabInfo.id);
      }
    });

    chrome.storage.sync.set({activeTabs: activeTabs});
  });
}

// TODO: before reload, set activetabs where tabId matches this current tabid, and update the count and url

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      if (msg.text == "getId") {
          sendResponse({tab: sender.tab.id});
       }
    });

    chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
      let newTab = {
        [`${tabId}`]: {
          url: [`${tab.url}`],
          count: 0
        }
      }
      
      let updatedActiveTabs = activeTabs;
      updatedActiveTabs.push(newTab);

      chrome.storage.sync.set({activeTabs: updatedActiveTabs});

      injectForeground(tabId);
    })
  };
});

initialize();