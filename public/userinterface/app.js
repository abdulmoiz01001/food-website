
let currentUserId = localStorage.getItem('current-userId');
// console.log(currentUserId);
let login = document.getElementById('login-id');
let logout = document.getElementById('logout-id');
let signup = document.getElementById('signup-id');

// let plateImg = document.getElementById('plate-img');

if(currentUserId == null){
    logout.style.display = "none";
  }
  else{
      login.style.display = "none";
      signup.style.display = "none";
  
  }


 



// for(let i = 0; i < 3; i++){
//   if(i == 0){
// setTimeout(() => {
//       plateImg.src = "../assets/plate.jpg"
// }, 2000);
// continue;
//   }
//   else if( i == 1){
//     setTimeout(() => {

//       plateImg.src = "../assets/plate2.png"
//     },2000);
//     continue;
//   }
//   else if( i == 2){
// setTimeout(() => {
//       plateImg.src = "../assets/plate3.png"
// }, 2000);
// // i=-1;
// continue;
//   }
// }