
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
            socket.emit("CLIENT_CANCEL_FRIEND", targetFriendId);
        });
    });
};
// Hết chức năng huỷ gửi yêu cầu kết bạn 


// Chức năng từ chối kết bạn 
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend) {
    listBtnRefuseFriend.forEach((buttonRefuseFriend) => {
        buttonRefuseFriend.addEventListener("click", () => {
            buttonRefuseFriend.closest(".box-user").classList.add("refuse");
            const targetFriendId = buttonRefuseFriend.getAttribute("btn-refuse-friend");
            socket.emit("CLIENT_REFUSE_FRIEND", targetFriendId);
        });
    });
};
// Hết chức năng từ chối kết bạn 

// Chức năng chấp nhận kết bạn 
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend) {
    listBtnAcceptFriend.forEach((buttonAcceptFriend) => {
        buttonAcceptFriend.addEventListener("click", () => {
            buttonAcceptFriend.closest(".box-user").classList.add("accepted");
            const targetFriendId = buttonAcceptFriend.getAttribute("btn-accept-friend");
            socket.emit("CLIENT_CONFIRM_FRIEND", targetFriendId);
        })
    });
};
// Hết chức năng chấp nhận kết bạn 

// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    const badgeUserAccept = document.querySelector("[badge-users-accept]");
    const userId = badgeUserAccept.getAttribute("badge-users-accept");

    if (userId == data.targetFriendId) {
        badgeUserAccept.innerHTML = `(${data.lengthAcceptFriends})`;
    };
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIENDS

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId == data.targetFriendId) {
        const newBoxUser = document.createElement("div");
        newBoxUser.classList.add("col-6");

        newBoxUser.innerHTML = `
            <div div class="box-user" >
            <div class="inner-avatar">
                <img src=${data.infoUserA.avatar ? data.infoUserA.avatar : "/images/avatar.png"} alt="${data.infoUserA.fullName}">
            </div>
            <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullName}</div>
                <div class="inner-buttons">
                <button
                    class="btn btn-sm btn-primary mr-1"
                    btn-accept-friend="${data.infoUserA._id}"
                > Confirm
                </button>
                <button
                    class="btn btn-sm btn-secondary mr-1"
                    btn-refuse-friend="${data.infoUserA._id}"
                > Remove
                </button>
                <button
                    class="btn btn-sm btn-secondary mr-1"
                    btn-deleted-friend=""
                    disabled=""
                > Removed
                </button>
                <button
                    class="btn btn-sm btn-primary mr-1"
                    btn-accepted-friend=""
                    disabled=""
                > Confirmed
                </button>
                </div>
            </div>
        </div>
        `;

        dataUsersAccept.appendChild(newBoxUser);

        // bát sự kiện xoá cho các nút mới của newBox;
        const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
        btnRefuseFriend.addEventListener("click", () => {
            btnRefuseFriend.closest(".box-user").classList.add("refuse");

            const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    }
})
// END SERVER_RETURN_INFO_ACCEPT_FRIEND