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


const baseUrl = 'http://localhost:3000/history/data';
let categoriesHTML = `<li class="table-header">
<div class="hcol col-1"></div>
<div class="hcol col-2">Order Id</div>
<div class="hcol col-3">Number of items</div>
<div class="hcol col-4">Price</div>
<div class="hcol col-5">Delivery date</div>
</li>`;

fetch('/history/data')
  .then(response => response.json())
  .then(data => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.Oid]) {
        acc[item.Oid] = {
          Oid: item.Oid,
          total_price: item.total_price,
          D_date: item.D_date,
          drugs: [],
          total_no_items: 0
        };
      }
      acc[item.Oid].drugs.push({
        drug_name: item.drug_name,
        no_items: item.no_items
      });
      acc[item.Oid].total_no_items += item.no_items;
      return acc;
    }, {});

    console.log(groupedData);

    Object.values(groupedData).forEach(order => {
      categoriesHTML += `
        <li class="table-row">
            <button id="btn-nono" class="col col-1 expand_arrow"><i id="nono" class="arrow fa-solid fa-chevron-right"></i></button>
            <div class="col col-2" data-label="Order Id">${order.Oid}</div>
            <div class="col col-3" data-label="itemsNo">${order.total_no_items}</div>
            <div class="col col-4" data-label="price">$${order.total_price}</div>
            <div class="col col-5" data-label="D-Date">${order.D_date}</div>
        </li>
        <div class="purchase_detail hide">
            <li class="sub-header">
                <div class="subcol scol-1" data-label="medicine">Item Name</div>
                <div class="subcol scol-2" data-label="itemsNo">Quantity</div>
            </li>`;
      
      order.drugs.forEach(drug => {
        categoriesHTML += `
            <li class="subrow">
              <div class="subcol scol-1" data-label="medicine">${drug.drug_name}</div>
              <div class="subcol scol-2" data-label="itemsNo">${drug.no_items} item(s)</div>
            </li>`;
      });

      categoriesHTML += `</div>`;
    });

    const table = document.getElementById("history_table");
    table.innerHTML = categoriesHTML;
    console.log(categoriesHTML);

    document.querySelectorAll(".expand_arrow").forEach(button => {
      button.addEventListener("click", function() {
        const subtable = this.parentElement.nextElementSibling;
        const arrow = this.querySelector(".arrow");
        subtable.classList.toggle("hide");
        arrow.classList.toggle("fa-chevron-down");
        arrow.classList.toggle("fa-chevron-right");
      });
    });
  })
  .catch(error => console.error('Error fetching data:', error));
