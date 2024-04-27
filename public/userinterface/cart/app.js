

let cartItems = document.getElementById('cart-items-id');

let dishRef = firebase.database().ref('dishes');
let Menu = document.getElementById('menu-id');
let navBar = document.getElementById('navbar-id');

let dishId = localStorage.getItem("dishId");

let currentUserId = localStorage.getItem('current-userId');

let dishQuantity = 1;

let cartItem = JSON.parse(localStorage.getItem("add_to_card"));

let totalPrice = document.getElementById('total-price');
let username = localStorage.getItem('username');

let totalCost = 0;
let notificationToast = document.getElementById('notification-toast');

// notificationToast.style.display = 'none';

let toastMsg = document.getElementById('notification-toast-text');

let login = document.getElementById('login-id');
let logout = document.getElementById('logout-id');
let signup = document.getElementById('signup-id');

let loaderId = document.getElementById('loader-id');
let loaderIds = document.getElementById('loader-ids');


let orderKey = firebase.database().ref('allorders').push().getKey();
console.log(currentUserId);
// if(currentUserId == null){
//     logout.style.display = "none";
//   }
//   else{
//       login.style.display = "none";
//       signup.style.display = "none";
  
//   }

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
setTimeout(() => {
    loaderId.style.display = 'none';
    
    loaderIds.style.display = 'none';
}, 2060);

function displayDish() {
    
let cartItem = JSON.parse(localStorage.getItem("add_to_card"));
    cartItems.innerHTML =``;
    // console.log(dishes);
    if(currentUserId == null){
        logout.style.display = "none";
      }
      else{
          login.style.display = "none";
          signup.style.display = "none";
      
      }
    //  cartItem = JSON.parse(localStorage.getItem("add_to_card"));
    totalPrice.innerHTML = 0;
    for (let index in cartItem) {
        cartItems.innerHTML +=`
        <div class="cart-item">
        <div class="cart-img">
        
        <img src="${cartItem[index]["dishImage"]}" alt="...">
        </div>
                        <div>
                            <h3>${cartItem[index]["dishName"]}</h3>
                            <p>Price: ${cartItem[index]["dishPrice"]}</p>
                            <button id="${index}" class="btn" onclick="removeItem(this)">Remove</button>
                        </div>
                        <div class="inc-dec-btns">
                        <button id="${index}" class="btn" onclick="decreaseQuantity(this)">-</button>
                        <p>${cartItem[index]["quantity"]}</p>
                        <button id="${index}" class="btn" onclick="increaseQuantity(this)">+</button>
                        </div>
                        </div>`
    }

    
    // cartItems.innerHTML += cartItem.join('');
}

displayDish();


function removeItem(e){
    let index = e.id;
    cartItem.splice(index, 1);
    localStorage.setItem("add_to_card", JSON.stringify(cartItem));
    // window.location.reload();
    displayDish();
}

function increaseQuantity(e){
    let index = e.id;
    totalPrice.innerHTML = "";
    cartItem[index]["quantity"] = cartItem[index]["quantity"] + 1;
    localStorage.setItem("add_to_card", JSON.stringify(cartItem));
    e.parentNode.childNodes[3].innerHTML = cartItem[index]["quantity"];
    let cost = Number(cartItem[index]["dishPrice"] * cartItem[index]["quantity"]);
    totalCost += cost;
    // calculateTotal(totalCost);

    CalTotalPrice();
    // window.location.reload();
    // displayDish();
}

function decreaseQuantity(e){
    let index = e.id;
    if(cartItem[index]["quantity"] > 1){
        totalPrice.innerHTML = "";
        cartItem[index]["quantity"] = cartItem[index]["quantity"] - 1;
        localStorage.setItem("add_to_card", JSON.stringify(cartItem));
        e.parentNode.childNodes[3].innerHTML = cartItem[index]["quantity"];
        let cost = Number(cartItem[index]["dishPrice"] * cartItem[index]["quantity"]);
        totalCost += cost;
        // calculateTotal(totalCost);
        // window.location.reload();
    //  displayDish();
    
    CalTotalPrice();
    }
}


CalTotalPrice();
// function calculateTotal(totalCost){
//     totalPrice.innerHTML = totalCost;
// }

//  make a function that have a loop to get all products quantity from localstorage and then calculate the total price of all products and then display it in the total price div.


function CalTotalPrice(){
    let totalCost = 0;
    for (let index in cartItem) {
        let cost = Number(cartItem[index]["dishPrice"] * cartItem[index]["quantity"]);
        totalCost += cost;
    }
    // console.log(totalCost);
    totalPrice.innerHTML = totalCost;
}


// async function placeOrder(){
//     let confirm = window.confirm("Are you sure you want to place this order?");
//     if(confirm){
//         let order = {
//             userId: currentUserId,
//             order: cartItem,
//             status: "pending",
//             totalPrice:totalCost,
//             orderDate: new Date().toLocaleDateString(),
//             orderTime: new Date().toLocaleTimeString(),
//         }
//       await  firebase.database().ref('userorders').child(currentUserId).push(order);
//         localStorage.setItem("add_to_card",[]);
//         window.location.href = "../orders/index.html";
//     }
  
// }   

// create a order function which extract order from cart and then place it in the userorder collection in the database and then clear the cart and then redirect to the orders page.

async function placeOrder(){
    let count = 0;
    console.log(cartItem);
    let confirm = window.confirm("Are you sure you want to place this order?");
    //  exrtract order from cartItem and then place it in the userorder collection in the database and then clear the cart and then redirect to the orders page.
     
    await cartItem.forEach(async (item) => {
        let dishId = item.dishId;
        let dish = await firebase.database().ref('dishes').child(dishId).get();
        let dishData = dish.val();
        if(dishData.dishTotalQuantity < item.quantity){
            let msg = "Sorry! We do not have enough quantity of " + dishData.dishName;
            confirm = false;
            loadToast(msg)
            return;
        }
        let updatedQuantity = dishData.dishTotalQuantity - item.quantity;
        await firebase.database().ref('dishes').child(dishId).update({dishTotalQuantity: updatedQuantity});
    });
   
    if(confirm){
        
    await cartItem.forEach(async (item) => {
        
     let orderKeyy = await firebase.database().ref('allorders').push().getKey();
        console.log(item);
     let Cost = item.dishPrice * item.quantity;
     ++count;
    
        let order = {
            userId: currentUserId,
            orderId: orderKeyy,
            order: item,
            status: "pending",
            totalPrice:Cost,
            orderDate: new Date().toLocaleDateString(),
            orderTime: new Date().toLocaleTimeString(),
            username: username,
        }
        await  firebase.database().ref('userorders').child(currentUserId).child(orderKeyy).set(order);
        console.log("1 done");
        await firebase.database().ref( `allorders/${orderKeyy}`).set(order);
        console.log("2 done");
        
        // alert("Order Placed Successfully" + count);
       
    
});

localStorage.removeItem("add_to_card");
setTimeout(() => {
    
    window.location.href = "../orders/index.html";
}, 500);
}
// if(confirm){

// }
  
}
console.log(cartItem);

function loadToast(msg){
    toastMsg.innerHTML = msg;
    // notificationToast.style.display = 'flex';
    notificationToast.classList.add('notification-toast-active');

    setTimeout(()=>{

// notificationToast.style.display = 'none';
notificationToast.classList.remove('notification-toast-active');
    },2000)
}

async function logoutAccount(){
    
    localStorage.removeItem('current-userId');
    await firebase.auth().signOut();
   window.location.replace('/auth/login/index.html');
}