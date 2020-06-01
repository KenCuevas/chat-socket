// Initialize Socket.io from Client Side.
const socket = io();
// Id of cuurrent user online.
let id = undefined;
// Disable the message input by default because no user has sign in yet
document.querySelector("#m").disabled = true;

//////////////////////////////////////////////////////////////////////////////////////////
///// Socket Listeners
//////////////////////////////////////////////////////////////////////////////////////////

// Listen for any new user (RESERVED METHOD).
socket.on("connect", () => (id = socket.id));

// Listen for incoming message.
socket.on("chat message", (msg) => appendMessage(msg));

// Listen for any new user that has registered.
socket.on("add user online", (msg) => addToUsersOnline(msg));

// Listen for any user that has left the chat.
socket.on("remove user online", (msg) => removeUserOnline(msg));

// Display that the current user is typing when the user start typing in (#m)
socket.on("typing...", typing());

//////////////////////////////////////////////////////////////////////////////////////////
///// Functions
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * If the user is typing it will emit an event to let know the server that someone is typing.
 * @param {String} username that is typing. 
 */
function isUserTyping(username) {
  const input = document.getElementById("m").value;
  if (input.length < 1) {
    socket.emit("user is not typing", username);
  } else {
    socket.emit("user is typing", username);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
///// Vainilla JS functions
//////////////////////////////////////////////////////////////////////////////////////////

/**
 * Appends a message to the UI if the message is not empty.
 * @param {String} message that a user has send.
 */
function appendMessage(message) {
  if (message === "") {
    return;
  } else {
    const ul = document.getElementById("messages");
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    ul.appendChild(li);
    window.scrollTo(0, document.body.scrollHeight);
  }
}

/**
 * Appends the user to the list of users that are online.
 * @param {String} message containes the id and user separated by a comma.
 */
function addToUsersOnline(message) {
  const user = message.split(",")[0];
  const id = message.split(",")[1];
  const ul = document.getElementById("userConnected");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(user));
  li.setAttribute("id", id);
  ul.appendChild(li);
}

/**
 * Remove the user that has disconnected according to the @param id .
 * @param {String} id of the current user that is online.
 */
function removeUserOnline(id) {
  var item = document.getElementById(id);
  item.parentNode.removeChild(item);
}

/**
 * Display that @param user is typing.
 * @param {String} user is typing in (#m).
 */
function typing(user) {
  if (user) {
    const typing = document.getElementById("typing");
    typing.innerHTML = `${user} is typing...`;
  } else {
    const typing = document.getElementById("typing");
    typing.innerHTML = "";
  }
}

/**
 * A popup that can be dismissed if the user sign in with an username.
 * @param {String} username that will be used to identify an user in the chat.
 */
function userSignInPopup(username) {
  const element = document.getElementById("popup");
  const style = window.getComputedStyle(element);
  const display = style.getPropertyValue("display");
  if (display && username) {
    document.querySelector("#m").disabled = false;
    document.querySelector("#popup").style.display = "none";
  }
  setInterval(isUserTyping(user), 5000);
}

//////////////////////////////////////////////////////////////////////////////////////////
///// Event listeners
/////////////////////////////////////////////////////////////////////////////////////////

// When the user press the Subumit button
document.querySelector("#container").addEventListener("submit", (e) => {
  e.preventDefault();
  const nickname = document.querySelector("#nickname").value;
  userSignInPopup(nickname);
  user = nickname;
  socket.emit("user connected", nickname);
});

// When the user sends a message, the front-end emits a message to the back-end side
document.querySelector("#form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.querySelector("#m").value;
  socket.emit("chat message", msg);
  appendMessage(msg);
  document.querySelector("#m").value = "";
});

// DONE ✅
// [x] Broadcast a message to connected users when someone connects or disconnects.
// [x] Don’t send the same message to the user that sent it himself. Instead, append the message directly as soon as he presses enter.
// [x] Add support for nicknames.
// [x] Add “{ user } is typing” functionality.
// [x] Show who’s online.

// [ ] Add private messaging.
// [ ] Share your improvements!
