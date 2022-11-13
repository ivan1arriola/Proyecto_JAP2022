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
      showCost();
    }
  });
});

// Funciones para mostrar carrito de compras

/* Transforma un tipo de moneda y un costo en HTML */
const costToHTML = (currency, cost, bold = false) => {
  let costFixed = parseFloat(cost.toFixed(2));
  let costString = costFixed.toLocaleString("es-UY");
  let costArray = costString.split(",");
  let costHTML = `
  <div class="${bold ? "fw-bold" : ""}">
    <span>${currency + " $ "}</span><span class="currency">${costArray[0]
    }</span><span class="dot">.</span><span class="decimals">${costArray[1] ? costArray[1] : "00"
    }</span>
  </div>`;
  return costHTML;
};

/* Muestra en el HTML los productos del carrito */
const showCart = () => {
  let cartHTML = ``;
  currentCart.articles.forEach((product) => {
    const { id, name, count, unitCost, currency, image } = product;
    let disabled = count == 1 ? "disabled" : "";
    cartHTML += `
            <div class="list-group-item cart-product">
                <div class="row text-center ">
                    <div class="col-sm">
                        <img src="${image}" alt="${name}" class="img-thumbnail mb-4 mb-sm-0" onclick="setProdID(${id})">
                    </div>
                    <div class="col">
                        <h4 class="mb-1 fw-bold">${name}</h4>
                        <p class="mb-1">Costo por unidad : ${costToHTML(currency, unitCost)}</p> 
                        <div class="input-group mb-3">
                            <button id="subtract${id}" ${disabled} class="btn btn-outline-secondary" type="button" onclick="countBtn(false, ${id}, ${unitCost}, '${currency}', true)">-</button>
                            <input type="number" class="form-control text-center" id="count${id}" value="${count}" min="1" required oninput="this.value = parseInt(this.value);" onchange="submitCount(${id})">
                            <button id="add" class="btn btn-outline-secondary" type="button" onclick="countBtn(true, ${id}, ${unitCost}, '${currency}', true)">+</button>
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

/** Función que gestiona el cambio de cantidad de productos en el carrito */
const submitCount = (id) => {
  let count = document.getElementById("count" + id).value;
  if (count < 1) {
    count = 1;
    document.getElementById("count" + id).value = 1;
  }
  if (count == 1) {
    document.getElementById("subtract"+ id).disabled = true;
  } else {
    document.getElementById("subtract"+ id).disabled = false;
  }
  updateProductCount(id);
  showCost();
};

/** Actualiza en el HTML el subtotal del producto ID */
const updateSubtotalProductCost = (id) => {
  const { count, unitCost, currency } = currentCart.articles.find((prod) => prod.id == id)
  const subtotalDiv = document.getElementById("subtotal" + id);
  subtotalDiv.innerHTML = costToHTML(currency, count * unitCost, true);
};

/** Actualiza en localStorage la cantidad de productos ID */
const updateProductCount = (id) => {
  let count = document.getElementById("count" + id).value;
  currentCart.articles.find((prod) => prod.id == id).count = count;
  localStorage.setItem("cart", JSON.stringify(currentCart));
  updateSubtotalProductCost(id);
};

/** Obtiene el subtotal de todo el carrito */
const getSubtotalCartCost = () => {
  let dolarCost = 0;
  let pesoCost = 0;
  currentCart.articles.forEach(({ count, unitCost, currency }) => {
    if (currency == "UYU") {
      pesoCost += count * unitCost;
    } else {
      dolarCost += count * unitCost;
    }
  });
  return (pesoCost / dolarValue) + dolarCost;
};

/** Obtiene el costo de envio */
const getShippingCost = () => {
  let subtotal = getSubtotalCartCost();
  const shippingOption = document.querySelector(
    'input[name="shippingOption"]:checked'
  ).value;
  return shippingOption * subtotal;
};

/** Obtiene el costo total */
const getFinalCost = () => {
  let subtotal = getSubtotalCartCost();
  let shippingCost = getShippingCost();
  return subtotal + shippingCost;
};

/** Muestra en el HTML los costos subtotal, de envio y total del carrito */
const showCost = () => {
  document.getElementById("dolar").innerHTML = dolarValue;

  document.getElementById("subtotalCost").innerHTML = costToHTML(
    "USA",
    getSubtotalCartCost()
  );
  document.getElementById("shippingCost").innerHTML = costToHTML(
    "USA",
    getShippingCost()
  );
  document.getElementById("total").innerHTML = costToHTML(
    "USA", 
    getFinalCost()
  );
};

/** Suma (o resta) en 1 la cantidad de producto "id" del carrito*/
const countBtn = (add, id) => {
  let count = document.getElementById("count" + id)
  add ? count.value++ : count.value--;
  if (count.value < 1) count.value = 1;
  submitCount(id);
};



// Funciones para mostrar el modal para eliminar un producto del carrito

/** Función para mostrar el modal de eliminar producto */
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
    showCost();
  };
};

/** Función para eliminar un producto del carrito */
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

/** Función para habilitar el fomulario seleccionado en el metodo de pago */
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

/** Habilita o deshabilita los campos de un formulario */
const enableForm = (form, bool) => {
  form.querySelectorAll("input").forEach((input) => {
    input.disabled = !bool;
    input.required = bool;
    input.opacity = bool ? 1 : 0.5;
  });
};

/** Agrega un listener a cada opcion de pago para que al seleccionarla se haga la validacion correspondiente */
function addValidationPayMethod() {
  const payMethodOptions = document.getElementsByName("payMethod");
  payMethodOptions.forEach((option) => {
    option.addEventListener("click", () => {
      validationPayMethod();
    });
  });
}

/** EventListener para validar el formulario de envío */
Array.prototype.slice.call(forms).forEach(function (form) {
  form.addEventListener("submit", function (event) {

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

console.log("cart.js loaded");