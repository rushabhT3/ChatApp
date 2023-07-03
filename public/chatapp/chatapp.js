const API_URL = "http://localhost:3000";

const socket = io(API_URL);

document.addEventListener("DOMContentLoaded", () => {
  getMessages();
  getGroups();
});

socket.on("messageReceived", () => {
  getMessages();
});

socket.on("groupUpdated", () => {
  getGroups();
});

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
    // ! trim() method to remove any leading or trailing whitespace from the message variable
    if (message.trim() === "") {
      return;
    }
    const groupId = localStorage.getItem("groupId");
    const context = {
      context: message,
      groupId: groupId,
    };
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/sendMessage`, context, {
      headers: {
        Authorization: token,
      },
    });
    socket.emit("sendMessage", () => {
      console.log("FE: sent is getting emitted");
    });
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
leftMessageArea.textContent = "Left:";
rightMessageArea.textContent = "Right:";

async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const lastMessageId = localStorage.getItem("lastMessageId") || 0;

  const response = await axios.get(
    `${API_URL}/getMessages?id=${lastMessageId}&groupId=${localStorage.getItem(
      "groupId"
    )}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  const messages = response.data;
  rightMessageArea.textContent = "Right:";
  leftMessageArea.textContent = "Left:";

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
    // newMessage.textContent = text;
    messageArea.appendChild(newMessage);
  }

  storedMessages.forEach((key) => {
    const parsedLocalObject = JSON.parse(localStorage.getItem(key));
    const groupId = localStorage.getItem("groupId");

    if (parsedLocalObject.GroupGroupId == groupId) {
      const isRightMessage = key.split("-")[0] == decodedToken.jwtId;
      const messageArea = isRightMessage ? rightMessageArea : leftMessageArea;
      const newMessage = document.createElement("div");
      newMessage.textContent = parsedLocalObject.text;
      messageArea.appendChild(newMessage);
    }
  });
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
  Object.assign(groupTitle.style, {
    color: "green",
    fontSize: "20px",
  });
  container.appendChild(groupTitle);

  const memberList = document.createElement("ul");
  Object.assign(memberList.style, {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  });
  for (const member of members) {
    const listItem = document.createElement("li");
    listItem.textContent = member.name;
    Object.assign(listItem.style, {
      fontSize: "16px",
      marginBottom: "5px",
      padding: "5px",
      backgroundColor: "#f2f2f2",
      borderRadius: "3px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    });
    const makeAdminButton = document.createElement("button");
    makeAdminButton.textContent = "Make Admin";
    Object.assign(makeAdminButton.style, {
      color: "white",
      backgroundColor: "#4CAF50",
      borderRadius: "3px",
    });
    makeAdminButton.addEventListener("click", async () => {
      try {
        const data = {
          memberId: member.id,
          groupId: localStorage.getItem("groupId"),
        };
        const response = await axios.post(`${API_URL}/makeAdmin/`, data);
        if (response.status === 200) {
          alert(response.data.message);
        } else {
          alert("An error occurred");
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred");
        }
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    Object.assign(deleteButton.style, {
      color: "white",
      backgroundColor: "#ff4d4d",
      borderRadius: "3px",
    });
    deleteButton.addEventListener("click", async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = parseJwt(token);
        const userId = decodedToken.jwtId;
        await axios.delete(
          `${API_URL}/deleteMember/${member.id}&${localStorage.getItem(
            "groupId"
          )}`,
          {
            headers: {
              loginId: userId,
            },
          }
        );
        console.log("Member deleted successfully");
        memberList.removeChild(listItem);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        }
      }
    });
    listItem.appendChild(makeAdminButton);
    listItem.appendChild(deleteButton);
    memberList.appendChild(listItem);
  }
  container.appendChild(memberList);
}

async function fetchGroups() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.jwtId;
  const response = await axios.get(`${API_URL}/getGroups?userId=${userId}`);
  return response.data;
}

async function getGroups() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  const groups = await fetchGroups();

  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";

  const list = document.createElement("ul");
  const container = document.querySelector(".container-left");

  for (const group of groups) {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.textContent = group.groupName;
    link.href = "#";
    Object.assign(link.style, {
      color: "blue",
      textDecoration: "none",
    });
    link.addEventListener("click", async () => {
      const response2 = await axios.get(
        `${API_URL}/getGroupDetail?groupId=${group.groupId}&userId=${decodedToken.jwtId}&groupName=${group.groupName}`
      );
      localStorage.setItem("groupId", group.groupId);
      updateMemberList(response2.data, group.groupName);
      getMessages();

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
      Object.assign(searchBox.style, {
        padding: "5px",
        borderRadius: "3px",
        border: "1px solid #ccc",
      });

      const searchButton = document.createElement("button");
      searchButton.textContent = "Search";
      searchButton.setAttribute("id", "searchButton");
      Object.assign(searchButton.style, {
        padding: "5px 10px",
        borderRadius: "3px",
        border: "none",
        backgroundColor: "#4CAF50",
        color: "white",
        marginLeft: "5px",
      });

      searchButton.addEventListener("click", async () => {
        const searchInput = searchBox.value;
        if (searchInput) {
          const response3 = await axios.get(
            `${API_URL}/search?input=${searchInput}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
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
              try {
                const response4 = await axios.post(
                  `${API_URL}/addMember`,
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
                resultsList.removeChild(resultItem);
                socket.emit("memberAdded", {
                  groupId: group.groupId,
                  memberId: result.id,
                });
              } catch (error) {
                if (error.response && error.response.status === 400) {
                  alert(error.response.data);
                }
              }
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
        `${API_URL}/makeGroup`,
        { groupName: groupName },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      form.style.display = "none";
      socket.emit("createGroup", () => {
        console.log("FE: makeGroup is getting emitted");
      });
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
