import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener('submit', (event) => {
        event.preventDefault();
        const content = event.target.content.value;

        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content);
            event.target.content.value = '';
            socket.emit('CLIENT_SEND_TYPING', 'hidden');
        }
    })
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const myId = document.querySelector('[my-id]').getAttribute('my-id');
    const body = document.querySelector('.chat .inner-body');
    const boxTyping = document.querySelector(".inner-list-typing");

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

    body.insertBefore(div, boxTyping);
    body.scrollTop = body.scrollHeight;
});
// END SERVER_RETURN_MESSAGE

// Scroll chat to bottom
const bodyChat = document.querySelector('.chat .inner-body');
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End scroll chat to bottom

// Show typing 
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 10000);
};
// End show typing

// Emoji-picker
const setSelector = (input) => {
    const end = input.value.length;
    input.setSelectionRange(end, end);
    input.focus();
};

// Popup Icon
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const inputChat = document.querySelector('.chat .inner-form input[name="content"]');

    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.addEventListener('click', () => {
        tooltip.classList.toggle('shown');

        if (!tooltip.classList.contains('shown')) {
            setSelector(inputChat);
        }
    });
};

// Insert icon to input
const emojiPicker = document.querySelector('emoji-picker');

if (emojiPicker) {
    const inputChat = document.querySelector('.chat .inner-form input[name="content"]');

    emojiPicker.addEventListener('emoji-click', (event) => {
        const icon = event.detail.emoji.unicode
        inputChat.value += icon;
        setSelector(inputChat)
        showTyping();
    });

    inputChat.addEventListener("keyup", (event) => {
        const key = event.key;
        if (key == "Enter") {
            console.log('go here');
            formSendData.submit();
        } else {
            showTyping();
        }
    });
};
// End emoji-picker

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

            if (!existTyping) {
                const bodyChat = document.querySelector(".chat .inner-body");
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
                elementListTyping.appendChild(boxTyping);
                bodyChat.scrollTop = bodyChat.scrollHeight;
            };

        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            };
        };
    });
};
// END SERVER_RETURN_TYPING