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
let dolarValue;

let currentlyCart = getCart();

const deleteItem = (itemID) => {
  let itemIndex = currentlyCart.articles.findIndex((item) => item.id == itemID);
  if (itemIndex > -1) {
    // index -1 significa que no hay item para eliminar
    currentlyCart.articles.splice(itemIndex, 1);
  } else {
    console.error("No se encuentra el producto");
  }
  // se actualiza cart en localStorage
  localStorage.setItem("cart", JSON.stringify(currentlyCart));
  showCart();
  subtotalAll();
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
  let dolarCost = 0;
  let pesoCost = 0;

  currentlyCart.articles.forEach(({ count, unitCost, currency }) => {
    if (currency == "UYU") {
      pesoCost += count * unitCost;
    } else {
      dolarCost += count * unitCost;
    }
  });

  const cost = pesoCost / dolarValue + dolarCost;
  const shippingCost = getShippingCost(cost);
  const total = cost + shippingCost;

  document.getElementById("dolar").innerHTML = dolarValue;
  document.getElementById("subtotalAll").innerHTML = cost.toFixed(2);
  document.getElementById("shipping-cost").innerHTML = shippingCost.toFixed(2);
  document.getElementById("total").innerHTML = total.toFixed(2);
};

const showCart = () => {
  let cartHTML = ``;
  currentlyCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    cartHTML += `
            <div class="list-group-item list-group-item-action text-center cart-product">
                <div class="row ">
                    <div class="col-sm mb-2">
                        <img src="${image}" alt="${name}" class="img-thumbnail" onclick="setProdID(${id})">
                    </div>
                    <div class="col">
                        <div>
                            <h4 class="mb-1 text-uppercase fw-bold">${name}</h4>
                        </div>
                        <p class="mb-1 fs-4">${currency} ${unitCost}</p>
                        <p>Cantidad: <input id="count${id}" class="form-control" type="number" value="${count}" min="1" onchange="subtotal(${id}, ${unitCost})"></p>
                    </div>
                    <div class="col">
                        <p class="mb-1 fs-3">Subtotal: <br/> ${currency} <span id="subtotal${id}">${count * unitCost}</span></p>
                        <button class="btn btn-danger" onclick="deleteItem(${id})">Eliminar</button>
                    </div>
                </div>
            </div>
    `;
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
      dolarValue = value.data.rates.USD.sell;
      subtotalAll();
    }
  });
});
