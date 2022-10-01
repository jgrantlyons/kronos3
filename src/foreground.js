/* global chrome */

if (typeof document.hidden !== "undefined") {
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
var count = 0;
var isActive = true;
var documentTitle = document.title;
var thisTabId = false;

chrome.runtime.sendMessage({ text: "getId" }, tabId => {
  thisTabId = tabId;
});

// var activeTabs = [];
var activeTabsArray = {};
chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
  activeTabsArray = {activeTabs};
});


const adjustTitle = ({count}) => {
  let titleString = count + ' ' + documentTitle;
  document.title = titleString;
}

const startCount = (count) => {
  setInterval(() => {
    if (isActive !== false) {
      adjustTitle({count})
      count++;
    };
  }, 1000);
};

const handleIsVisible = () => {
  isActive = true;
};

const handleIsHidden = () => {
  isActive = false;
};

const handleVisibilityChange = () => {
  document[hidden]
    ? handleIsHidden()
    : handleIsVisible();
}

// Todo: before reload complete, update activeTabs
//run foreground script when url is updated

chrome.storage.sync.get('library', ({library}) => {
  let href = window.location.href;
  let flagFirstIteration = false;
  let activeTabs = activeTabsArray.activeTabs;

  for (const i of Object.entries(library)) {
    console.log(i);
    if (href.includes(i[0])) flagFirstIteration = true;
  }
  
  if (flagFirstIteration === true) {
    startCount(count);
  }
});

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}