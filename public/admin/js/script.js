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

// Form Change Multi Items
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', function (event) {
        event.preventDefault(); // chan hanh vi gui di bang action=..

        const checkBoxMulti = document.querySelector('[checkbox-multi]');
        const checkedInputs = document.querySelectorAll('input[name=id]:checked');
        // const typeChange = e.target.elements.type.value;
        const option = formChangeMulti.querySelector('option:checked');
        const typeChange = option.value;

        if (checkedInputs.length > 0) {
            if (typeChange === "delete-all") {
                const isOk = confirm("Are you sure to delete theses item?");
                if (!isOk) {
                    return;
                }
            }

            let ids = [];
            const inputIds = formChangeMulti.querySelector('input[name=ids]');
            checkedInputs.forEach(input => {
                if (typeChange === "change-position") {
                    const pos = input.closest("tr").querySelector('input[name=position]').value;

                    ids.push(`${input.value}-${pos}`);
                } else ids.push(input.value)
            });

            inputIds.value = ids.join(', ');

            formChangeMulti.submit();
        } else {
            alert("Please choose at least one item!")
        }
    })
}
// End Form Change Multi Items

// Delete Item
const deleteButtons = document.querySelectorAll('[button-delete]');
if (deleteButtons.length > 0) {
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path = formDeleteItem.getAttribute('data-path');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const deleteConfirm = confirm('Are you sure to delete?');

            if (deleteConfirm) {
                const id = button.getAttribute('data-id');

                const action = path + `/${id}?_method=DELETE`;

                // update action
                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        });
    })
}
// End Delete Item

// Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('date-time')) || 3000;
    const closetAlert = showAlert.querySelector('[close-alert]');

    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

    closetAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    });
};
// End Show alert

// Preview Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const image = URL.createObjectURL(e.target.files[0]);
            uploadImagePreview.src = image;
        }
    });
}
// End Preview Upload Image

// Sort
const sort = document.querySelector('[sort]');
if (sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector('[sort-select]');
    const sortClear = sort.querySelector('[sort-clear]');

    // Sort
    sortSelect.addEventListener('change', (event) => {
        const value = event.target.value;
        const [sortKey, sortValue] = value.split('-');

        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);

        window.location.href = url.href;
    });

    // Clear
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');

        window.location.href = url.href;
    });

    // change default selection
    // the default selection's always first option
    const sortKey = url.searchParams.get('sortKey');
    const sortValue = url.searchParams.get('sortValue');

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value=${stringSort}]`);
        optionSelected.selected = true;
    }

}
// End Sort