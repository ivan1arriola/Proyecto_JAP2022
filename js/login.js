
const INDEX = "index.html";
const ERROR = "Los datos ingresados no son validos, por favor, revise e intentelo denuevo";     


const loginIn = (user) => {
    localStorage.setItem('user', user);
    window.location = INDEX; 
}

const showAlert = () => {
    document.getElementById("wrongInput").style.visibility = "visible";
}

const hideAlert = () => {
    document.getElementById("wrongInput").style.visibility = "hidden";
}



// https://stackoverflow.com/questions/71686512/gsi-logger-the-value-of-callback-is-not-a-function-configuration-ignored
function decodeJwtResponse(token) { 
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)
}


globalThis.inicioSesionGoogle = (response) => {
    const responsePayload = decodeJwtResponse(response.credential);

    perfilInfo = {
        id: responsePayload.sub,
        fullName: responsePayload.name,
        givenName: responsePayload.given_name,
        familyName: responsePayload.familyName,
        imageUrl: responsePayload.picture,
        email: responsePayload.email
    }

    localStorage.setItem("perfilInfo", JSON.stringify(perfilInfo));
    
    loginIn(responsePayload.name)
}



const isComplete = () => {
    let arr = ["password", "email"];
    let i = 0;
    do {
        isEmpty = document.getElementById(arr[i]).value == ''; 
        i++ 
    } while(!isEmpty && i < arr.length);
    return !isEmpty;
};

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("ingBtn").addEventListener("click", () => {
        
        if (isComplete()){
            loginIn(document.getElementById('email').value);
        } else {
            showAlert();
        }
    });
    

    
});