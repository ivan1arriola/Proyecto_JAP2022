const email = localStorage.getItem("user");
const profile = getProfile(email);

document.addEventListener("DOMContentLoaded", function (e) {
  showProfile(profile);
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
          const profile = {
            name: document.getElementById('inputName').value,
            name2: document.getElementById('inputName2').value,
            lastName: document.getElementById('inputLastName').value,
            lastName2: document.getElementById('inputLastName2').value,
            email: document.getElementById('inputEmail').value,
            telephone: document.getElementById('inputTelephone').value,
            picture: "document.getElementById('inputPicture').value",
          }
          updateProfile(profile)
          showProfile(profile)
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()



const updateProfileHTML = () => {
  const profile = {
    name: document.getElementById("name").value,
    name2: document.getElementById("name2").value,
    lastName: document.getElementById("lastName").value,
    lastName2: document.getElementById("lastName2").value,
    email: document.getElementById("email").value,
    telephone: document.getElementById("telephone").value,
    picture: document.getElementById("picture").scr,
  }

  showProfile(profile);
  updateProfile(profile)

};



const showProfile = (profile) => {
  // en el html
  if(profile.name) document.getElementById("fullName").innerHTML = profile.name + " " + profile.lastName;
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