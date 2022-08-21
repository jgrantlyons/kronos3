console.log('hello world');

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

async function handleVisibilityChange() {
  document[hidden]
    ? console.log('hidden')
    : console.log('visible')
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
  console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}