// update products quantity in cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
inputsQuantity.forEach(input => {
    input.addEventListener('change', (e) => {
        const productId = input.getAttribute('product-id');
        const quantity = e.target.value;

        if (quantity > 0) {
            window.location.href = `/cart/update/${productId}/${quantity}`;
        }
    });
});
// end update products quantity in cart