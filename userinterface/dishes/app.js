

let dishesMainContent = document.getElementById('dishes-cards-id');

let userName = localStorage.getItem("username");

// category KEy 
let gotCategoryId = localStorage.getItem("current-categoryId");
let dishesRef = firebase.database().ref('dishes');

let Menu = document.getElementById('menu-id');
let navBar = document.getElementById('navbar-id');

let currentUserId = localStorage.getItem("current-userId");

// notification toast instance
let notificationToast = document.getElementById('notification-toast');

// notificationToast.style.display = 'none';

let toastMsg = document.getElementById('notification-toast-text');

//header modification

let login = document.getElementById('login-id');
let logout = document.getElementById('logout-id');
let signup = document.getElementById('signup-id');

// Orders Reference 
// let ordersRef = firebase.database().ref('orders');


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



let mainData = [];

async function loadDishes(){
    // Load categories from the firebase database
    if(currentUserId == null){
      logout.style.display = "none";
    }
    else{
        login.style.display = "none";
        signup.style.display = "none";
    
    }
    dishesRef.on('value', function(snapshot){
        let dishes = snapshot.val();
        let dishesList = [];
        mainData = dishes;
        for(let dish in dishes){
            dishesList.push({id: dish, name: dishes[dish].dishName, image: dishes[dish].dishImage, price: dishes[dish].dishPrice , categoryId: dishes[dish].categoryId});
        }
        displayDishes(dishesList);
    })
}

loadDishes();


function displayDishes(dishes){
        // console.log(dishes);
        let dishList = dishes.map((dish) => {
            if(dish.categoryId != gotCategoryId){
             console.log('not found');
              
            }
            else{
                 return `
            <div class="dish-card">
            <img src="${dish.image}" alt="...">
            <h2>${dish.name}</h2>
            <p>Rs-<span>${dish.price}</span></p>
            <div class="dish-btns" >
            <button id="${dish.id}" onclick="addToCart(this)">Add to Cart</button>
            <button id="${dish.id}" onclick="navigateToPlaceOrder(this)" >Order Now</button>
            </div>
        </div>
            `
            }
           
        }
        
            )
            dishesMainContent.innerHTML = dishList.join('');
    }


    function navigateToPlaceOrder(e){
        localStorage.setItem("ordered-dish-id",e.id);
        // console.log(e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);
        localStorage.setItem("order-dish-price",e.parentNode.parentNode.childNodes[5].childNodes[1].innerText);
        window.location.href = "../placeorder/index.html";
    }
    function navigateToDishes(){
        window.location.href = "../dishes/index.html";
    }

    function addToCart(e){
       
    let data = JSON.parse(localStorage.getItem("add_to_card")) ?? [];
    console.log(data)
    //    let data = JSON.parse(cartData);
    var i = 0;
    var check = false;
    while (i < data.length) {
        console.log(mainData[e.id])
        console.log(data[i]["dishId"])
        if (mainData[e.id]["dishId"] == data[i]["dishId"]) {
            check = true
            break;
        }
        i++
    }
    if (check == false) {
        mainData[e.id]["userId"] = currentUserId
        mainData[e.id]["quantity"] = 1
        console.log(mainData)
        data.push(mainData[e.id])
        localStorage.setItem("add_to_card", JSON.stringify(data))
        console.log(data)
        
        let msg = 'Item is added to cart'
        loadToast(msg)

// alert("added to cart")
    }
    else {
     
        //  alert("alread added to cart")
        let msg = 'alread added to cart'
        loadToast(msg)
    }
        // window.location.href = "../cart/index.html";
    }


    async function logoutAccount(){
        await firebase.auth().signOut()
        .then(() => {
            localStorage.clear();
            window.location.href = "../../auth/login/index.html";
        })
        .catch((error) => {
            console.log(error);
        });
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

    
// async function placeOrder(e){
// //  console.log(e.id);
//  let updatedQuantity;
//     let orderedItem;
//     let cartItem = localStorage.getItem("add_to_card") ??[];
//     // console.log(cartItem);
//     // if(cartItem == []){
//         // console.log('no data');
//         // cartItem = [];
//         // fetch data from firebase on the basis of id
//         await firebase.database().ref('dishes').child(e.id).get().then((snapshot) => {
//             if (snapshot.exists()) {
//                 orderedItem = Object(snapshot.val());
                
//                 // console.log(orderedItem);
//     updatedQuantity = Number(orderedItem.quantity) - Number(orderedItem.dishTotalQuantity)
//                 // console.log(orderedItem);
//                 // console.log(orderedItem);
//             } else {
//                 console.log("No data available");
//             }
//         }).catch((error) => {
//             console.error(error);
//         });
//     // }


//         for(let i = 0; i < cartItem.length; i++){

//             if(cartItem[i].dishId = e.id){
//              orderedItem = cartItem[i];
//             //  updatedQuantity = orderedItem.quantity - orderedItem.totalQuantity
//            console.log(orderedItem);
//              break;
//             }

        
//     }
//     let confirm = false;
//     let orderKey = firebase.database().ref('orders').push().getKey();
//     // console.log(orderKey);
//     // console.log(orderedItem);
    
//     // match id of dish from database orders collection that it is already exisit or not
//     await firebase.database().ref('userorders').child(currentUserId).get().then((snapshot) => {
//         if (snapshot.exists()) {
//             let orders = Object.values(snapshot.val());
//             // console.log(orders);
//             for(let order in orders){
//                 // console.log(orders[order]);
//                 if(orders[order].userId == currentUserId && orders[order].order.dishId == e.id){
//                     confirm = false;
//                     // console.log("Already exist");
//                     break;
//                 }
//                 else{
//                     confirm = true;
                
//                 }
//             }
//         } else {
//             console.log("No data available");
//             // confirm = false;
//             confirm = true;
//         }
//     }).catch((error) => {
//         console.error(error);
//     }   );
//     if(confirm){
//         let msg  ="Your order is placed successfully";
//         loadToast(msg)
//         // console.log(orderedItem);
//         let order = {
//             userId: currentUserId,
//             order: orderedItem,
//             status: "pending",
//             orderId: orderKey,
//             orderDate: new Date().toLocaleDateString(),
//             orderTime: new Date().toLocaleTimeString(),
//             username: userName
//         }
//         // user
//        await firebase.database().ref( `userorders/${currentUserId}/${orderKey}`).set(order);

//        // admin 
//        await firebase.database().ref( `orders/${orderKey}`).set(order);
//     //    .then(async() => {
//         // await firebase.database().ref('dishes').child(e.id).update({totalQuantity: updatedQuantity})
//     //    })
//         localStorage.setItem("add_to_card",[]);
//         // window.location.href = "../orders/index.html";
//     }
//   else{
//     let msg  ="Your order is already placed";
//     loadToast(msg)
//   }
// }   