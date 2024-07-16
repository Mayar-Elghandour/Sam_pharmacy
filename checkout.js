function logout() {
    // Clear session or authentication data (this would typically be done server-side)
    // For example, using localStorage for demo purposes:
    localStorage.removeItem('authToken');

    // Redirect to index.html
    window.location.href = 'index.html';

    // Clear browser history to prevent back navigation
    setTimeout(function () {
        history.pushState(null, '', 'index.html');
        window.addEventListener('popstate', function () {
            history.pushState(null, '', 'index.html');
        });
    }, 0);
}
fetch('/cart/data')
.then(response => response.json())
.then(data => {
    let categoriesHTML = '';
    let ids = []; // Initialize ids array

    data.forEach(order => {
        categoriesHTML += 
        `<div class="item" data-id="${order.drug_id}" data-price="${order.price}" data-quantity="${order.no_items}">
            <span>Name: ${order.drug_name}</span>
            <span>Price: $${order.price}</span>
            <input id="in${order.drug_id}" value="1" min="1" placeholder="Enter quantity" >
            <button id="btn-nono" color: black" class="col col-6 delete_entry"><i id="nono" class="fas fa-trash"></i></button>
        </div>`;
        ids.push("in" + order.drug_id);
    });

    const checkout_list = document.getElementById("itemList");
    checkout_list.innerHTML = categoriesHTML;

    function calculateSubtotal() {
        let subtotal = 0;
        ids.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                const quantity = parseInt(input.value) || 0;
                const price = parseFloat(input.closest('.item').dataset.price);
                subtotal += quantity * price;
            }
        });

        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        document.getElementById("subtotal").innerText = subtotal.toFixed(2);
        document.getElementById("tax").innerText = tax.toFixed(2);
        document.getElementById("total").innerText = total.toFixed(2);
    }

    // Add event listeners to input fields to recalculate subtotal on change
    ids.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateSubtotal);
    });

    // Initial calculation of subtotal
    calculateSubtotal();

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete_entry').forEach(button => {
        button.addEventListener('click', function() {
            const itemDiv = this.closest('.item');
            const itemId = itemDiv.getAttribute('data-id');

            const data = {
                id: itemId,
            };
            fetch(`/cart_del`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    // Remove the item from the UI
                    itemDiv.remove();

                    // Recalculate subtotal after item removal
                    calculateSubtotal();
                } else {
                    console.error('Error deleting item:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting item:', error));
        });
    });
})    
.catch(error => {
    console.error('Error:', error);
});


document.getElementById('checkoutButton').addEventListener('click', function() {
fetch('/cart_check')
.then(response => response.json())
.then(data => {
  if (data.message === 'checked out') {
    alert('checked out');
    window.location.href = '/checkout-final.html';
  } else {
    console.error('Error clearing cart:', data.message);
  }
})
.catch(error => console.error('Error clearing cart:', error));
});
document.getElementById('clearCartButton').addEventListener('click', function() {
fetch('/cart_clear')
.then(response => response.json())
.then(data => {
  if (data.message === 'Cart cleared') {
    alert('Cart empty');
    window.location.href = '/checkout-final.html';
  } else {
    console.error('Error clearing cart:', data.message);
  }
})
.catch(error => console.error('Error clearing cart:', error));
});
    // .catch(error => console.error('Error fetching data:', error));