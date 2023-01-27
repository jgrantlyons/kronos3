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

function formatCountForTab (count) {
  var minutes = Math.floor(count / 60);
  var hours;
  var countString;

  if (count < 60) {
    countString = `${count}s`
  }
  else if (minutes > 59) {
    hours = Math.floor(minutes / 60, 10);
    countString = `${hours}h`;
  } else {
    countString = `${minutes}m`
  }

  return countString;
}

const set = (obj, path, value) => {
  if (Object(obj) !== obj) return obj;
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; 
  path.slice(0,-1).reduce((a, c, i) => 
       Object(a[c]) === a[c]
           ? a[c] 
           : a[c] = Math.abs(path[i+1])>>0 === +path[i+1] 
                 ? []
                 : {},
       obj)[path[path.length-1]] = value;
  return obj;
};

var urlWasRemoved = false;
var isActive = true;
var pageName = document.title;
var countInterval;
var timeOfVisibility;
var timeOnPage;
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

chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
  for (tab of activeTabs) {
    if (tab.active === true) {
      timeOnPage = tab.timeOnPage || 0;
    };
  };

  chrome.runtime.sendMessage({message: "updateActiveTabs"});
});



const handleInterval = ({isActive}) => {
  chrome.storage.sync.get('activeTabs', ({activeTabs}) => {
    var activeTabIndex = -1;
    var newActiveTabs = activeTabs;

    for (tab of Object.values(activeTabs)) {
      if (tab.active === true) {
        activeTabIndex = tab.index;
      }
    }

    if (isActive === true) {
      var inception = new Date().getTime();
  
      countInterval = setInterval(() => {
        var timeStamp = new Date().getTime();
        timeOfVisibility = Math.trunc((timeStamp - inception) / 1000);

        set(newActiveTabs[activeTabIndex], 'timeOnPage', timeOnPage + timeOfVisibility);

        chrome.storage.sync.set({activeTabs: newActiveTabs});

        accumulativeTime.library[accumulativeTime.key] = accumulativeTime.time + timeOnPage + timeOfVisibility;

        chrome.storage.sync.set({library: accumulativeTime.library});

        document.title = formatCountForTab(timeOnPage + timeOfVisibility) + ' ' + pageName;
      }, 1000);
    };
    if (isActive === false) {
      timeOnPage = timeOnPage + timeOfVisibility;
      clearInterval(countInterval);
    };
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var message = request.message.split('-');

    if (message.includes('urlRemoved')) {
      var host = message[1];
      var hostname = document.location.host;

      if (hostname.includes(host)) {
        clearInterval(countInterval);
        document.title = pageName;
        urlWasRemoved = true;
      }
    }
  }
)

const handleIsVisible = () => {
    isActive = true;
    if (urlWasRemoved === false) {
      handleInterval({isActive});
    }
};

const handleIsHidden = () => {
  isActive = false;
  if (urlWasRemoved === false) {
    handleInterval({isActive});
  }
};

const handleVisibilityChange = () => {
  document[hidden]
    ? handleIsHidden()
    : handleIsVisible();
};

if (urlWasRemoved === false) {
  handleInterval({isActive});
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}