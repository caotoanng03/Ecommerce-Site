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