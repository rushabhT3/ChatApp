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
  e.preventDefault();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  const context = {
    context: message,
  };
  console.log(context);

  const token = localStorage.getItem("token");
  // const decodeToken = parseJwt(token);
  // const jwtEmail = decodeToken.email;

  const response = await axios.post(
    "http://localhost:3000/sendMessage",
    context,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  console.log(response);
}

// ? "DOMContentLoaded" loads earlier than load which loads after other css, js loading
const MAX_MESSAGES = 10;
let storedMessages = JSON.parse(localStorage.getItem("storedMessages")) || [];

window.addEventListener("load", getMessages);

async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const lastMessageId = localStorage.getItem("lastMessageId") || 0;

  const response = await axios.get(
    `http://localhost:3000/getMessages?id=${lastMessageId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const messages = response.data;

  const leftMessageArea = document.querySelector("#message-area .left");
  const rightMessageArea = document.querySelector("#message-area .right");

  leftMessageArea.innerHTML = "Left:";
  rightMessageArea.innerHTML = "Right:";

  storedMessages.forEach((element) => {
    const parsedLocalObject = JSON.parse(localStorage.getItem(element));
    const isRightMessage = element[0] == decodedToken.jwtId;
    const messageArea = isRightMessage ? rightMessageArea : leftMessageArea;
    messageArea.innerHTML += "<div>" + parsedLocalObject.text + "</div>";
  });

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
}

async function fetchGroups() {
  const response = await axios.get("http://localhost:3000/getGroups");
  return response.data;
}

function updateMemberList(members) {
  const container = document.querySelector(".container-left");
  const existingList = container.querySelector("ul");
  if (existingList) {
    container.removeChild(existingList);
  }
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
  const groups = await fetchGroups();
  console.log(groups);

  const list = document.createElement("ul");

  for (const group of groups) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = group.groupName;
    link.href = "#";
    link.addEventListener("click", async () => {
      const response2 = await axios.get(
        `http://localhost:3000/getGroupDetail?groupId=${group.groupId}&groupName=${group.groupName}`
      );
      console.log(response2.data);
      updateMemberList(response2.data);
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
      console.log(response.data);
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
