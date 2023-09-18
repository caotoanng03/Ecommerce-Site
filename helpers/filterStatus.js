module.exports = (query) => {
    let filterStatus = [
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Active",
            status: "active",
            class: ""
        },
        {
            name: "Inactive",
            status: "inactive",
            class: ""
        }
    ];

    if (query.status) {
        const index = filterStatus.findIndex(item => {
            return item.status == query.status;
        });

        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => {
            return item.status == "";
        });

        filterStatus[index].class = "active";
    }

    return filterStatus;
};