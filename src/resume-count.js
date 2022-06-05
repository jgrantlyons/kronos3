// let manuscript = {};
// chrome.storage.sync.get("manuscript", (obj) => {
//   console.log(obj.manuscript);
// });
let count = 100;
setInterval(() => {
  count++;
  document.title = count;
}, 1000);
