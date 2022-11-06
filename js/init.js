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
const USER = localStorage.getItem("user");
const LOGIN = "login.html";

const loginOut = () => {
  localStorage.removeItem("user");
  location.reload();
};

const setProdID = (id) => {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
};

document.addEventListener("DOMContentLoaded", function () {
  if (!Boolean(USER)) {
    window.location = LOGIN;
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
