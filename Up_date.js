let btn_search = document.getElementById("pharma_search");
let table = document.getElementById("history_table");
let textBox = document.getElementById("name_drug");

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


if (btn_search) {
    btn_search.onclick = function() {
        const textBoxValue = textBox.value;
        const data = {
            name: textBoxValue,
        };

        console.log('Button clicked');
        console.log('Sending data:', data);
        let categoriesHTML = `<li class="table-header">
                                <div class="hcol col-1">Name</div>
                                <div class="hcol col-2">drug id</div>
                                <div class="hcol col-3">Number of items</div>
                                <div class="hcol col-4">Price</div>
                                <div class="hcol col-5">expiry date</div>
                                <div class="hcol col-6">category</div>
                                <div class="hcol col-7">update</div>
                                <div class="hcol col-8">delete</div>
                              </li>`;

        fetch('/update/getdrug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response received');
            return response.json();
        })
        .then(orders => {
            if (!Array.isArray(orders)) {
                console.error('Expected orders to be an array');
                return;
            }

            orders.forEach((order) => {
                categoriesHTML += `
                <li class="table-row">
                    <div class="col col-1" data-label="name">${order.drug_name}</div>
                    <div class="col col-2" data-label="drug_id" data-id="${order.drug_id}">${order.drug_id}</div>
                    <div class="col col-3" data-label="no_items">${order.stock}</div>
                    <div class="col col-4" data-label="price">$${order.price}</div>
                    <div class="col col-5" data-label="ex_d">${order.expiry_date}</div>
                    <div class="col col-6" data-label="category">${order.category}</div>
                    <div class="col col-7" data-label="update" data-id="${order.drug_id}"><a href="/update/${order.drug_id}">update</a></div>
                    <div class="col col-8" data-label="delete"  data-id="${order.drug_id}"><a href="/delete/${order.drug_id}">delete</a></div>
                </li>`;
            });

            table.innerHTML = categoriesHTML;
            console.log(categoriesHTML);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
}
