
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

// Chức năng huỷ gửi yêu cầu kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend) {
    listBtnCancelFriend.forEach((buttonCancelFriend) => {
        buttonCancelFriend.addEventListener("click", () => {
            buttonCancelFriend.closest(".box-user").classList.remove("add");
            const targetFriendId = buttonCancelFriend.getAttribute("btn-cancel-friend");
            console.log(targetFriendId)
            socket.emit("CLIENT_CANCEL_FRIEND", targetFriendId);
        });
    });
};
// Hết chức năng huỷ gửi yêu cầu kết bạn 