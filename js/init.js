const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

/** Api de cotización de dólares sacada de  */
const DOLAR_API = "https://cotizaciones-brou.herokuapp.com/api/currency/latest";


/* Funciones para manejo de sesión */
const USER = localStorage.getItem("user")
const currenlyPath = window.location.pathname;
const loginPath = "/login.html";

const loginOut = () => {
  localStorage.removeItem("user");
  location.reload();
};

const setProdID = (id) => {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
};

document.addEventListener("DOMContentLoaded", function () {
  if(currenlyPath === loginPath) {
    return false;
  }
  if (!Boolean(USER) ) {
    window.location = loginPath;
  } else {
    document.getElementById("user").innerHTML = USER;
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

//-------------------------------------------------------------------
// Gestion de perfiles de usuario
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

