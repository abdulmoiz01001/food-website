

let dishesMainContent = document.getElementById('dishes-cards-id');

// category KEy 
let gotCategoryId = localStorage.getItem("current-categoryId");
let dishesRef = firebase.database().ref('dishes');

let currentUserId = localStorage.getItem("current-userId");

//header modification

let login = document.getElementById('login-id');
let logout = document.getElementById('logout-id');
let signup = document.getElementById('signup-id');


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
            <p>Rs-${dish.price}</p>
            <div class="dish-btns" >
            <button id="${dish.id}" onclick="addToCart(this)">Add to Cart</button>
            <button>Order Now</button>
            </div>
        </div>
            `
            }
           
        }
        
            )
            dishesMainContent.innerHTML = dishList.join('');
    }

    function navigateToDishes(){
        window.location.href = "../dishes/index.html";
    }

    function addToCart(e){
       
    var data = JSON.parse(localStorage.getItem("add_to_card")) ?? []

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
        // console.log(maindata)
        data.push(mainData[e.id])
        localStorage.setItem("add_to_card", JSON.stringify(data))
        console.log(data)
     


    }
    else {
     
         alert("alread added to cart")
    }
        // window.location.href = "../cart/index.html";
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