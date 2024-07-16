"use strict";
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
let table = document.getElementById("history_table");
let value; // Declare 'value' outside the functions
let submitbtn = document.getElementById("submit");
let searchbar = document.getElementById("searchbar");

function createSearchBar() {
    let search = document.createElement("input");
    search.type = "text";
    search.id = "searchbar";
    search.placeholder = "Search";
    
    let search_container = document.getElementById("search-container");
    search_container.appendChild(search);

    let submit = document.createElement("button");
    submit.type = "button";
    submit.id = "submit";
    submit.innerHTML = "Search";
    search_container.appendChild(submit);

    submit.onclick = () => {
        value = document.getElementById("searchbar").value.trim(); // Update 'value'
        console.log(`Search query: clicked`);
        console.log(`Search value: ${value}`);

        let searchType = document.getElementById("search-select").value;
        let query = '';
            
        switch (searchType) {
            case 'name':
                query = 'SELECT * FROM `drugs` WHERE  drug_name like ?';
                break;
            case 'substance':
                query = 'SELECT * FROM `drugs` WHERE  active_subs like ?';
                break;
            case 'disease':
                query ='SELECT * FROM `drugs` WHERE  purpose like ?';
                break;
            default:
                console.log('Invalid search type');
                return;
        }
        let data = {
            searchsql: query,
            name:value};
        console.log(data);
        let categoriesHTML = `<li class="table-header">
                                    <div class="hcol col-1">Name</div>
                                    <div class="hcol col-2">drug id</div>
                                    <div class="hcol col-3">Number of items</div>
                                    <div class="hcol col-4">Price</div>
                                    <div class="hcol col-5">expiry date</div>
                                    <div class="hcol col-6">category</div>
                                    <div class="hcol col-7">cart</div>
                                    
                                  </li>`;
    
            fetch('http://localhost:3000/categories', {
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
                        <div class="col col-2" data-label="drug_id">${order.drug_id}</div>
                        <div class="col col-3" data-label="no_items">${order.stock}</div>
                        <div class="col col-4" data-label="price">$${order.price}</div>
                        <div class="col col-5" data-label="ex_d">${order.expiry_date}</div>
                        <div class="col col-6" data-label="category">${order.category}</div>
                        <div class="col col-7" data-label="cart"><button id="user_search" class="btn-addtocart" onclick="addToCart(${order.drug_id})"> Add to cart </button></div>
                    </li>`;
                });
    
                table.innerHTML = categoriesHTML;
                console.log(categoriesHTML);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
        // Execute your query here, for now, we'll just log it
    
    };
  

function showSearchBar() {
    if (!document.getElementById("searchbar")) {
        createSearchBar();
    } else {
        document.getElementById("searchbar").value = '';
    }
}
// Define the addToCart function
function addToCart(drug_id) {
    const data = {
        id: drug_id,
    };

    fetch('/addtocart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Data saved successfully');
        } else {
            console.error('Error saving data:', response.statusText);
        }
    })
    .catch(error => console.error('Error saving data:', error));
}

// Generate the HTML and add event listeners

// Add event listeners after the buttons are created
document.querySelectorAll('.btn-addtocart').forEach(button => {
    button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        addToCart(itemId);
    });
});
