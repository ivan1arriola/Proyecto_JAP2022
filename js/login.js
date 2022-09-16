
const INDEX = "index.html";
const ERROR = "Los datos ingresados no son validos, por favor, revise e intentelo denuevo";     

console.log("version 19:40")
console.log("usuario actual :", localStorage.getItem('user'))

const loginIn = (user) => {
    localStorage.setItem('user', user);
    window.location = INDEX;
 }


const decodeJwtResponse = (response)=>{
    console.log("responsse: ", response);
    const json = jwtDecode(response);
    console.log("json: ", json)
    return json;
}


globalThis.inicioSesionGoogle = (response) => {
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    localStorage.setItem('user', responsePayload.email);
    //loginIn(responsePayload.email)
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