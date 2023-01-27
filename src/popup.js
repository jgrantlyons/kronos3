const form = document.getElementById("form");
const userText = document.getElementById("userText");
const appendButton = document.getElementById("appendButton");
const closeButton = document.getElementById("close");
const errorBody = document.getElementById("errorBody");
const list = document.getElementById("urlList");

let log = {};

closeButton.addEventListener("click", () => {
  window.close();
});

function formatCountForPopup (count) {
  var minutes = Math.floor(count / 60);
  var hours;
  var countString;

  if (count < 60) {
    countString = `1m`
  }
  else if (minutes > 59) {
    hours = Math.floor(minutes / 60, 10);
    countString = `${hours}h ${minutes - (hours * 60)}m`;
  } else {
    countString = `${minutes}m`
  }

  return countString;
}

const updateList = (obj) => {
  list.innerHTML = "";
  for (const [key, value] of Object.entries(obj)) {
    let listElement = document.createElement("li");
    let rmBtn = document.createElement("button");
    let listElementInnerElement = document.createElement("div");
    listElementInnerElement.style.width = '100%';
    listElementInnerElement.style.justifyContent = 'space-between';
    listElementInnerElement.style.display = 'flex';
    listElementInnerElement.style.flexDirection = 'row';

    rmBtn.innerText = "X";
    rmBtn.setAttribute("id", key);
    rmBtn.addEventListener("click", () => {
      removeLi(key);
    });

    let urlNode = document.createElement('div');
    let timeNode = document.createElement('div');
    let url = document.createTextNode(`${key}`);
    let time = document.createTextNode(`${formatCountForPopup(value)}`);

    urlNode.appendChild(url);
    timeNode.appendChild(time);

    listElementInnerElement.appendChild(urlNode);
    listElementInnerElement.appendChild(timeNode);

    listElement.appendChild(rmBtn);
    listElement.appendChild(listElementInnerElement);
    list.appendChild(listElement);
  }
};

const removeLi = (host) => {
  delete log[host];
  updateList(log);
  chrome.storage.sync.set({ library: log });

  chrome.runtime.sendMessage({message: `urlRemoved-${host}`});
};

const handleSubmit = (event) => {
  event.preventDefault();
  let userInput = userText.value;
  if (
    userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    )
  ) {
    let newEntry = { [userInput]: 0 };
    log = { ...log, ...newEntry };
    updateList(log);
    chrome.storage.sync.set({ library: log });
    userText.value = "";

    chrome.runtime.sendMessage({message: `newUrl-${Object.keys(newEntry)}`});
  } else {
    event.preventDefault();
  }
};
form.addEventListener("submit", handleSubmit);

// initialize
window.addEventListener("DOMContentLoaded", (e) => {
  list.innerHTML = "...loading";
  chrome.storage.sync.get("library", (obj) => {
    obj !== undefined
      ? (log = obj.library)
      : chrome.storage.sync.set({ library: log });
  });
  setTimeout(() => {
    updateList(log);
  }, 500);
});
