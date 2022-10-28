if(localStorage.getItem("perfilInfo")){
    console.log("Perfil Info: " + localStorage.getItem("perfilInfo"));
    const perfilInfo = JSON.parse(localStorage.getItem("perfilInfo"));
    console.log("Perfil Info: " + perfilInfo);
    console.log("Perfil Info: " + perfilInfo.fullName);
    console.log("Perfil Info: " + perfilInfo.givenName);
    console.log("Perfil Info: " + perfilInfo.familyName);
    console.log("Perfil Info: " + perfilInfo.imageUrl);
    console.log("Perfil Info: " + perfilInfo.email);

    document.getElementById("fullName").value = perfilInfo.fullName;
    document.getElementById("givenName").value = perfilInfo.givenName;
    document.getElementById("familyName").value = perfilInfo.familyName;
    document.getElementById("imageUrl").src = perfilInfo.imageUrl;
    document.getElementById("email").value = perfilInfo.email;

} else {
    console.log("No hay perfil info");
    console.log("Perfil Info: " + localStorage.getItem("user"));
}