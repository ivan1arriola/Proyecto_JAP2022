/* Este modulo tiene la responsabilidad de manejar los perfiles de usuario */

const isProfileSignedUp = (email) => {
    const profiles = getProfiles();
    const profile = profiles.find((profile) => profile.email == email);
    return Boolean(profile);
}

const createProfile = (email, name="", lastName="", picture="") => {
    const profiles = getProfiles();
    if( profiles.find((profile) => profile.email == email) === -1) { return false } ;
    const profile = {
        name: name,
        name2: "",
        lastName: lastName,
        lastName2: "",
        email: email,
        telephone: "",
        picture: picture,
    };
    profiles.push(profile);
    localStorage.setItem("profiles", JSON.stringify(profiles));
    return profile;
};

const getProfiles = () => {
    let profiles = localStorage.getItem("profiles");
    if (!Boolean(profiles)) {
        emptyProfiles = [];
        localStorage.setItem("profiles", JSON.stringify(emptyProfiles));
        return emptyProfiles;
    } else {
        profiles = JSON.parse(profiles);
        return profiles;
    }
}



const getProfile = (email) => {
    const profiles = getProfiles();
    const profile = profiles.find((profile) => profile.email === email);
    return profile || "No se encontro el perfil";
}

/* Debe existir el perfil que se quiere actualizar */
const updateProfile = (profile) => {
    const profiles = getProfiles();
    const index = profiles.findIndex((profileFromArray) => profileFromArray.email === profile.email);
    if (index !== -1) profiles[index] = profile;
    localStorage.setItem("profiles", JSON.stringify(profiles));
}

const deleteProfile = (email) => {
    const profiles = getProfiles();
    const index = profiles.findIndex((profile) => profile.email === email);
    if (index !== -1) profiles.splice(index, 1);
    localStorage.setItem("profiles", JSON.stringify(profiles));
}

console.log("profile.js loaded");