// Status button
const buttonsStatus = document.querySelectorAll("[button-status]");
if (buttonsStatus.length > 0) {
    let url = new URL(window.location.href);
    console.log(url);

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