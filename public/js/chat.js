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
                fetch(`/api/conversation/${conv_id}/messages`, {
                    method: 'GET'
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        document.getElementById('text').value = '';
                        // Scroll to the bottom
                        const chatHistory = document.getElementById('chat-history');
                        chatHistory.innerHTML = '';

                        data.Messages.forEach(message => {
                            console.log(message.se);
                            chatHistory.innerHTML += `
                                <div class="${message.sender === '<%= user._id %>' ? 'outgoing-message' : 'incoming-message'}">
                                    <div class="message">
                                        <p>${message.text}</p>
                                        <span class="metadata">${message.createdAt}</span>
                                    </div>
                                </div>
                            `;
                        });
                        chatHistory.scrollTop = chatHistory.scrollHeight;
                    })
                    .catch(error => console.error('Error:', error));
            });
    } catch (error) {
        console.log(error);
    }
}

var conv_id = null
function assign(id) {
    console.log(id);
    conv_id = id;
    console.log(conv_id);
    fetch(`/api/conversation/${conv_id}`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const chatHeader = document.getElementById('chat-about');
            const img = document.getElementById('chat-img');
            img.innerHTML ='';
            img.innerHTML +=`
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
                console.log(message.se);
                chatHistory.innerHTML += `
                <div class="${message.sender === '<%= user._id %>' ? 'outgoing-message' : 'incoming-message'}">
                <div class="message">
                  <p>${message.text}</p>
                  <span class="metadata">${message.createdAt}</span>
                </div>
              </div>
        `;
            });
        })
        .catch(error => console.error('Error:', error));
}

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
    } catch (error) {
        console.log(error);
    }
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



