/** La función "setProdID" se encarga de guardar el ID del producto en el localStorage
para luego ser utilizado en la pagina "product-info.html" */
/** La función "addToCart" se encuentra en el archivo "init.js" */
/** La función "getCart" se encuentra en el archivo "init.js" */

const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

let dolarValue = 40;
let currentCart = getCart();

document.addEventListener("DOMContentLoaded", () => {
  hideSuccessAlert();
  getJSONData(CART_URL).then(function (cart) {
    if (cart.status === "ok") {
      const initialized = Boolean(localStorage.getItem("initialized"));
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
      getTotalCost();
    }
  });
});

// Funciones para mostrar carrito de compras

const costToHTML = (currency, cost, bold = false) => {
  let costFixed = parseFloat(cost.toFixed(2));
  let costString = costFixed.toLocaleString("es-UY");
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

const showCart = () => {
  let cartHTML = ``;
  currentCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    cartHTML += `
            <div class="list-group-item cart-product">
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
                            <input type="number" class="form-control text-center" id="count${id}" value="${count}" min="1" required oninput="this.value = parseInt(this.value);" onchange="subtotal('${currency}', ${id}, ${unitCost})">
                            <button class="btn btn-outline-secondary" type="button" onclick="countBtn(true, ${id}, ${unitCost}, '${currency}', true)">+</button>
                            <button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" onclick="showDeleteModal(${id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
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
  getTotalCost();
};

const getTotalCost = () => {
  let dolarCost = 0;
  let pesoCost = 0;

  currentCart.articles.forEach(({ count, unitCost, currency }) => {
    if (currency == "UYU") {
      pesoCost += count * unitCost;
    } else {
      dolarCost += count * unitCost;
    }
  });

  const subtotalCost = (pesoCost / dolarValue) + dolarCost;
  const shippingMethod = document.querySelector(
    'input[name="shippingOption"]:checked'
  ).value;
  const shippingCost = subtotalCost * shippingMethod;
  const total = subtotalCost + shippingCost;

  document.getElementById("dolar").innerHTML = dolarValue;
  document.getElementById("subtotalCost").innerHTML = costToHTML(
    "USA",
    subtotalCost
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

// Funciones para mostrar el modal para eliminar un producto del carrito

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
    getTotalCost();
  };
};

const deleteFromCart = (itemID) => {
  let itemIndex = currentCart.articles.findIndex((item) => item.id == itemID);
  currentCart.articles.splice(itemIndex, 1);
  localStorage.setItem("cart", JSON.stringify(currentCart));
};

// Funciones para la validación de la compra
const forms = document.querySelectorAll(".needs-validation");

const validationPayMethod = () => {
  const payMethod = document.getElementById("payMethod");
  if (payMethod.innerHTML === "No se ha seleccionado") {
    payMethod.classList.add("is-invalid");
  } else {
    payMethod.classList.remove("is-invalid");
  }
};

const seleccionarPago = (pago = "none") => {
  const tarjeta = document.getElementById("tarjeta");
  const transferencia = document.getElementById("transferencia");
  const payMethod = document.getElementById("payMethod");
  if (pago == "Credito") {
    payMethod.innerHTML = "Tarjeta de crédito";
    enableForm(tarjeta, true);
    enableForm(transferencia, false);
  } else if (pago == "Transferencia") {
    payMethod.innerHTML = "Transferencia bancaria";
    enableForm(tarjeta, false);
    enableForm(transferencia, true);
  } else {
    payMethod.innerHTML = "No se ha seleccionado";
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
};

function addValidationPayMethod() {
  const payMethodOptions = document.getElementsByName("payMethod");
  let payMethodSelected = false;
  payMethodOptions.forEach((option) => {
    option.addEventListener("click", () => {
      payMethodSelected = true;
      validationPayMethod();
    });
  });
}

Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener(
    "submit",
    function (event) {
      validationPayMethod();
      addValidationPayMethod();

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        showSuccessAlert();
      }
      form.classList.add("was-validated");
    },
    false
  );
});

// Funciones para mostrar la alerta de compra exitosa

const showSuccessAlert = () => {
  document.getElementById("successAlert").classList.remove("d-none");
};

const hideSuccessAlert = () => {
  document.getElementById("successAlert").classList.add("d-none");
};
