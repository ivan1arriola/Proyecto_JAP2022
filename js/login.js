const INDEX = "index.html";
const ERROR =
  "Los datos ingresados no son validos, por favor, revise e inténtelo de nuevo";

const ids = ["email", "password"];

// Fetch all the forms we want to apply custom Bootstrap validation styles to
var forms = document.querySelectorAll(".needs-validation");

// Loop over them and prevent submission
Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (form.checkValidity()) {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (isProfileSignedUp(email)) {
          logIn(email);
        } else {
          createProfile(email, "", "", "");

        }
      }
      form.classList.add("was-validated");
    },
    false
  );
});

const logIn = (user) => {
  localStorage.setItem("user", user);
  window.location = INDEX;
};


// Inicio de sesion con Google

/**  
 * Obtuve este JWT decoder de 
 * https://stackoverflow.com/questions/71686512/gsi-logger-the-value-of-callback-is-not-a-function-configuration-ignored 
 */
function decodeJwtResponse(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

// puerto 5500 para correr el servidor local

globalThis.inicioConGoogle = (response) => {
  const googleProfile = decodeJwtResponse(response.credential);

  const name = googleProfile.given_name;
  const lastName = googleProfile.family_name;
  const email = googleProfile.email;
  const picture = googleProfile.picture;

  if (!isProfileSignedUp(email)) {
    createProfile(email, name, lastName, picture);
  }
  logIn(email);

};

console.log("login.js loaded");