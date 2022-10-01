/* global chrome */
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.greeting === 'hello') {
//     console.log('message recieved');
//     sendResponse({farewell: 'goodbye'});}
//   }
// );

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
// chrome.tabs.onUpdated.addListener(({tabId, changeInfo, tab}) => {
//   console.log(tabId, changeInfo, tab);
// })

chrome.storage.sync.get('library', ({library}) => {
  let href = window.location.href;
  let flag = false;

  for (const i of Object.entries(library)) {
    console.log(i);
    if (href.includes(i[0])) flag = true;
  }
  
  if (flag === true) {
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