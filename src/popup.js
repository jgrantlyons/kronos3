// html elements
const form = document.getElementById("form");
const userText = document.getElementById("userText");
const appendButton = document.getElementById("appendButton");
const closeButton = document.getElementById("close");
const errorBody = document.getElementById("errorBody");
const list = document.getElementById("urlList");
let log = {};

// close popup
closeButton.addEventListener("click", () => {
  window.close();
});

// check validity of url
const checkSyntax = (string) => {
  let res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
};

//list constructor
const updateList = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    let listElement = document.createElement("li");
    let url = document.createTextNode(`${key}`);
    let time = document.createTextNode(`${value}`);
    listElement.appendChild(url);
    listElement.appendChild(time);
    //insert delete button here
    list.appendChild(listElement);
    //clear errorBody message
  }
};

// handle new submissions
const handleSubmit = (event) => {
  event.preventDefault();
  let userInput = userText.value;
  if (
    userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    )
  ) {
    let newEntry = { [userInput]: 0 };
    newEntry = { ...log, ...newEntry };
    chrome.storage.sync.set({ library: newEntry });
    log = newEntry;
    updateList(log);
  } else {
    //insert errorBody message here
  }
};
form.addEventListener("submit", handleSubmit);

// initialize
// 'log' is the local equivalent to the 'library' object located in chrome.storage
window.addEventListener("DOMContentLoaded", (e) => {
  chrome.storage.sync.get("library", (obj) => {
    console.log((obj = "from domcontentloaded"));
    obj !== undefined
      ? (log = obj.library)
      : chrome.storage.sync.set({ library: log });
  });
  updateList(obj.library);
});
