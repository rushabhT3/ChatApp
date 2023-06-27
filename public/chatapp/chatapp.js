function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function sent(e) {
  try {
    e.preventDefault();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
    const groupId = localStorage.getItem("groupId");
    const context = {
      context: message,
      groupId: groupId,
    };
    console.log(context);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/sendMessage",
      context,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    messageInput.value = "";
  } catch (error) {
    console.log({ FunctionSentFE: error });
  }
}

// ? "DOMContentLoaded" loads earlier than load which loads after other css, js loading
const MAX_MESSAGES = 10;
let storedMessages = JSON.parse(localStorage.getItem("storedMessages")) || [];

const messageArea = document.querySelector("#message-area");
const leftMessageArea = messageArea.querySelector(".left");
const rightMessageArea = messageArea.querySelector(".right");
leftMessageArea.innerHTML = "Left:";
rightMessageArea.innerHTML = "Right:";

window.addEventListener("load", getMessages);

async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const lastMessageId = localStorage.getItem("lastMessageId") || 0;
  // console.log({ here: decodedToken, lastMessageId });

  const response = await axios.get(
    `http://localhost:3000/getMessages?id=${lastMessageId}&groupId=${localStorage.getItem(
      "groupId"
    )}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const messages = response.data;
  for (const message of messages) {
    const { id, UserId, createdAt, text } = message;
    const key = `${UserId}-${createdAt}`;

    if (!storedMessages.includes(key)) {
      localStorage.setItem(key, JSON.stringify(message));
      storedMessages.push(key);
      localStorage.setItem("lastMessageId", id);

      if (storedMessages.length > MAX_MESSAGES) {
        const oldestKey = storedMessages.shift();
        localStorage.removeItem(oldestKey);
      }
      localStorage.setItem("storedMessages", JSON.stringify(storedMessages));
    }
    const isRightMessage = UserId === decodedToken.jwtId;
    const messageArea = isRightMessage ? rightMessageArea : leftMessageArea;
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.textContent = text;
    messageArea.appendChild(newMessage);
  }
  storedMessages.forEach((keys) => {
    console.log({ keys: keys });
    const parsedLocalObject = JSON.parse(localStorage.getItem(keys));
    const groupId = localStorage.getItem("groupId");
    if (parsedLocalObject.GroupGroupId == groupId) {
      const isRightMessage = keys[0] == decodedToken.jwtId;
      const messageArea = isRightMessage ? rightMessageArea : leftMessageArea;
      messageArea.innerHTML += `<div>${parsedLocalObject.text}</div>`;
    }
  });
}

async function fetchGroups() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.jwtId;
  const response = await axios.get(
    `http://localhost:3000/getGroups?userId=${userId}`
  );
  return response.data;
}

function updateMemberList(members, groupName) {
  const container = document.querySelector(".container-left");
  const existingList = container.querySelector("ul");
  if (existingList) {
    container.removeChild(existingList);
  }

  const existingGroupTitle = container.querySelector("#groupTitle");
  if (existingGroupTitle) {
    container.removeChild(existingGroupTitle);
  }
  const groupTitle = document.createElement("h2");
  groupTitle.setAttribute("id", "groupTitle");
  groupTitle.textContent = groupName;
  container.appendChild(groupTitle);

  const memberList = document.createElement("ul");
  for (const member of members) {
    const listItem = document.createElement("li");
    listItem.textContent = member.name;
    memberList.appendChild(listItem);
  }
  container.appendChild(memberList);
}

document.addEventListener("DOMContentLoaded", getGroups);
async function getGroups() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const groups = await fetchGroups();

  const list = document.createElement("ul");
  const container = document.querySelector(".container-left");

  for (const group of groups) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = group.groupName;
    link.href = "#";
    link.addEventListener("click", async () => {
      const response2 = await axios.get(
        `http://localhost:3000/getGroupDetail?groupId=${group.groupId}&userId=${decodedToken.jwtId}&groupName=${group.groupName}`
      );
      localStorage.setItem("groupId", group.groupId);
      updateMemberList(response2.data, group.groupName);

      ["#searchBox", "#searchButton"].forEach((selector) => {
        const existingElement = container.querySelector(selector);
        if (existingElement) {
          container.removeChild(existingElement);
        }
      });

      const searchBox = document.createElement("input");
      searchBox.setAttribute("type", "text");
      searchBox.setAttribute("placeholder", "search by email or phone");
      searchBox.setAttribute("id", "searchBox");

      const searchButton = document.createElement("button");
      searchButton.textContent = "Search";
      searchButton.setAttribute("id", "searchButton");

      searchButton.addEventListener("click", async () => {
        const searchInput = searchBox.value;
        if (searchInput) {
          const response3 = await axios.get(
            `http://localhost:3000/search?input=${searchInput}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          // console.log(response3.data);

          const existingResultsList = container.querySelector("#resultsList");
          if (existingResultsList) {
            container.removeChild(existingResultsList);
          }

          const resultsList = document.createElement("ul");
          resultsList.setAttribute("id", "resultsList");

          for (const result of response3.data) {
            const resultItem = document.createElement("li");
            resultItem.textContent = result.name;

            const addButton = document.createElement("button");
            addButton.textContent = "Add";
            addButton.addEventListener("click", async () => {
              const response4 = await axios.post(
                `http://localhost:3000/addMember`,
                {
                  groupId: group.groupId,
                  memberId: result.id,
                },
                {
                  headers: {
                    Authorization: token,
                  },
                }
              );
            });
            resultItem.appendChild(addButton);
            resultsList.appendChild(resultItem);
          }
          container.appendChild(resultsList);
        }
      });
      container.insertBefore(searchBox, container.firstChild);
      container.insertBefore(searchButton, searchBox.nextSibling);
    });
    listItem.appendChild(link);
    list.appendChild(listItem);
  }
  const groupList = document.getElementById("groupList");
  groupList.appendChild(list);
}

function makeGroup() {
  const token = localStorage.getItem("token");
  const form = document.getElementById("groupForm");
  form.style.display = "block";
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const groupName = event.target.elements.groupName.value;
    try {
      const response = await axios.post(
        "http://localhost:3000/makeGroup",
        { groupName: groupName },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      form.style.display = "none";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        console.error(error);
      }
    }
  });
}

document.querySelector("#delete-button").addEventListener("click", () => {
  localStorage.removeItem("groupId");
});
