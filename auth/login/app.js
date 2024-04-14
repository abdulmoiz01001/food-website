let email = document.getElementById('email');
let password = document.getElementById('password');
let submitBtn = document.getElementById('btn');

async function loginAccount(){
    // localStorage.setItem("add_to_card",[""])
    submitBtn.disabled = true;
   await firebase.auth().signInWithEmailAndPassword(email.value, password.value)
   .then(async(res) => {
        let userId = res.user.uid;
        // let username = res.user.name;
        // console.log(res.user);
        await firebase.database().ref("users").child(userId).get()
        .then((snap)=>{
            console.log(snap.val());
            localStorage.setItem("current-userId",userId);
            // localStorage.setItem("current-username",username);
            if(snap.val() != undefined && snap.val().userType == "user"){
                // console.log("User");
                localStorage.setItem("username",JSON.stringify(snap.val()["name"]) )
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
       msg = error;
       loadToast(msg)
       submitBtn.disabled = false;
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
