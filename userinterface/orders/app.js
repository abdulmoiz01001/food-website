

let currentUserId = localStorage.getItem("current-userId");

let statusColor = document.getElementById('status-color');

let Menu = document.getElementById('menu-id');
let navBar = document.getElementById('navbar-id');
let login = document.getElementById('login-id');
let logout = document.getElementById('logout-id');
let signup = document.getElementById('signup-id');

let loaderId = document.getElementById('loader-id');
let loaderIds = document.getElementById('loader-ids');

let orderDisplayList = document.getElementById('orders-cards-id');

setTimeout(() => {
    loaderId.style.display = 'none';
    
    loaderIds.style.display = 'none';
}, 2060);
function toggleNavbar() {
    navBar.classList.toggle('move-navbar');
}
// close navbar
function closeNavbar() {
    navBar.classList.remove('move-navbar');
}
var bodyOffsetWidth = document.body.offsetWidth;
console.log("Offset width of body:", bodyOffsetWidth);
function displayMenu() {
   
var bodyOffsetWidth = document.body.offsetWidth;
    if (bodyOffsetWidth <= 800) {
        Menu.classList.add('visible');
        Menu.classList.remove('hidden');
    }
    else if(bodyOffsetWidth > 800) {
        Menu.classList.add('hidden');
        Menu.classList.remove('visible');
    }
    
}



if(currentUserId == null){
    window.location.href = "../../auth/login/index.html";
}


async function displayOrders(){
    if(currentUserId == null){
        logout.style.display = "none";
      }
      else{
          login.style.display = "none";
          signup.style.display = "none";
      
      }
    await firebase.database().ref('userorders').child(currentUserId).get().then((snapshot) => {
        if (snapshot.exists()) {
            let orders = Object.values(snapshot.val());
            console.log(orders);
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
        console.log(error);
    }   );
}

displayOrders();


function displayOrdersList(ordersList){
    orderDisplayList.innerHTML = '';
    console.log(ordersList);

    for (let i = 0; i < ordersList.length; i++) {
        let order = ordersList[i];
        // console.log(order);
        // if(order.status == "pending"){  
        //    statusColor.style.color = "yellow";
        // }
        // else if(order.status == "Accepted"){
        //     statusColor.style.color = "green";
        // }
        // else if(order.status == "Rejected"){
        //     statusColor.style.color = "red";
        // }
        orderDisplayList.innerHTML += `
            <div class="order-card">
                <div class="card-header">
                Order Status<p id="status-color"> ${order.status}</p>
                <button status="${order.status}" id="${order.orderId}" onclick="orderCancel(this)" >Order Cancel</button>
                    <img src="${order.order.dishImage}" alt"..."/>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${order.order.dishName}</h5>
                    <p class="card-text">Quantity: ${order.orderedQuantity ? order.orderedQuantity : order.order.quantity }</p>
                    <p class="card-text">Total Price: Rs-${order.totalPrice}</p>
                    <b>${order.orderDate} / <span>${order.orderTime}</span> </b>
                </div>
            </div>
        `;
    }
     
    //  ordersList.innerHTML = order.join();

    // <p class="card-text">${order.productDescription}</p>
}






async function logoutAccount(){
    await firebase.auth().signOut()
    .then(() => {
        localStorage.removeItem("current-userId");
        window.location.href = "../../auth/login/index.html";
    })
    .catch((error) => {
        console.log(error);
    });
}


async function orderCancel(e){
    console.log(e.parentNode.childNodes[1].innerText);
    if(e.parentNode.childNodes[1].innerText === "pending"){
    console.log(e.id);
    await firebase.database().ref('userorders').child(currentUserId).child(e.id).remove();
    await firebase.database().ref('allorders').child(e.id).remove();
    displayOrders();
    }
    else{
        alert("Order cannot be cancelled");
    }
    // alert("Order Cancelled");
}