
const INDEX = "index.html";
const ERROR = "Los datos ingresados no son validos, por favor, revise e intentelo denuevo";     

console.log("Google Login funcionando")

const loginIn = (user) => {
    localStorage.setItem('user', user);
    window.location = INDEX;
 }


 function decodeJwtResponse(token) { // https://stackoverflow.com/questions/71686512/gsi-logger-the-value-of-callback-is-not-a-function-configuration-ignored
    let base64Url = token.split('.')[1]
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload)
}


globalThis.inicioSesionGoogle = (response) => {
    console.log(response);
    const responsePayload = decodeJwtResponse(response.credential);
    console.log (responsePayload)

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    localStorage.setItem('user', responsePayload.email);
    loginIn(responsePayload.email)
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

const showAlertError = () => {
    alert(ERROR)
};

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("ingBtn").addEventListener("click", () => {
        
        if (isComplete()){
            loginIn(document.getElementById('email').value);
        } else {
            showAlertError();
        }
    });
    

    
});