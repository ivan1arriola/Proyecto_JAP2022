
/** La función "setProdID" se encarga de guardar el ID del producto en el localStorage
para luego ser utilizado en la pagina "product-info.html" */
/** La función "addToCart" se encuentra en el archivo "init.js" */
/** La función "getCart" se encuentra en el archivo "init.js" */

const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

let dolarValue;
let currentlyCart = getCart();

// El carrito de compras ha sido inicializado?
const initialized = localStorage.getItem("initialized") || false;

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(CART_URL).then(function (cart) {
    if (cart.status === "ok") {
      if(!initialized) {
        addToCart(cart.data.articles[0]);
        window.localStorage.setItem("initialized", true);
      }
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


const deleteItem = (itemID) => {
  let itemIndex = currentlyCart.articles.findIndex((item) => item.id == itemID);
  if (itemIndex > -1) {
    // Elimina el elemento del array
    currentlyCart.articles.splice(itemIndex, 1);
  } else {
    console.log("No se encontró el elemento");
  }
  // Guarda el array "currentlyCart" en el localStorage
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
  document.getElementById("shippingCost").innerHTML = shippingCost.toFixed(2);
  document.getElementById("total").innerHTML = total.toFixed(2);
};

const showCart = () => {
  let cartHTML = ``;
  currentlyCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    cartHTML += `
            <div class="list-group-item list-group-item-action  cart-product">
                <div class="row ">
                    <div class="col-sm mb-2">
                        <img src="${image}" alt="${name}" class="img-thumbnail" onclick="setProdID(${id})">
                    </div>
                    <div class="col-sm text-center text-sm-start text-sm-start ">
                        <div>
                          <h4 class="mb-1 fw-bold">${name}</h4>
                          <p class="mb-1 fs-5">${currency} ${unitCost}</p>
                          <p>Cantidad:</p>
                          <input id="count${id}" class="form-control" type="number" value="${count}" min="1" onchange="subtotal(${id}, ${unitCost})">
                        </div>
                    </div>
                    <div class="col text-center">
                        <p class="mb-1 fs-4 ">Subtotal: <br/> ${currency} <span class="fw-bold" id="subtotal${id}">${count * unitCost}</span></p>
                        <button class="btn btn-danger" onclick="deleteItem(${id})">Eliminar</button>
                    </div>
                </div>
            </div>
    `;
  });
  document.getElementById("list").innerHTML = cartHTML;
};

