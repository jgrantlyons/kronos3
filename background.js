let manuscript = {};
//initialize manuscript
chrome.tabs.query({}).then((tabs) => {
  for (const i of tabs) {
    let domain = new URL(i.url);
    let data = { host: domain.host, count: 0 };
    manuscript = { ...manuscript, ...{ [i.id]: data } };
  }
});

// removed tab listener
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  delete manuscript[tabId];
});

// onload listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    let domain = new URL(tab.url);
    console.log(domain.host, manuscript[tabId].host);
    if (domain.host === manuscript[tabId].host) {
      console.log("native navigation");
    } else {
      let token = { url: domain.host, count: 0 };
      manuscript[tabId] = token;
    }
    console.log(manuscript);
  }
});

// let localManuscript = {};
// const initialize = () => {
//   chrome.tabs.query({}).then((tabs) => {
//     for (const [key, value] of Object.entries(tabs)) {
//       let tokenContent = { host: value.url, count: 0 };
//       let tokenId = value.id;
//       let token = { [tokenId]: tokenContent };
//       localManuscript = { ...localManuscript, ...token };
//     }
//   });
// };
// setTimeout(() => {
//   initialize();
// }, 2000);

// //run foreground in active tab
// const runForeground = () => {
//   chrome.tabs.query({}).then((tabs) => {
//     for (const [key, value] of Object.entries(tabs)) {
//       value.active === true
//         ? chrome.scripting.executeScript({
//             target: { tabId: value.id },
//             files: ["src/foreground.js"],
//           })
//         : console.log("failed /background 8");
//     }
//   });
// };

// setTimeout(() => {
//   runForeground();
// }, 2000);
// Manifest V3 extension
