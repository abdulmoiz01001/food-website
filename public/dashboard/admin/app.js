// item for instance for category 
let mainContent = document.getElementById('main-content-id');
let itemFormBtn = document.getElementById('add-btn');
let itemFormId = document.getElementById('item-form-id');
let image = document.getElementById('image');
let imageSrcId = document.getElementById('image-src');
let itemName = document.getElementById('name');
let itemDescription = document.getElementById('description');
let itemFormHeading = document.getElementById('item-form-heading');
let imageSrc = false;
// edite check
let editCheck = false;
// update key
let updateKey = '';
let sideBarContent = document.getElementById('side-bar-content');
let pageChange = false;
let line1Id = document.getElementById('line-1');
let dishBtnId = document.getElementById('dish-btn');
let categoryBtnId = document.getElementById('category-btn');
let categoryImageUrl = '';
let toastMsg = document.getElementById('toast-msg');
let notificationToast = document.getElementById('notification-toast-id');
// create a reference to the database category
let categoryRef = firebase.database().ref('categories');

function addItemForm(){
    itemName.value = '';
    itemDescription.value = '';
    imageSrc = false;
    editCheck = false;
    itemFormId.classList.add('toggle-item-form');
    if(!editCheck || !imageSrc){
    imageSrcId.style.display = 'none';
    }

}

function closeForm(){
    itemFormId.classList.remove('toggle-item-form');
}


async function logout(){
    
     await firebase.auth().signOut();
    window.location.replace('/auth/login/index.html');
}


image.addEventListener('change', function(e){
    imageUpload(e);
    itemFormBtn.disabled = false;

});

function imageUpload(e) {
    notificationToast.classList.add('show');
    var categoryStorageRef = firebase.storage().ref();
    var categoryUploadTask = categoryStorageRef.child(`Category/${e.target.files[0].name}`).put(e.target.files[0]);
    categoryUploadTask.on('state_changed',
    (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toastMsg.innerHTML = 'Uploading...' + progress + '%';
            },
            (error) => {
                // Handle unsuccessful uploads
                alert('Error uploading image');
            },
            () => {
    
                categoryUploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    categoryImageUrl = url
                    imageSrcId.src = url
                notificationToast.classList.remove('show');
    
                });
            }
        );
   
   
}

async function addItem(){
    console.log(itemDescription.value);
    console.log(itemName.value);
    if(editCheck==false){
        let itemImage = categoryImageUrl;
        let key = categoryRef.push().getKey();
    
        if(itemName.value === '' || itemImage === '' || itemDescription.value === ''){
            alert('All fields are required');
            return;
        }
    
        let category = {
            categoryName: itemName.value,
            categoryDescription: itemDescription.value,
            categoryImage: itemImage,
            categoryId: key
        }
    
        await categoryRef.child(key).set(category)
        .then(function(){
            
            itemFormId.classList.remove('toggle-item-form');
            closeForm();
            document.getElementById('name').value = '';
            document.getElementById('description').value = '';
            document.getElementById('image').value = '';
        })
        .catch(function(error){
            alert('Error adding item');
        })
    }
    else{
        let updatedCategory = {
            categoryName: itemName.value,
            itemDescription: itemDescription.value,
            categoryImage: categoryImageUrl
        }

        await firebase.database().ref('categories/' + updateKey).update(updatedCategory)
        .then(function(){
            itemFormId.classList.remove('toggle-item-form');
            closeForm();
            document.getElementById('name').value = '';
            document.getElementById('description').value = '';
            document.getElementById('image').value = '';
        })
        .catch(function(error){
            alert('Error updating category');
        })

    }

  
    loadCategories();
}

function loadCategories(){

    // sideBarContent.innerHTML = `
    // <li class="active">Food Dishes</li>`;
            sideBarContent.innerHTML = `
    <li class="active" >Food Categories</li>`;
    sideBarContent.innerHTML += `
    <li onclick="navigateToOrdersPage()"  >Food Orders</li>`;
        categoryRef.on('value', function(snapshot){
            let categories = snapshot.val();
            console.log(categories);
            let categoryList = [];
            for(let category in categories){
                categoryList.push({id: category, description: categories[category].categoryDescription , name: categories[category].categoryName, image: categories[category].categoryImage});
            }
            console.log(categoryList);
            displayCategories(categoryList);
        })
  

}

function navigateToOrdersPage(){
    window.location.href = '/dashboard/admin/orders/index.html';
}

loadCategories();

function displayCategories(categories){
    
    let categoryList = categories.map((category) => {
        console.log(category);
        return `
        <div   class="category-row">

            <div id="${category.id}" onclick="goToDishes(this)"  class="card-body">
            <h5 class="card-title
            ">${category.name}</h5>
            <p>${category.description}</p>
            <div class="image">
            <img src="${category.image}" class="card-img-top" alt="...">
            </div>
            </div>
            <div class="card-manipulation-btn">
            <button class="btn btn-primary" onclick="editCategory('${category.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteCategory('${category.id}')">Delete</button>
            </div>
        </div>
        `
    }

    )
    mainContent.innerHTML = categoryList.join('');
 
}


function goToDishes(e){

    console.log(e.childNodes[1].innerHTML);
    localStorage.setItem('categoryName', e.childNodes[1].innerHTML);
    localStorage.setItem('categoryId', e.id);
     window.location.href = '/dashboard/admin/dishes/index.html';
}

function deleteCategory(id){
    let confirmDelete = confirm('Are you sure you want to delete this category?');
    if(confirmDelete){
        categoryRef.child(id).remove()
        .then(function(){
            loadCategories();

        })
        .catch(function(error){
            alert('Error deleting category');
        })
    }
}

async function editCategory(id){
    
    imageSrcId.style.display = 'block';
    imageSrc = true;
    editCheck = true;
    updateKey = id;
    
    itemFormId.classList.add('toggle-item-form');
    // itemName.value = 'category name';
    itemFormBtn.innerHTML = 'Update Item';

    console.log(id);
    
    await firebase.database().ref('categories/' + id).once('value').then(function(snapshot){
        let category = snapshot.val();
        console.log(category);
        itemName.value = category.categoryName;
        itemDescription.value = category.categoryDescription;
        if(imageSrc){
            imageSrcId.src = category.categoryImage;
        
        }
    }
    )
    .catch(function(error){
        alert('Error getting category');
    })

    
}

