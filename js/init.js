//const host = "https://japceibal.github.io/emercado-api/";
const host = "https://entrega08.azurewebsites.net/";

const CATEGORIES_URL = host + "cats";
const PUBLISH_PRODUCT_URL = host + "sell";
const PRODUCTS_URL = host + "cats_products/";
const PRODUCT_INFO_URL = host + "products/";
const PRODUCT_INFO_COMMENTS_URL = host + "products_comments/";
const CART_INFO_URL = host + "user_cart/";
const CART_BUY_URL = host + "cart";

const USER_PROFILE_URL = host + "user_profile/";

//const EXT_TYPE = ".json";
const EXT_TYPE = "";

/** Api de cotización de dólares sacada de  */
const DOLAR_API = "https://cotizaciones-brou.herokuapp.com/api/currency/latest";


/* Funciones para manejo de sesión */
const USER = localStorage.getItem("user")
const currenlyPath = window.location.pathname.split("/").pop();
const loginPath = "login.html";


const loginOut = () => {
  localStorage.removeItem("user");
  location.reload();
};

const setProdID = (id) => {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
};

document.addEventListener("DOMContentLoaded", function () {
  const userProfile = getProfile(USER);
  if (currenlyPath === loginPath) {
    return false;
  }
  if (!Boolean(USER)) {
    window.location = loginPath;
  }
  if (Boolean(userProfile.picture && userProfile.picture !== "")) {
    document.getElementById("user").innerHTML = `<img src="${userProfile.picture}" alt="user" class="rounded-circle me-2" width="20px" height="20px">`;
  } else {
    document.getElementById("user").innerHTML = `<img src="../img/img_perfil.png" alt="user" class="rounded-circle me-2" width="20px" height="20px">`;
  }
  if (Boolean(userProfile.name && userProfile.lastName)) {
    document.getElementById("user").innerHTML += userProfile.name + " " + userProfile.lastName;
  } else {
    document.getElementById("user").innerHTML += USER;
  }
});

/** Funciones para manejo de carrito*/
const userID = 25801;

const goToCart = () => (window.location = "cart.html");

const getCart = () => {
  let cart = localStorage.getItem("cart");
  if (!Boolean(cart)) {
    emptyCart = {
      user: userID,
      articles: [],
    };
    localStorage.setItem("cart", JSON.stringify(emptyCart));
    return emptyCart;
  } else {
    cart = JSON.parse(cart);
    return cart;
  }
};

let cart = getCart();

/* Funciones para manejo de carrito*/
const addToCart = (newArticle) => {
  let articleIndex = cart.articles.findIndex(
    (article) => article.id == newArticle.id
  );
  if (articleIndex < 0) {
    cart.articles.push(newArticle);
  } else {
    cart.articles[articleIndex].count++;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Gestión de perfiles de usuario
/* Esta parte del código tiene la responsabilidad de manejar los perfiles de usuario */

const isProfileSignedUp = (email) => {
  const profiles = getProfiles();
  return profiles.some((profile) => profile.email == email);
}

const createProfile = (email, name = "", lastName = "", picture = "") => {
  const profiles = getProfiles();
  if (profiles.find((profile) => profile.email == email) === -1) { return false };
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

  if (USER !== profile.email) {
    deleteProfile(USER);
    localStorage.setItem("user", profile.email);
    createProfile(profile.email);
  };
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



//-------------------------------------------------------------------


let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

console.log("init.js loaded");