// Dish Form Instance
let itemFormId = document.getElementById('item-form-id');
let image = document.getElementById('image');
let dishName = document.getElementById('name');
let dishPrice = document.getElementById('price');
let imageSrcId = document.getElementById('image-src-id');

// dashboard side bar ul instance 
let sideBarContent = document.getElementById('side-bar-content');
// image url 
let dishImageUrl = '';

// edite mode check
let editCheck = false;

// update key
let updateKey = '';

// category id and name from local storage
let categoryId = localStorage.getItem('categoryId');
let categoryName = localStorage.getItem('categoryName');

// notification toast instance

let toastMsg = document.getElementById('toast-msg');
let notificationToast = document.getElementById('notification-toast-id');

// create a reference to the database category
let dishRef = firebase.database().ref('dishes');

// add item form
let dishContent = document.getElementById('main-content-id');

// main data
let mainData = [];


function addItemForm() {
    itemFormId.classList.add('toggle-item-form');
}

function closeForm() {
    itemFormId.classList.remove('toggle-item-form');
}


async function loadDishes() {
    imageSrcId.style.display = 'none';
    // sideBarContent.innerHTML = `
    // <li class="active">Food Dishes</li>`;
    if (categoryId === null) {
        alert('Please select a category');
        return;
    }
    // alert(categoryId);
    //  await dishRef.child().get().then((snapshot) => {
    //     // console.log(snapshot);
    //    let data = Object.values(snapshot.val());
    //    console.log(data);
    //    mainData = data;

    dishRef.on('value', function (snapshot) {
        let data = Object.values(snapshot.val());
        // console.log(data);
        // mainData = data;
        displayDishes(data);
    }
    )
    //    displayDishes(data);

    // })

}

loadDishes();

image.addEventListener('change', function (e) {
    // alert('image changed');
    upoaldImage(e);
}
)


function upoaldImage(e) {
    notificationToast.classList.add('show');
    var dishStorageRef = firebase.storage().ref();
    var dishUploadTask = dishStorageRef.child(`Dish/${e.target.files[0].name}`).put(e.target.files[0]);
    dishUploadTask.on('state_changed',
        (snapshot) => {

            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toastMsg.innerHTML = 'Uploading...' + progress + '%';
            
            
            // console.log('Upload is ' + percentage + '% done');
        },
        (err) => {
            console.log(err);
        },
        () => {
            console.log('Upload is complete');
            dishUploadTask.snapshot.ref.getDownloadURL().then((url) => {
                dishImageUrl = url
                imageSrcId.src = url;
                notificationToast.classList.remove('show');
            }
            )
        }
    )
}

async function addDish() {

    if (editCheck) {
        await updateDish();
        return;
    }
    let dishImage = dishImageUrl;
    let key = dishRef.push().getKey();
    if (dishName.value === '' || dishPrice === '' || dishImage === '') {
        // alert('All fields are required');
        return;
    }

    let dishObj = {
        dishName: dishName.value,
        dishPrice: dishPrice.value,
        dishImage: dishImage,
        dishId: key,
        categoryId: categoryId,
        categoryName:categoryName
    }
    await dishRef.child(key).set(dishObj)
        .then(function () {
            dishName.value = '';
            dishPrice.value = '';
            dishImage = '';
            loadDishes();
            closeForm();
        })
        .catch(function (err) {
            console.log(err);
        })

    dishName.value = '';
    dishImage = '';
    // loadDishes();
    // closeForm();
}


function displayDishes(dishList) {
    dishContent.innerHTML = '';
    console.log(dishList);
    console.log(dishList.length);
    for (let i = 0; i < dishList.length; i++) {
        console.log(i);
    console.log(dishList[i]['categoryId']);
  console.log(dishList[i]['categoryId']);
    // dishList.forEach(dish => {
    //     console.log(dish[0]['categoryId']);
    //     console.log(categoryId);
        if(dishList[i]['categoryId'] != categoryId){
            // alert('No dish found');
            console.log('No dish found');
            continue;
        }
        dishContent.innerHTML += `

        <div id=${dishList[i].dishId} class="dish-item">
            <p>${dishList[i].dishName}</p>
            <p>${dishList[i].dishPrice}</p>
            <img src="${dishList[i].dishImage}" alt="">
            <div class="dish-item-manipulation-btns">
            <button onclick="editDish(this)" >Edit</button>
            <button onclick="deleteDish(this)">Delete</button>
            </div>
        </div>
        `
    // })
}
}


function deleteDish(e){
    let dishId = e.parentElement.parentElement.id;
    // alert(dishId);
    let confirmDelete = confirm('Are you sure you want to delete this dish?');
    if(!confirmDelete){
        return;
    }
    dishRef.child(dishId).remove()
    .then(() => {
        loadDishes();
    })
    .catch((err) => {
        console.log(err);
    })
}

function editDish(e){
    imageSrcId.style.display = 'block';

    let dishId = e.parentElement.parentElement.id;
    updateKey = dishId;
    // get data from firebase database according to dishId
    dishRef.child(dishId).get().then((snapshot) => {
        let dish = snapshot.val();
        console.log(dish);
        dishName.value = dish.dishName;
        dishPrice.value = dish.dishPrice;
        dishImageUrl = dish.dishImage;
        imageSrcId.src = dish.dishImage;
        itemFormId.classList.add('toggle-item-form');
        editCheck = true;
    })
}

async function updateDish(){
   
    let updatedDish = {
        dishName: dishName.value,
        dishImage: dishImageUrl,
        dishPrice: dishPrice.value,
    }

    await firebase.database().ref('dishes/' + updateKey).update(updatedDish)
    .then(function(){
        itemFormId.classList.remove('toggle-item-form');
        closeForm();
        document.getElementById('name').value = '';
        document.getElementById('image').value = '';
        editCheck = false;
    })
    .catch(function(error){
        alert('Error updating category');
    })
}