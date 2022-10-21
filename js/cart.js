const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

/***
 * https://github.com/gmanriqueUy/cotizaciones-brou
 * Este proyecto implementa una REST API abierta (alojada en Heroku) que puede ser utilizada
 * para obtener cotizaciones de las siguientes monedas en Pesos Uruguayos:
 *  Dólar Estadounidense
 *  Peso Argentino
 *  Real Brasileño
 *  Euro
 */
const DOLAR_API = "https://cotizaciones-brou.herokuapp.com/api/currency/latest";
let UYU_to_USA;

let currentlyCart = getCart();

const deleteItem = (itemID) => {
  let itemIndex = currentlyCart.articles.findIndex((item) => item.id == itemID);
  if (itemIndex > -1) {
    // index -1 significa que no hay item para eliminar
    currentlyCart.articles.splice(itemIndex, 1);
  } else {
    console.error('No se encuentra el producto');
  }
  // se actualiza cart en localStorage
  localStorage.setItem("cart", JSON.stringify(currentlyCart));
  showCart();
  subtotalAll()
};

const getShippingCost = (cost) => {
  return (
    cost * document.querySelector('input[name="shippingOption"]:checked').value
  );
};

const subtotal = (id, unitCost) => {
  let amount = document.getElementById("count" + id).value;
  if (amount < 0) {
    amount = 0;
    document.getElementById("count" + id).value = 0;
  }
  const subtotal = document.getElementById("subtotal" + id);
  subtotal.innerHTML = amount * unitCost;
  currentlyCart.articles.find((prod) => prod.id == id).count = amount;
  localStorage.setItem("cart", JSON.stringify(currentlyCart));
  subtotalAll();
};

const subtotalAll = () => {
  let usdCost = 0;
  let uyuCost = 0;

  currentlyCart.articles.forEach(({ count, unitCost, currency }) => {
    if (currency == "UYU") {
      uyuCost += count * unitCost;
    } else {
      usdCost += count * unitCost;
    }
  });

  const cost = uyuCost * UYU_to_USA + usdCost;
  const shippingCost = getShippingCost(cost);
  const total = cost + shippingCost;

  document.getElementById("subtotalAll").innerHTML = cost.toFixed(2);
  document.getElementById("shipping-cost").innerHTML = shippingCost.toFixed(2);
  document.getElementById("total").innerHTML = total.toFixed(2);
};

const showCart = () => {
  let cartHTML = ``;
  currentlyCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    cartHTML += `<tr class="cart-product">
        <td > <img src="${image}" alt="img" onClick="setProdID(${id})" class="click"></td>
        <td>${name}</td>
        <td>${currency} ${unitCost}</td>
        <td><input type="number" value=${count}  id="count${id}" oninput="subtotal(${id}, ${unitCost})"></td>
        <td> <b>${currency} <span id="subtotal${id}"> ${
      unitCost * count
    } </span> </b> </td>
        <td> <button id="delete${id}" type="button" class="btn btn-danger" onclick='deleteItem(${id})'><span class="fa fa-trash"></span>
        </button> </td>
      </tr>`;
  });
  document.getElementById("list").innerHTML = cartHTML;
};

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(CART_URL).then(function (cart) {
    if (cart.status === "ok") {
      addToCart(cart.data.articles[0], false);
      currentlyCart = getCart();
      showCart();
    }
  });

  getJSONData(DOLAR_API).then(function (value) {
    if (value.status === "ok") {
      UYU_to_USA = 1 / value.data.rates.USD.sell;
      subtotalAll();
    }
  });
});
