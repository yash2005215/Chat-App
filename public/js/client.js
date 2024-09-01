const socket = io();

const input = document.getElementById('user-msg');
const submit = document.getElementById('user-send');
const messageContainer = document.getElementById('message-container');

let username;

do {
    username = prompt("Enter your name: ");
} while (!username);

socket.emit('user joined', username);

submit.addEventListener('click', () => {
    if (input.value) {
        const message = {
            user: username,
            text: input.value
        };
        appendMessage(message, 'sent');
        socket.emit('chat message', message);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    appendMessage(msg, 'received');
});

socket.on('user joined', function (user) {
    appendUserAction(`<div><b>${user}</b><i> joined the chat</i></div>`, 'user-joined');
});

socket.on('user left', function (user) {
    appendUserAction(`<div><b>${user}</b><i> left the chat</i></div>`, 'user-joined');
});

function appendMessage(msg, type) {
    const div = document.createElement('div');
    div.classList.add('msg', type);
    div.innerHTML = `<div><span><strong><u>${msg.user}</u> </strong></span><span>${msg.text}<span></div>`;
    messageContainer.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to bottom
}

function appendUserAction(action, type) {
    const div = document.createElement('div');
    div.classList.add('msg', type);
    div.innerHTML = action;
    messageContainer.appendChild(div);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to bottom
}
