const email = localStorage.getItem("user");
const profile = getProfile(email);

document.addEventListener("DOMContentLoaded", function (e) {
  showProfile(profile);
});

/** Habilitar los inputs para la edición */
const enableEdit = () => {
  const inputs = Array.prototype.slice.call(document.getElementsByTagName("input")) 
  inputs.forEach((input) => {
    input.disabled = false;
  });
  document.getElementById("btnEdit").style.display = "none";
  document.getElementById("btnSave").disabled = false;
  document.getElementById("btnSave").style.display = "inline-block";
  document.getElementById("btnCancel").style.display = "inline-block";
  document.getElementById("btnCancel").disabled = false;
};

/** Deshabilitar los inputs para la edición */
const disableEdit = () => {
  const inputs = Array.prototype.slice.call(document.getElementsByTagName("input"))
  inputs.forEach((input) => {
    input.disabled = true;
  });
  document.getElementById("btnEdit").style.display = "inline-block";
  document.getElementById("btnSave").style.display = "none";
  document.getElementById("btnCancel").style.display = "none";
};

/** Cancelar la edición */
const cancelChanges = () => {
  disableEdit();
  showProfile(profile);
};


/** Chequea si el email no está repetido */ 
const validateEmail = () => {
  const emailInput = document.getElementById("inputEmail");
  const profiles = getProfiles();
  const isEmailRegistered = profiles.some((profile) => profile.email === emailInput.value);
  const invalidEmail = document.getElementById("invalidEmail");
  if (emailInput.value === profile.email) {
    emailInput.setCustomValidity("");
    console.log("El email es igual al actual");
    invalidEmail.innerHTML = "Formato de e-mail incorrecto";
    return true;
  }
  if (isEmailRegistered) {
    emailInput.setCustomValidity('Este email ya esta registrado');
    console.log('Este email ya esta registrado');
    invalidEmail.innerHTML = "Este email ya esta registrado";
    return false;
  } else {
    emailInput.setCustomValidity('');
    console.log('Este email no esta registrado');
    invalidEmail.innerHTML = "Formato de e-mail incorrecto";
    return true;
  }
};

/** Guarda los cambios realizados en el perfil  si pasan la validación*/
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        validateEmail();
        document.getElementById("invalidEmail").addEventListener("input", () => { console.log("input") });
        if (form.checkValidity()) {
          updateProfileHTML();
          disableEdit();
        }
        event.preventDefault()
        event.stopPropagation()
        form.classList.add('was-validated')
      }, false)
    })
})()


/** Actualiza el perfil **/
const updateProfileHTML = () => {
  const profileHTML = {
    name: document.getElementById("inputName").value,
    name2: document.getElementById("inputName2").value,
    lastName: document.getElementById("inputLastName").value,
    lastName2: document.getElementById("inputLastName2").value,
    email: document.getElementById("inputEmail").value,
    telephone: document.getElementById("inputTelephone").value,
    picture: document.getElementById("picturePreview").src,
  }
  updateProfile(profileHTML)
  showProfile(profileHTML);
};


/** Despliega la informacion del perfil del usuario en la pagina y en el modal de edicion */
const showProfile = (profile) => {

  document.getElementById("inputName").value = profile.name;
  document.getElementById("inputName2").value = profile.name2;
  document.getElementById("inputLastName").value = profile.lastName;
  document.getElementById("inputLastName2").value = profile.lastName2;
  document.getElementById("inputEmail").value = profile.email;
  document.getElementById("inputTelephone").value = profile.telephone;
  document.getElementById("inputTelephone").value = profile.telephone;
  if (profile.picture) document.getElementById("picturePreview").src = profile.picture;

};

/** Muestra la imagen seleccionada en el modal de edicion y convierte la imagen en base64 */
const preview = () => {
  const file = document.getElementById("inputPicture").files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const picturePreview = document.getElementById("picturePreview");
    picturePreview.src = reader.result;
  };
}


console.log("my-profile.js loaded");


// Funciones para testear


const test_profiles = [{
  name: "Juan",
  name2: "Pablo",
  lastName: "Perez",
  lastName2: "Gonzalez",
  email: "juan" + Math.random() + "@gmail.com",
  telephone: "123456789",
  picture: "https://picsum.photos/200/300",
},{
  name: "Maria",
  name2: "Jose",
  lastName: "Gonzalez",
  lastName2: "Perez",
  email: "maria" + Math.random() + "@outlook.com",
  telephone: "123456789",
  picture: "https://picsum.photos/200/300",
}];

function setTestProfile(number) {
  let testProfile = test_profiles[number];
  localStorage.setItem("user", testProfile.email);
  localStorage.setItem("profiles", JSON.stringify(test_profiles));
  showProfile(testProfile);
}

function deleteLocalStorage() {
  localStorage.clear();
}