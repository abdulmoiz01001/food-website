
let categoryCard = document.getElementById('category-cards-id');
// let categoryContainer = document.getElementById('categoryContainer');
let categoryRef = firebase.database().ref('categories');

async function loadCategories(){
    // Load categories from the firebase database
    categoryRef.on('value', function(snapshot){
        let categories = snapshot.val();
        let categoryList = [];
        for(let category in categories){
            categoryList.push({id: category, name: categories[category].categoryName, image: categories[category].categoryImage});
        }
        displayCategories(categoryList);
    })
}

loadCategories();


function displayCategories(categories){
   
    let categoryList = categories.map((category) => {
        return `
        <div id="${category.id}" onclick="navigateToDishes(this)" class="category-card">
        <img src="${category.image}" alt="...">
        <p>${category.name}</p>
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