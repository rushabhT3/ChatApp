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
  const decodeToken = parseJwt(token);
  const jwtEmail = decodeToken.email;

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

window.addEventListener("load", getMessages);
async function getMessages() {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  const response = await axios.get("http://localhost:3000/getMessages", {
    headers: {
      Authorization: token,
    },
  });
  const messages = response.data;
  console.log(messages);
  // do something with the messages
}
