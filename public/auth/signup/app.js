
let userName = document.getElementById('name');
let email = document.getElementById('email');
let password = document.getElementById('password');
let submitBtn = document.getElementById('btn');

async function createAccount(){
    submitBtn.disabled = true;
   await firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
   .then(async(res) => {
         let userId = res.user.uid;
         console.log(userId);
         let userObj = {
                name: userName.value,
                email: email.value,
                password: password.value,
                userType: "user",
                userId
            }

            await firebase.database().ref("users").child(userId).set(userObj);
            submitBtn.disabled = false;
            window.location.href = "/auth/login/index.html";
            
        
    })



    .catch((error) => {
        console.log(error);
        submitBtn.disabled = false;
    });
}

// make a eventlisner print the user  on change

// name.addEventListener('change', function(){
//     console.log(name.value);
// }
// )
