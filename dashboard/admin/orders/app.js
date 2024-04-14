
let currentUserId = localStorage.getItem("current-userId");

let orderDisplayList = document.getElementById('main-content-id');

let sideBarContent = document.getElementById('side-bar-content');

if(currentUserId == null){
    
    window.location.replace('/auth/login/index.html') ;
    
    }


async function displayOrders(){
    sideBarContent.innerHTML = ``;
    sideBarContent.innerHTML += `
    <li onclick="navigateToOrdersPage()"  >Food Categories</li>`;
    // if(currentUserId == null){
    //     logout.style.display = "none";
    //   }
    //   else{
    //       login.style.display = "none";
    //       signup.style.display = "none";
      
    //   }
    await firebase.database().ref('allorders').get().then((snapshot) => {
        if (snapshot.exists()) {
            let orders = Object.values(snapshot.val());
            // console.log(orders);
            // let ordersList = [];
            // for(let order in orders){
            //     if(orders[order].userId == currentUserId){
            //         ordersList.push({id: order, productName: orders[order].order.productName, productDescription: orders[order].order.productDescription, quantity: orders[order].order.quantity, total: orders[order].order.total});
            //     }
            // }
         
                displayOrdersList(orders);
        
         
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    }   );
}

displayOrders();

function displayOrdersList(ordersList){
    orderDisplayList.innerHTML = '';
    console.log(ordersList);

    if(ordersList == null){
        orderDisplayList.innerHTML = `
        <h1>No Orders</h1>
        `;
    }
    else{
        
    for (let i = 0; i < ordersList.length; i++) {
        let order = ordersList[i];
        console.log(order);
        orderDisplayList.innerHTML += `
        <div id=${order.orderId} userId=${order.userId} onclick="navigateToIndividualOrder(this)" class="order-card">
            <div class="order-card-header">
                <h3>${order.order.dishName}</h3>
                <p>${order.username}</p>
                <p>${order.order.categoryName}</p>
            </div>
            <div class="order-card-body">
                <p>Quantity: ${order.orderedQuantity}</p>
                <p>Total Price: ${order.totalPrice}</p>
                <p>Status: ${order.status}</p>
            </div>
        </div>
        `;
    }
    }

    // for (let i = 0; i < ordersList.length; i++) {
    //     let order = ordersList[i];
    //     // console.log(order);
    //     orderDisplayList.innerHTML += `
    //     <div class="order-card">
    //         <div class="order-card-header">
    //             <h3>${order.order.productName}</h3>
    //             <p>${order.order.productDescription}</p>
    //         </div>
    //         <div class="order-card-body">
    //             <p>Quantity: ${order.order.quantity}</p>
    //             <p>Total: ${order.order.total}</p>
    //             <p>Status: ${order.status}</p>
    //         </div>
    //     </div>
    //     `;
    // }
}

function navigateToIndividualOrder(e){
    console.log(e.id);
    console.log(e.getAttribute('userId'));  
    localStorage.setItem('individual-selected-order-id', e.id);
    localStorage.setItem('individual-selected-order-userId', e.getAttribute('userId'));
    window.location.href = '/dashboard/admin/orders/individualorder/index.html';
}


async function logout(){
    localStorage.removeItem('current-userId');
    await firebase.auth().signOut();
    window.location.replace('/auth/login/index.html') ;
}

async function navigateToOrdersPage(){
    window.location.href = '/dashboard/admin/index.html';
}

async function filterOrders(filterValue){
    // let filterValue = document.getElementById('filter').value;
    if(filterValue == 'all'){
        displayOrders();
        return;
    }
    console.log(filterValue);
    await firebase.database().ref('allorders').get().then((snapshot) => {
        if (snapshot.exists()) {
            let orders = Object.values(snapshot.val());
            let filteredOrders = [];
            for(let i = 0; i < orders.length; i++){
                if(orders[i].status == filterValue){
                    filteredOrders.push(orders[i]);
                }
            }
            displayOrdersList(filteredOrders);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    }   );
}