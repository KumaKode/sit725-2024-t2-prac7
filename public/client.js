// Establish a connection to the server
const socket = io();

// Get references to the DOM elements
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");

// Send a message to the server when the "Send" button is clicked
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    socket.emit("message", message); // Emit the message event to the server
    messageInput.value = ""; // Clear the input field after sending
  }
});

// Listen for messages from the server
socket.on("message", (msg) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = msg; // Display the received message
  messagesDiv.appendChild(messageElement); // Add the message to the messages div
});
