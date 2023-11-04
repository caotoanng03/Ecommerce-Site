
// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(buttonAddFriend => {
        buttonAddFriend.addEventListener("click", () => {
            buttonAddFriend.closest(".box-user").classList.add("add");
            const targetFriendId = buttonAddFriend.getAttribute("btn-add-friend");
            socket.emit("CLIENT_REQUEST_FRIEND", targetFriendId);
        });
    });
};
// Hết chức năng gửi yêu cầu kết bạn