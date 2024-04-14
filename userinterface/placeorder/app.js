let currentDishId = localStorage.getItem('ordered-dish-id');
let currentUser = localStorage.getItem('current-user-id');

let dishesMainContent = document.getElementById('dishes-main-content-id');

let orderedQuantity = 1;

let currentUserId = localStorage.getItem('current-userId');

let userName = localStorage.getItem('username');


let dishPrice = localStorage.getItem('order-dish-price') ?? 0;

// notification toast instance
let notificationToast = document.getElementById('notification-toast');

// notificationToast.style.display = 'none';

let toastMsg = document.getElementById('notification-toast-text');
// console.log(dishPrice);

let totalPrice = dishPrice * orderedQuantity;



function loadDish(){
    let dishRef = firebase.database().ref('dishes');
    dishRef.on('value', function(snapshot){
        let dishes = snapshot.val();
        let dishesList = [];
        console.log(dishes);
        for(let dish in dishes){
            dishesList.push({id: dish, name: dishes[dish].dishName, image: dishes[dish].dishImage, price: dishes[dish].dishPrice , categoryId: dishes[dish].categoryId});
        }
        
        displayDishes(dishesList);
    })
}

function displayDishes(dishes){
    // console.log(dishes);
         dishes.map((dish) => {
        if(dish.id == currentDishId){
            dishesMainContent.innerHTML += `
            <div class="order-image">
                <img src=${dish.image} alt="">
                </div>
                <div class="order-details">
                    <h2>Dish Name : ${dish.name}</h2>
                    <p>Product Description</p>
                    <p>Product Price : Rs-<span>${dish.price}</span></p>
                    <div class="set-quantity">
                        <button onclick="decreaseQuantity(this)" class="quantity-control" id="decrease">-</button>
                        <input disabled type="number" class="quantity" value="1">
                        <button onclick="increaseQuantity(this)" class="quantity-control" id="increase">+</button>
                    </div>
                    <p>Total Price : Rs-<span>${totalPrice}</span></p>
                    <div class="last-decision-btns">
                        <button onclick="discardOrder()" class="discard-order">Discard Order</button>
                        <button onclick="placeOrder(this)" id=${dish.id} class="place-order">Place Order</button>
                    </div>
            `
            // dishesMainContent.innerHTML = dishCard.join();
        }
    })
}
// function calTotalPrice(){
//     totalPrice = dishPrice * orderedQuantity;
    
//     // e.parentNode.parentNode.childNodes[9].childNodes[1].innerText = totalPrice;
// }

// calTotalPrice();
function increaseQuantity(e){
    // console.log(e.parentNode.children[1].value);
      console.log(e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);

      dishPrice =  Number(e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);
    
    // let quantity = document.querySelector('.quantity');
    orderedQuantity++;
    e.parentNode.children[1].value = orderedQuantity;
    totalPrice = dishPrice * orderedQuantity;
    console.log(e.parentNode.parentNode.childNodes[9].childNodes[1].innerText);
    e.parentNode.parentNode.childNodes[9].childNodes[1].innerText = totalPrice;
   
}
function decreaseQuantity(e){
    if(orderedQuantity == 1){
        return;
    }
    // console.log(e.parentNode.children[1].value);
    // let quantity = document.querySelector('.quantity');
    
    console.log(e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);

    dishPrice =  Number(e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);
    orderedQuantity--;
    e.parentNode.children[1].value = orderedQuantity;
    totalPrice = dishPrice * orderedQuantity;
    console.log(e.parentNode.parentNode.childNodes[9].childNodes[1].innerText);
    e.parentNode.parentNode.childNodes[9].childNodes[1].innerText = totalPrice;

   
}

loadDish();

function discardOrder(){
     localStorage.removeItem('ordered-dish-id');
    localStorage.removeItem('order-dish-price');
    window.location.replace('../dishes/index.html');
}
   
async function placeOrder(e){
    console.log(totalPrice);
    console.log(orderedQuantity);
 console.log(e.id);
 let updatedQuantity = 0;
    let orderedItem;
    // let cartItem = JSON.parse(localStorage.getItem("add_to_card")) ??[];
    // console.log(cartItem);
    // if(cartItem == []){
        // console.log('no data');
        // cartItem = [];
        // fetch data from firebase on the basis of id
        await firebase.database().ref('dishes').child(e.id).get().then((snapshot) => {
            if (snapshot.exists()) {
                orderedItem = Object(snapshot.val());
                
                // console.log(orderedItem);
    updatedQuantity =  Number(orderedItem.dishTotalQuantity) - orderedQuantity;
                // console.log(orderedItem);
                // console.log(orderedItem);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    // }


        // for(let i = 0; i < cartItem.length; i++){

        //     if(cartItem[i].dishId = e.id){
        //      orderedItem = cartItem[i];
        //     //  updatedQuantity = orderedItem.quantity - orderedItem.totalQuantity
        //    console.log(orderedItem);
        //      break;
        //     }

        
    // }
    let confirm = false;
    let orderKey = firebase.database().ref('allorders').push().getKey();
    // console.log(orderKey);
    // console.log(orderedItem);
    
    // match id of dish from database orders collection that it is already exisit or not
    await firebase.database().ref('userorders').child(currentUserId).get().then((snapshot) => {
        if (snapshot.exists()) {
            let orders = Object.values(snapshot.val());
            // console.log(orders);
            for(let order in orders){
                // console.log(orders[order]);
                if(orders[order].userId == currentUserId && orders[order].order.dishId == e.id){
                    confirm = false;
                    // console.log("Already exist");
                    break;
                }
                else{
                    confirm = true;
                
                }
            }
        } else {
            console.log("No data available");
            // confirm = false;
            confirm = true;
        }
    }).catch((error) => {
        console.error(error);
    }   );
    if(confirm){
        let msg  ="Your order is placed successfully";
        loadToast(msg)
        // console.log(orderedItem);
        let order = {
            userId: currentUserId,
            username: userName,
            order: orderedItem,
            status: "pending",
            totalPrice: totalPrice,
            orderedQuantity: orderedQuantity,
            orderId: orderKey,
            orderDate: new Date().toLocaleDateString(),
            orderTime: new Date().toLocaleTimeString(),
        }
        // user
       await firebase.database().ref( `userorders/${currentUserId}/${orderKey}`).set(order);

       // admin 
       await firebase.database().ref( `allorders/${orderKey}`).set(order)
       .then(async() => {
        await firebase.database().ref('dishes').child(e.id).update({dishTotalQuantity: updatedQuantity})
       })
        localStorage.removeItem("add_to_card");
        localStorage.removeItem('ordered-dish-id');
        localStorage.removeItem('order-dish-price');
        window.location.href = "../orders/index.html";

    }
  else{
    let msg  ="Your order is already placed";
    loadToast(msg)
  }
} 


function loadToast(msg){
    toastMsg.innerHTML = msg;
    // notificationToast.style.display = 'flex';
    notificationToast.classList.add('notification-toast-active');

    setTimeout(()=>{

// notificationToast.style.display = 'none';
notificationToast.classList.remove('notification-toast-active');
    },1000)
}