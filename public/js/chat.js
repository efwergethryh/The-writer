
const socket = io('http://localhost:3000/');
socket.on('connection ', () => {
    console.log('Connected to server');
});
socket.on('disconnect', () => {
    console.log('Disconnected from server');
});


socket.on('error', (error) => {
    console.error('Error receiving message:', error);
});

function send_message(id) {
    const text = document.getElementById('text').value;

    try {
        fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                receiver_id: id,
                conversation_id: conv_id
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Fetch the updated conversation messages after sending the message
                // fetch(`/api/conversation/${conv_id}/messages`, {
                //     method: 'GET'
                // })
                //     .then(response => response.json())
                //     .then(data => {
                //         document.getElementById('text').value = '';
                //         const chatHistory = document.getElementById('chat-history');
                //         chatHistory.innerHTML = '';
                //         data.Messages.forEach(message => {
                //             chatHistory.innerHTML += `
                //                 <div class="${message.sender === '<%= user._id %>' ? 'outgoing-message' : 'incoming-message'}">
                //                     <div class="message">
                //                         <p>${message.text}</p>
                //                         <span class="metadata">${message.createdAt}</span>
                //                     </div>
                //                 </div>
                //             `;
                //         });
                //         chatHistory.scrollTop = chatHistory.scrollHeight;
                //     })
                //     .catch(error => console.error('Error:', error));

                // Emit the message using socket.io after sending it via fetch

                socket.emit('message', { message: data });
            });
    } catch (error) {
        console.log(error);
    }
}

function updateChat(data) {

    const message = data.message;
    console.log(message);

    let messageContainer = document.getElementById(`message-${conv_id}`);
    if (!messageContainer) {
        // If the container doesn't exist, create it
        messageContainer = document.createElement(`Message-${conv_id}`);

        document.body.appendChild(messageContainer);
    }

    // Create a paragraph element for the message
    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    // Append the paragraph to the message container
    messageContainer.appendChild(paragraph);
}
socket.on('message', (data) => {
    // Extract the message object from the data
    const message = data.message;
    console.log(data);

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    // Create a new paragraph element for the incoming message
    const newParagraph = document.createElement('p');
    newParagraph.textContent = data.message.message.text;
    // Determine if the message sender is the current user
    const isOutgoingMessage = data.message.message.sender === '<%= user._id %>'; // Assuming '<%= user._id %>' is replaced with the actual user ID value on the client side
    const metadataSpan = document.createElement('span');
    metadataSpan.classList.add('metadata');
    metadataSpan.textContent = data.message.message.createdAt;
    // Determine the CSS class based on whether the message is outgoing or incoming
    const messageClass = isOutgoingMessage ? 'outgoing-message' : 'incoming-message';
    messageDiv.appendChild(newParagraph);
    messageDiv.appendChild(metadataSpan);
    // Apply the CSS class to the new paragraph element
    newParagraph.classList.add(messageClass);
    console.log(newParagraph);
    // Append the new paragraph to the chat history container
    const chatHistory = document.getElementById('chat-history');
    chatHistory.appendChild(newParagraph);
});

function clear_chat(id) {

}
function delete_conversation(id) {
    fetch(`/api/conversation/${id}`, {
        method: 'delete',
    })
        .then(response => console.log(response.json()))
        .then(() => {
            // After successfully deleting the conversation, fetch the updated conversation list
            fetchUpdatedConversationList();
        });
}

function fetchUpdatedConversationList() {
    fetch('/api/conversations', {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {

            const conversations = document.getElementById('conversation-list');
            conversations.innerHTML = '';

            data.conversations.forEach((conversation, index) => {
                const conversationDiv = document.createElement('div');
                conversationDiv.classList.add('conversation');

                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.onclick = function () {
                    assign(conversation._id);
                };
                const member = data.Members[index][1];
                const image = document.createElement('img');
                image.src = member.path; // Update with the correct path
                image.alt = `${member.name}'s Profile Picture`; // Update with the correct name
                image.classList.add('profile-image');

                const nameParagraph = document.createElement('p');
                nameParagraph.textContent = member.name;

                // Update with the correct name
                nameParagraph.style.color = 'black';

                link.appendChild(image);
                link.appendChild(nameParagraph);
                listItem.appendChild(link);
                conversationDiv.appendChild(listItem);

                conversations.appendChild(conversationDiv);

            });
        });
    showMessage('deleted')
}

var conv_id = null
function assign(id) {
    conv_id = id;
    fetch(`/api/conversation/${conv_id}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const chatHeader = document.getElementById('chat-about');
            const img = document.getElementById('chat-img');
            img.innerHTML = '';
            img.innerHTML += `
        <div class="options-dropdown">
            <button class="options-btn">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </button>
            <div class="options-content">
                <a class="option" onclick="clear_chat(${conv_id})">Clear chat</a>
                <a class="option" onclick="delete_conversation('${conv_id}')">Delete chat</a>

            </div>
        </div>

            <img src="${data.User.path}" alt="avatar">`
            chatHeader.innerHTML = '';
            chatHeader.innerHTML += `
                <h6 class="m-b-0">${data.User.name}</h6>
                                        <small>Last seen: 2 hours ago</small>
        `;
        })
        .catch(error => console.error('Error:', error));
    fetch(`/api/conversation/${id}/messages`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const chatHistory = document.getElementById('chat-history');
            chatHistory.innerHTML = '';
            data.Messages.forEach(message => {
                chatHistory.innerHTML += `
                <div id="Message-${conv_id}"class="${message.sender === '<%= user._id %>' ? 'outgoing-message' : 'incoming-message'}">
                    <div class="message">
                        <p id="message-${conv_id}">${message.text}</p>
                        <span class="metadata">${message.createdAt}</span>
                    </div>
                </div>
        `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Error handling for the socket connection


//socket.on('notification')

function startConversation(id) {
    const text = document.getElementById(`message_${id}`).value
    console.log(`id:${conv_id}`);
    try {
        fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                receiver_id: id,
                conversation_id: conv_id
            })

        })

        const modal = new bootstrap.Modal(document.getElementById('newConversationModal'), {
            keyboard: false
        });
        modal.hide()
        showMessage('sent')
    } catch (error) {
        console.log(error);
    }
}

function showMessage(id) {
    var messageBox = document.getElementById(`${id}`);
    messageBox.style.display = 'block';
    const delay = 3000;

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, delay);

}
function showForm(userId) {
    // Hide all existing forms
    const forms = document.querySelectorAll('.message-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });

    // Show the form corresponding to the selected user
    const form = document.getElementById(`messageForm_${userId}`);
    form.style.display = 'block';
}

async function showNewConversationPopup() {
    try {
        const Users = await getUsers();
        // Create the user list HTML
        let userListHTML = '';
        Users.forEach(user => {
            userListHTML += `<li value="${user._id}">${user.name}</li>`;
        });

        // Create the new conversation modal
        const newConversationModal = `
        
      `;


        document.body.insertAdjacentHTML('beforeend', newConversationModal);

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('newConversationModal'), {
            keyboard: false
        });
        modal.show();

        // Add event listener to handle form submission
        const form = document.getElementById('newConversationForm');
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const recipient = document.querySelector('#recipient li.active').getAttribute('value');
            const message = document.getElementById('message').value;

            // You can send the recipient and message to the server to create a new conversation
            console.log('Recipient:', recipient);
            console.log('Message:', message);

            // Close the modal
            modal.hide();
        });

        // Add event listener to handle user selection
        const userList = document.querySelectorAll('#recipient li');
        userList.forEach(user => {
            user.addEventListener('click', function () {
                userList.forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    } catch (error) {
        console.error('There was a problem:', error);
    }
}

document.getElementById('message-writer').addEventListener('click', showNewConversationPopup);



