// Status button
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status != "") {
                url.searchParams.set("status", status);
            } else url.searchParams.delete("status");

            window.location.href = url.href;
        });
    });
}
// End status button

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = e.target.elements.keyword.value;

        if (value != "") {
            url.searchParams.set("keyword", value);
        } else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
// End form search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href
        });
    });
};
// End Pagination

// Change Status 1 Item
const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangeStatus.length > 0) {
    const changeStatusForm = document.querySelector('#form-change-status');
    const path = changeStatusForm.getAttribute('data-path');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute('data-status');
            const id = button.getAttribute('data-id');

            const changedStatus = currentStatus == "active" ? "inactive" : "active";
            const action = path + `/${changedStatus}/${id}?_method=PATCH`;
            changeStatusForm.action = action;

            changeStatusForm.submit();
        });
    });
}
// End Change Status 1 Item

// Change Box multi
const checkBoxMulti = document.querySelector('[checkbox-multi]');

if (checkBoxMulti) {
    const inputCheckAll = checkBoxMulti.querySelector('input[name=checkall]');
    const inputsId = checkBoxMulti.querySelectorAll('input[name=id]');

    inputCheckAll.addEventListener('click', function () {
        if (this.checked) {
            inputsId.forEach(input => input.checked = true);
        } else {
            inputsId.forEach(input => input.checked = false);
        }
    });

    inputsId.forEach(input => {
        input.addEventListener('click', function () {
            const checkedCounter = checkBoxMulti.querySelectorAll('input[name=id]:checked').length;
            if (checkedCounter == inputsId.length) {
                inputCheckAll.checked = true;
            } else inputCheckAll.checked = false;
        });
    })
}

// End Change Box multi

// Form Chage Multi Items
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', function (event) {
        event.preventDefault(); // chan hanh vi gui di bang action=..

        const checkBoxMulti = document.querySelector('[checkbox-multi]');
        const checkedInputs = document.querySelectorAll('input[name=id]:checked');

        if (checkedInputs.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector('input[name=ids]');
            checkedInputs.forEach(input => ids.push(input.value));

            inputIds.value = ids.join(', ');

            formChangeMulti.submit();
        } else {
            alert("Please choose at least one item!")
        }

    })
}
// End Form Chage Multi Items