if(localStorage.getItem("perfilInfo")){
    console.log("Perfil Info: " + localStorage.getItem("perfilInfo"));
    const perfilInfo = JSON.parse(localStorage.getItem("perfilInfo"));

    console.log("Perfil Info: " + perfilInfo);


    document.getElementById("fullName").innerHTML = perfilInfo.fullName;
    document.getElementById("givenName").innerHTML = perfilInfo.givenName;
    document.getElementById("imageUrl").innerHTML = '<img src="' + perfilInfo.imageUrl + '" alt="Imagen de perfil" width="100" height="100">';
    document.getElementById("email").innerHTML = perfilInfo.email;

} else {
    console.log("No hay perfil info");
    console.log("Perfil Info: " + localStorage.getItem("user"));
}