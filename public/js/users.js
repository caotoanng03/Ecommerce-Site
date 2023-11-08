
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
    // Trang lời mời kết bạn
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId == data.targetFriendId) {
            const newBoxUser = document.createElement("div");
            newBoxUser.classList.add("col-6");
            newBoxUser.setAttribute("user-id", data.infoUserA._id);

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

            // Thêm bắt sự kiện xoá cho các nút mới của newBox (realtime)
            const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
            btnRefuseFriend.addEventListener("click", () => {
                btnRefuseFriend.closest(".box-user").classList.add("refuse");
                const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
                socket.emit("CLIENT_REFUSE_FRIEND", userId);
            });

            // Thêm bắt sự kiện cho nút chấp nhận lời mời kết bạn mới (realtime)
            const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
            btnAcceptFriend.addEventListener("click", () => {
                console.log("da vao day");
                btnAcceptFriend.closest(".box-user").classList.add("accepted");
                const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
                socket.emit("CLIENT_CONFIRM_FRIEND", userId);
            });
        };
    };
    // Hết trang lời mời kết bạn

    // Trang danh sách người dùng (sugesstions)
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
    console.log(dataUsersNotFriend);
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");

        if (userId == data.userId) {
            // Xóa A khỏi danh sách của B
            const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserRemove) {
                dataUsersNotFriend.removeChild(boxUserRemove);
            }
        }
    }
    // Hết trang danh sách người dùng (sugesstions)
});
// END SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if (userId == data.targetFriendId) {
        // Xoá A khỏi danh sách của B
        const boxUserRemove = dataUsersAccept.querySelector(`[user-id="${data.myUserId}"]`);
        console.log(boxUserRemove);
        if (boxUserRemove) {
            dataUsersAccept.removeChild(boxUserRemove);
        }
    };
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND

//--- Display tag online realtime---
const changeOnlineStatus = (userId, status) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
        if (boxUser) {
            const statusOnline = boxUser.querySelector("[status]");
            statusOnline.setAttribute("status", status);
        }
    }
}
// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
    const status = "online";
    changeOnlineStatus(userId, status)
});

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
    const status = "offline";
    changeOnlineStatus(userId, status)
});
//--- End display tag online realtime---

