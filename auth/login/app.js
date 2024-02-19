let email = document.getElementById('email');
let password = document.getElementById('password');
let submitBtn = document.getElementById('btn');

async function loginAccount(){
    submitBtn.disabled = true;
   await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
   .then(async(res) => {
        let userId = res.user.uid;
        console.log(userId);
        await firebase.database().ref("users").child(userId).get()
        .then((snap)=>{
            console.log(snap.val());
            localStorage.setItem("current-userId",userId);
            if(snap.val() != undefined && snap.val().userType == "user"){
                // console.log("User");
                window.location.href = "../../userinterface/index.html";
            }
            else if(snap.val() != undefined && snap.val().userType == "admin"){
                window.location.href = "../../dashboard/admin/index.html";
            }
        })
        submitBtn.disabled = false;
        // window.location.href = "/auth/dashboard/index.html";
        Toastify({

            text: "Login Success",

            duration: 3000

        }).showToast();
   
   })

   .catch((error) => {
       console.log(error);
       submitBtn.disabled = false;
   });
}