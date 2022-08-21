const INDEX = "index.html";
const ERROR = "Los datos ingresados no son validos, por favor, revise e intentelo denuevo";     

const isComplete = () => {
    let arr = ["password", "email"];
    let i = 0;
    do {
        isEmpty = document.getElementById(arr[i]).value == ''; 
        i++ 
    } while(!isEmpty && i < arr.length);
    return !isEmpty;
};

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

const showAlertError = () => {
    alert(ERROR)
};

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("ingBtn").addEventListener("click", function() {
        
        if (isComplete()){
            sessionStorage.setItem('user', document.getElementById('email').value);
            window.location = INDEX;
        } else {
            showAlertError();
        }
    });

    
});