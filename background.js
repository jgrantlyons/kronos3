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
      injectForeground(tabInfo.id);
      }
    });

    chrome.storage.sync.set({activeTabs: activeTabs});
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {
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

  // chrome.tabs.sendMessage(tabId, {greeting: "hello"}, (response) => {
  //   console.log(response.farewell);
  // });


});

initialize();