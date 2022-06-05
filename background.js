// dynamic manuscript
let manuscript = {};
chrome.tabs.query({}).then((tabs) => {
  for (const i of tabs) {
    let domain = new URL(i.url);
    let data = { [domain.host]: 0 };
    manuscript = { ...manuscript, ...{ [i.id]: data } };
  }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete manuscript[tabId];
  chrome.storage.sync.set({ manuscript: manuscript });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    let domain = new URL(tab.url);
    domain = domain.host;
    if (manuscript[tabId] !== undefined) {
      if (manuscript[tabId] === domain) {
        chrome.storage.sync.set({ manuscript: manuscript });
        chrome.scripting.executeScript({
          target: { tabId: tabId, files: ["src/resume-count.js"] },
        });
      } else {
        manuscript[tabId] = { [domain]: 0 };
        startCount(tabId);
      }
    } else {
      let data = { [domain]: 0 };
      manuscript = { ...manuscript, ...{ [tabId]: data } };
      startCount(tabId);
    }
  }
});

const startCount = (id) => {
  chrome.storage.sync.set({ manuscript: manuscript });
  chrome.scripting.executeScript({
    target: { tabId: id },
    files: ["src/start-count.js"],
  });
};
