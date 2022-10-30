/** La función "setProdID" se encarga de guardar el ID del producto en el localStorage
para luego ser utilizado en la pagina "product-info.html" */
/** La función "addToCart" se encuentra en el archivo "init.js" */
/** La función "getCart" se encuentra en el archivo "init.js" */

const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

let dolarValue = 40;
let currentCart = getCart();

// El carrito de compras ha sido inicializado?
const initialized = Boolean(localStorage.getItem("initialized"));

// Mostrar carrito
const showCart = () => {
  let cartHTML = ``;
  currentCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    cartHTML += `
            <div class="list-group-item list-group-item-action cart-product">
                <div class="row text-center ">
                    <div class="col-sm">
                        <img src="${image}" alt="${name}" class="img-thumbnail mb-4 mb-sm-0" onclick="setProdID(${id})">
                    </div>
                    <div class="col">
                        <h4 class="mb-1 fw-bold">${name}</h4>
                        <p class="mb-1">Costo por unidad : ${costToHTML(
                          currency,
                          unitCost
                        )}</p> 
                        <div class="input-group mb-3">
                            <button class="btn btn-outline-secondary" type="button" onclick="countBtn(false, ${id}, ${unitCost}, '${currency}', true)">-</button>
                            <input type="number" class="form-control text-center" id="count${id}" value="${count}" min="1" oninput="this.value = parseInt(this.value);" onchange="subtotal('${currency}', ${id}, ${unitCost})">
                            <button class="btn btn-outline-secondary" type="button" onclick="countBtn(true, ${id}, ${unitCost}, '${currency}', true)">+</button>
                            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" onclick="showDeleteModal(${id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col">
                        <h4 class="mb-1 fw-bold">Subtotal</h4>
                        <div id="${"subtotal" + id}">
                            ${costToHTML(currency, unitCost * count, true)}
                        </div>
                    </div>
                    </div>
                  </div>
              </div>
    `;
  });
  document.getElementById("list").innerHTML = cartHTML;
};

// Validación de formulario
var forms = document.querySelectorAll(".needs-validation");

Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    },
    false
  );
});

// Pasar precio a html
const costToHTML = (currency, cost, bold = false) => {
  let costString = parseFloat(cost.toFixed(2)).toLocaleString("es-UY");
  let costArray = costString.split(",");
  let costHTML = `
  <div class="${bold ? "fw-bold" : ""}">
    <span>${currency + " $ "}</span><span class="currency">${
    costArray[0]
  }</span><span class="dot">.</span><span class="decimals">${
    costArray[1] ? costArray[1] : "00"
  }</span>
  </div>`;
  return costHTML;
};

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(CART_URL).then(function (cart) {
    if (cart.status === "ok") {
      if (!initialized) {
        addToCart(cart.data.articles[0]);
        window.localStorage.setItem("initialized", true);
      }
      currentCart = getCart();
      showCart();
      seleccionarPago();
    }
  });

  getJSONData(DOLAR_API).then(function (value) {
    if (value.status === "ok") {
      dolarValue = value.data.rates.USD.sell;
      subtotalAll();
    }
  });
});

const showDeleteModal = (itemID) => {
  let itemIndex = currentCart.articles.findIndex((item) => item.id == itemID);
  let item = currentCart.articles[itemIndex];
  document.getElementById("deleteModalBody").innerHTML = `
    <p>¿Está seguro que desea eliminar <b> ${item.name} </b>  del carrito?</p>
    <p>Esta acción no se puede deshacer.</p>
  `;
  document.getElementById("deleteModalBtn").onclick = () => {
    deleteFromCart(itemID);
    showCart();
    subtotalAll();
  };
};

const deleteFromCart = (itemID) => {
  let itemIndex = currentCart.articles.findIndex((item) => item.id == itemID);
  currentCart.articles.splice(itemIndex, 1);
  localStorage.setItem("cart", JSON.stringify(currentCart));
};


const subtotal = (currency, id, unitCost, bool = false) => {
  let amount = document.getElementById("count" + id).value;
  if (amount < 0) {
    amount = 0;
    document.getElementById("count" + id).value = 0;
  }
  const subtotal = document.getElementById("subtotal" + id);
  subtotal.innerHTML = costToHTML(currency, amount * unitCost, bool);
  currentCart.articles.find((prod) => prod.id == id).count = amount;
  localStorage.setItem("cart", JSON.stringify(currentCart));
  subtotalAll();
};

const subtotalAll = () => {
  let dolarCost = 0;
  let pesoCost = 0;

  currentCart.articles.forEach(({ count, unitCost, currency }) => {
    if (currency == "UYU") {
      pesoCost += count * unitCost;
    } else {
      dolarCost += count * unitCost;
    }
  });

  const costSubtotal = pesoCost / dolarValue + dolarCost;
  const shippingCost =
    costSubtotal *
    document.querySelector('input[name="shippingOption"]:checked').value;
  const total = costSubtotal + shippingCost;

  document.getElementById("dolar").innerHTML = dolarValue;
  document.getElementById("subtotalAll").innerHTML = costToHTML(
    "USA",
    costSubtotal
  );
  document.getElementById("shippingCost").innerHTML = costToHTML(
    "USA",
    shippingCost
  );
  document.getElementById("total").innerHTML = costToHTML("USA", total);
};

const countBtn = (add, id, unitCost, currency, bool = false) => {
  let amount = document.getElementById("count" + id).value;
  add ? amount++ : amount--;
  if (amount < 1) {
    amount = 1;
  }
  document.getElementById("count" + id).value = amount;
  subtotal(currency, id, unitCost, bool);
};

const seleccionarPago = (pago = "none") => {
  const tarjeta = document.getElementById("tarjeta");
  const transferencia = document.getElementById("transferencia");
  if (pago == "Credito") {
    enableForm(tarjeta, true);
    enableForm(transferencia, false);
  } else if (pago == "Transferencia") {
    enableForm(tarjeta, false);
    enableForm(transferencia, true);
  } else {
    enableForm(tarjeta, false);
    enableForm(transferencia, false);
  }
};

const enableForm = (form, bool) => {
  form.querySelectorAll("input").forEach((input) => {
    input.disabled = !bool;
    input.required = bool;
    input.opacity = bool ? 1 : 0.5;
  });
}