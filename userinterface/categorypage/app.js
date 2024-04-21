
let categoryCard = document.getElementById('category-cards-id');
// let categoryContainer = document.getElementById('categoryContainer');
let categoryRef = firebase.database().ref('categories');

async function loadCategories(){
    // Load categories from the firebase database
    categoryRef.on('value', function(snapshot){
        let categories = snapshot.val();
        let categoryList = [];
        for(let category in categories){
            categoryList.push({id: category, name: categories[category].categoryName, description: categories[category].categoryDescription , image: categories[category].categoryImage});
        }
        displayCategories(categoryList);
    })
}

loadCategories();


function displayCategories(categories){
   
    console.log(categories);
    let categoryList = categories.map((category) => {
        return `
        <div id="${category.id}" onclick="navigateToDishes(this)" class="category-card">
        <img src="${category.image}" alt="...">
        <div class="info">
        <h1>${category.name}</h1>
        <p>${category.description}</p>
        </div>
    </div>
        `
    }
    
        )
        categoryCard.innerHTML = categoryList.join('');
}


function navigateToDishes(e){
    // console.log(e.id);
    localStorage.setItem("current-categoryId", e.id);
    window.location.href = "../dishes/index.html";
}