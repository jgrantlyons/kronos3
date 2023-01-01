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

var isActive = true;
var pageName = document.title;
var countInterval;
var timeOfVisibility;
var timeOnPage = 0;

var accumulativeTime = {};

chrome.storage.sync.get('library', ({library}) => {
  accumulativeTime.library = library;
  for (const [key, value] of Object.entries(library)) {
    if (window.location.host.includes(key)) {
      accumulativeTime.key = key;
      accumulativeTime.time = value;
    };
  };
});

const handleInterval = ({isActive}) => {
  chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
    var activeTabIndex = -1;

    for (tab of Object.values(activeTabs)) {
      if (tab.active === true) {
        activeTabIndex = tab.index;
      }
    }

    if (isActive === true) {
      var inception = new Date().getTime();
      var newActiveTabs = activeTabs;
  
      countInterval = setInterval(() => {
        var timeStamp = new Date().getTime();
        timeOfVisibility = Math.trunc((timeStamp - inception) / 1000);
        
        newActiveTabs[activeTabIndex].timeOnPage = timeOnPage + timeOfVisibility;

        chrome.storage.sync.set({activeTabs: newActiveTabs});

        accumulativeTime.library[accumulativeTime.key] = accumulativeTime.time + timeOnPage + timeOfVisibility;

        chrome.storage.sync.set({library: accumulativeTime.library});

        document.title = (timeOnPage + timeOfVisibility) + ' ' + pageName;
      }, 1000);
    };
    if (isActive === false) {
      timeOnPage = timeOnPage + timeOfVisibility;
      clearInterval(countInterval);
    };
  });
};

const handleIsVisible = () => {
    isActive = true;
    handleInterval({isActive});
};

const handleIsHidden = () => {
  isActive = false;
  handleInterval({isActive});
};

const handleVisibilityChange = () => {
  document[hidden]
    ? handleIsHidden()
    : handleIsVisible();
};

handleInterval({isActive});

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}