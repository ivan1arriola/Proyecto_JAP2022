const profile = {
  name: "",
  name2: "",
  lastName: "",
  lastName2: "",
  email: "",
  telephone: "",
  picture: "",
};

const profiles = getProfiles();


document.addEventListener("DOMContentLoaded", function (e) {
  showProfile();
});




(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          updateProfile()
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()



const updateProfileHTML = () => {
  profile.name = document.getElementById("inputName").value;
  profile.name2 = document.getElementById("inputName2").value;
  profile.lastName = document.getElementById("inputLastName").value;
  profile.lastName2 = document.getElementById("inputLastName2").value;
  profile.email = document.getElementById("inputEmail").value;
  profile.telephone = document.getElementById("inputTelephone").value;
};



const showProfile = () => {
  // en el html
  document.getElementById("name").value = profile.name;
  document.getElementById("name2").value = profile.name2;
  document.getElementById("lastName").value = profile.lastName;
  document.getElementById("lastName2").value = profile.lastName2;
  document.getElementById("email").value = profile.email;
  document.getElementById("telephone").value = profile.telephone;

  // en el modal
  document.getElementById("inputName").value = profile.name;
  document.getElementById("inputName2").value = profile.name2;
  document.getElementById("inputLastName").value = profile.lastName;
  document.getElementById("inputLastName2").value = profile.lastName2;
  document.getElementById("inputEmail").value = profile.email;
  document.getElementById("inputTelephone").value = profile.telephone;

};