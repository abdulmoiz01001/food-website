let mainContent = document.getElementById('main-content-id');

let individualId = localStorage.getItem('individual-selected-order-id');

let sideBarContent = document.getElementById('side-bar-content');

let individualUserId = localStorage.getItem('individual-selected-order-userId');

let currentUserId = localStorage.getItem('current-userId');


async function loadIndividualOrder(){
    sideBarContent.innerHTML += `
    <li onclick="navigateToOrdersPage()"  >Food Orders</li>`;
    console.log(individualId);
    console.log(currentUserId);
    await firebase.database().ref('userorders').child(individualUserId).child(individualId).get().then((snapshot) => {
        if (snapshot.exists()) {
            let order = snapshot.val();
            console.log(order);
            displayOrder(order);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

loadIndividualOrder();

// make a function to display a accept reject button with order details

function displayOrder(order){
    
    console.log(order);
    mainContent.innerHTML = `
    <div class="card">
    <div class="card-header">
        <h4>Order Details</h4>
    </div>
    <div class="card-body">
        <h5 class="card-title">Order Id: ${individualId}</h5>
        <p class="card-text">User Id: ${individualUserId}</p>
        <p class="card-text">Product Name: ${order.order.dishName}</p>
        <p class="card-text">Product Category: ${order.order.categoryName}</p>
        <p class="card-text">Quantity: ${order.orderedQuantity}</p>
        <p class="card-text">Total Price: Rs-${order.totalPrice}</p>
        <p class="card-text">Status: ${order.status}</p>
        <div class="card-footer">
        <button onclick="acceptOrder()">Accept</button>
        <button onclick="rejectOrder()">Reject</button>
    </div>
    </div>
</div>
    `;


}



async function acceptOrder(){
    await firebase.database().ref('userorders').child(individualUserId).child(individualId).update({
        status: 'accepted'
    });
    await firebase.database().ref('allorders').child(individualId).update({
        status: 'accepted'
    });
    // alert('Order Accepted');
    window.location.replace('/dashboard/admin/orders/index.html');
}

async function rejectOrder(){
    await firebase.database().ref('userorders').child(individualUserId).child(individualId).update({
        status: 'rejected'
    });
    await firebase.database().ref('allorders').child(individualId).update({
        status: 'rejected'
    });
    // alert('Order Rejected');
    window.location.replace('/dashboard/admin/orders/index.html');
}

function navigateToOrdersPage(){
    window.location.href = '/dashboard/admin/orders/index.html';
}