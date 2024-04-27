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
    <p><strong>Order Id:</strong> ${individualId}</p>
    <p><strong>User Id:</strong> ${individualUserId}</p>
    <p><strong>Product Name:</strong> ${order.order.dishName}</p>
    <p><strong>Product Category:</strong> ${order.order.categoryName}</p>
    <p><strong>Quantity:</strong> ${order.orderedQuantity ? order.orderedQuantity : order.order.quantity}</p>
    <p><strong>Total Price:</strong> Rs-${order.totalPrice}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p><strong>Order Date:</strong> ${order.orderDate}</p>
    <p><strong>Order Time:</strong> ${order.orderTime}</p>
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