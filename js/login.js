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

const showAlertError = () => {
    alert(ERROR)
};

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("ingBtn").addEventListener("click", function() {
        
        if (isComplete()){
            localStorage.setItem('user', document.getElementById('email').value);
            window.location = INDEX;
        } else {
            showAlertError();
        }
    });

    
});


document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("botonIngreso").addEventListener("click", function() {
        console.log(document.getElementById("email").value)
    });

    
});