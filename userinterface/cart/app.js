

let cartItems = document.getElementById('cart-items-id');

let dishRef = firebase.database().ref('dishes');

let dishId = localStorage.getItem("dishId");

let dishQuantity = 1;

let cartItem = JSON.parse(localStorage.getItem("add_to_card"));

let totalPrice = document.getElementById('total-price');

let totalCost = 0;




function displayDish() {
    // console.log(dishes);
    totalPrice.innerHTML = 0;
    for (let index in cartItem) {
        cartItems.innerHTML +=`
        <div class="cart-item">
                        <img src="${cartItem[index]["dishImage"]}" alt="...">
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
         </div>
        `
    }

    
    cartItems.innerHTML += dishList.join('');
}

displayDish();


function removeItem(e){
    let index = e.id;
    cartItem.splice(index, 1);
    localStorage.setItem("add_to_card", JSON.stringify(cartItem));
    window.location.reload();
}

function increaseQuantity(e){
    let index = e.id;
    totalPrice.innerHTML = "";
    cartItem[index]["quantity"] = cartItem[index]["quantity"] + 1;
    localStorage.setItem("add_to_card", JSON.stringify(cartItem));
    e.parentNode.childNodes[3].innerHTML = cartItem[index]["quantity"];
    let cost = Number(cartItem[index]["dishPrice"] * cartItem[index]["quantity"]);
    totalCost += cost;
    calculateTotal(totalCost);

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
        calculateTotal(totalCost);
        // window.location.reload();
    //  displayDish();
    }
}


function calculateTotal(totalCost){
    totalPrice.innerHTML = totalCost;
}