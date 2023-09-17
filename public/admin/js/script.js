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