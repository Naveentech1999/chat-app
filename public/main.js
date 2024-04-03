const socket = io();
const clientsTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/message-tone.mp3');

socket.on("clients-total",(data)=>{
  clientsTotal.innerText =`Total Clients : ${data}`
})


messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

 
async function storeMessageInDB(data, receivedFromSocket = false) {
  try {
    // Only store the message in the database if it is not received from the socket
    if (!receivedFromSocket) {
      await axios.post('http://localhost:5000/userchat/storeNM', data);
    }
  } catch (error) {
    console.error('Error storing message:', error);
  }
}

let alignRight = false; // Variable to toggle alignment

async function fetchMessagesFromDB() {
  try {
    const response = await axios.get('http://localhost:5000/userchat/getalluserchats');
    const messages = response.data;
    messages.forEach((message) => {
      const isOwnMessage = (message.Name === nameInput.value); // Check if the message is sent by the user
      addMessageToUI(isOwnMessage ? true : alignRight, message);
      alignRight = !alignRight; // Toggle the alignment for the next message
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}
fetchMessagesFromDB();

async function deleteMessage(msgId) {
  try {
    const response = await axios.delete(`http://localhost:5000/userchat/delete/${msgId}`);
    socket.emit("deletedMessages")
  } catch (err) {
    console.log(err);
  }
}
 
socket.on("deletedMessages", () => {
   
});

socket.on('chat-message', (data) => {
  messageTone.play();
  addMessageToUI(false, data);
  storeMessageInDB(data, true); // Pass true to indicate the message is received from the socket
});

function sendMessage() {
  if (messageInput.value === '') return;

  const data = {
    Name: nameInput.value,
    Message: messageInput.value,
    DateTime: new Date(),
  };
 
  socket.emit('message', data);
  addMessageToUI(true, data); // Display the message on the right side
  messageInput.value = '';

  // Store the sent message in the database
  storeMessageInDB(data);
}

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const alignmentClass = isOwnMessage ? 'message-right' : 'message-left';
  const element = `
    <li class="${alignmentClass}">
      <p class="message">
        ${data.Message}
        <span>${data.Name} ● ${moment(data.DateTime).fromNow()}</span>
        <button class="delete-btn" onclick="deleteMessage('${data._id}')">Delete</button>
      </p>
    </li>
  `;

  messageContainer.innerHTML += element;
  console.log(element)
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener('keypress', (e) => {
  socket.emit('feedback', {
    feedback: `✍️ ${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener('blur', (e) => {
  socket.emit('feedback', {
    feedback: '',
  });
});

socket.on('feedback', (data) => {
  clearFeedback();
  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
