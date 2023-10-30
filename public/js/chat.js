// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content);
            event.target.content.value = '';
        }
    })
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const myId = document.querySelector('[my-id]').getAttribute('my-id');
    const body = document.querySelector('.chat .inner-body');

    const div = document.createElement('div');

    let htmlFullName = '';
    if (myId == data.userId) {
        div.classList.add('inner-outgoing')
    } else {
        div.classList.add('inner-incoming');
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    };

    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
});

// END SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector('.chat .inner-body');
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End scroll chat to bottom