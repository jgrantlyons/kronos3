// // Set the name of the hidden property and the change event for visibility
// var hidden, visibilityChange;
// if (typeof document.hidden !== "undefined") {
//   // Opera 12.10 and Firefox 18 and later support
//   hidden = "hidden";
//   visibilityChange = "visibilitychange";
// } else if (typeof document.msHidden !== "undefined") {
//   hidden = "msHidden";
//   visibilityChange = "msvisibilitychange";
// } else if (typeof document.webkitHidden !== "undefined") {
//   hidden = "webkitHidden";
//   visibilityChange = "webkitvisibilitychange";
// }

// let count = 0;
// let localManuscript = {};
// let host = window.location.host;
// let originalTitle = document.title;

// const updateLocalManuscript = () => {
//   chrome.storage.sync.get("library", (obj) => {
//     obj !== undefined
//       ? (localManuscript = obj.localManuscript)
//       : chrome.storage.sync.set({ manuscript: localManuscript });
//   });
// };
// updateLocalManuscript();

console.log("initialize");
// const countUp = () => {
//   count++;
//   document.title = "hello" + count;
// };
// setInterval(countUp(), 1000);

// const onReload = () => {
//   originalTitle = document.title;

//   if (host === window.location.host) {
//     console.log("refreshed to the same domain");
//     // setInterval(countUp(), 1000);
//   } else {
//     host = window.location.host;
//     count = 0;
//     // insert the launch pattern here
//   }
//   updateLocalManuscript();
//   for (const [key] of Object.keys(localManuscript)) {
//     host === key ? setInterval(countUp(), 1000) : (count = 0);
//   }
// // };

// const handleVisibilityChange = () => {
//   document[hidden] ? console.log("hidden") : console.log("unhidden") );
// };
// // Warn if the browser doesn't support addEventListener or the Page Visibility API
// typeof document.addEventListener === "undefined" || hidden === undefined
//   ? alert(
//       "This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
//     )
//   : document.addEventListener(visibilityChange, handleVisibilityChange, false);
