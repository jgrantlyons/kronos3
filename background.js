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
          count: 0
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

// inject foreground script into every tab with legit url upon initialization
initialize();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {
    chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
      console.log(tab);
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
    // chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
    //   console.log(activeTabs);
  
    //   let arrayOfActiveTabIds = [];
    //   activeTabs.map((activeTab) => arrayOfActiveTabIds.push(Ojbect.keys(activeTab)));
    //   console.log(arrayOfActiveTabIds);
    //   console.log(arrayOfActiveTabIds.indexOf(tabId))
  
    //   // if (arrayOfActiveTabIds.indexOf(tabInfo))
    //   // console.log(activeTabs, tabInfo);
    // });
    // console.log(tabId);
  };
});
  
  


// HINT: can't inject foreground on-created because it can't inject into a url chrome:// which is every new tab, so it needs to be on activated, then checked if real url
// chrome.tabs.onCreated.addListener((tabInfo) => {
//   let newActiveTab = {
//     [`${tabInfo.id}`]: {
//       url: [`${tabInfo.url}`],
//       count: 0
//     }
//   }
//   chrome.tabs.query({}).then((queryInfo) => {
//     let newActiveTabsObject = queryInfo.push(newActiveTab);

//     chrome.storage.sync.set({activeTabs: newActiveTabsObject});

//     injectForeground(tabInfo.id);
//   })
// })

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && !tab.url.includes('chrome://')) {
//     console.log(tabId, changeInfo, tab)
//   };
// });


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     // console.log(tabId);
//     // console.log(changeInfo);
//     // console.log(tab);
//     chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
//       console.log(activeTabs);
//       // if (!Object.values(activeTabs).includes(tabId)) {
//       //   let tabIds = activeTabs.push(tabId);
//       //   chrome.storage.sync.set({activeTabs});
//       //   injectForeground(tabId);
//       // }
//       // else {
//       //   console.log('tab already active');
//       // }
//     })
//   }
// })

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   if (changeInfo.status === 'complete') {
//     chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
//       if (!Object.values(activeTabs).includes(tabId)) {
//         let tabIds = activeTabs.push(tabId);
//         chrome.storage.sync.set({activeTabs});
//         injectForeground(tabId);
//       }
//       else {
//         console.log('tab already active');
//       }
//     })
//   }
// });