const INDEX = "index.html";
const ERROR = "Los datos ingresados no son validos, por favor, revise e intentelo denuevo";     

console.log("version 16:12")


const decodeJwtResponse = async(response)=>{
    console.log(response);
    const json = await response.json();
    return json;
}


function inicioSesionGoogle(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);

    localStorage.setItem('user', responsePayload.email);
    window.location = INDEX;
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
            localStorage.setItem('user', document.getElementById('email').value);
            window.location = INDEX;
        } else {
            showAlertError();
        }
    });

    

    
});