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

// window.addEventListener("load", () => {
//   setInterval(getMessages, 1000);
// });

window.addEventListener("load", getMessages());
async function getMessages() {
  const token = localStorage.getItem("token");
  const decodedToken = parseJwt(token);
  // console.log("Decoded token:", decodedToken);

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

  document.querySelector("#message-area .left").innerHTML = "Left:";
  document.querySelector("#message-area .right").innerHTML = "Right:";

  let k = JSON.parse(localStorage.getItem("storedMessages"));
  k.forEach((element) => {
    if (localStorage.getItem(element)) {
      const parsedLocalObject = JSON.parse(localStorage.getItem(element));
      console.log(element, parsedLocalObject.text);
      console.log(element[0], decodedToken.jwtId);
      if (element[0] == decodedToken.jwtId) {
        document.querySelector("#message-area .right").innerHTML +=
          "<div>" + parsedLocalObject.text + "</div>";
      } else {
        document.querySelector("#message-area .left").innerHTML +=
          "<div>" + parsedLocalObject.text + "</div>";
      }
    }
  });

  for (const message of messages) {
    console.log(message);
    const { id, UserId, createdAt, text } = message;
    console.log("Message UserId:", UserId);

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
    if (UserId === decodedToken.jwtId) {
      console.log("Displaying message on right side");
      const rightMessageArea = document.querySelector("#message-area .right");
      const newMessage = document.createElement("div");

      // ? Add the "message" CSS class to the new message element
      newMessage.classList.add("message");
      // modify here such that get the stored text from the localstorage and run the loop and then add the text with
      newMessage.textContent = text;
      rightMessageArea.appendChild(newMessage);
    } else {
      console.log("Displaying message on left side");
      const leftMessageArea = document.querySelector("#message-area .left");
      const newMessage = document.createElement("div");
      // ? Add the "message" CSS class to the new message element
      newMessage.classList.add("message");
      newMessage.textContent = text;
      leftMessageArea.appendChild(newMessage);
    }
  }
  // if (UserId === decodedToken.jwtId) {
  //   console.log("Displaying message on right side");
  //   document.querySelector("#message-area .right").innerHTML += `<br>${text}`;
  // } else {
  //   console.log("Displaying message on left side");
  //   document.querySelector("#message-area .left").innerHTML += `<br>${text}`;
  // }
}

document.addEventListener("DOMContentLoaded", getGroups());
async function getGroups() {
  const response = await axios.get("http://localhost:3000/getGroups");
  const groups = response.data;
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
