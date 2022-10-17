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
const DOLAR_API = 'https://cotizaciones-brou.herokuapp.com/api/currency/latest'
let UYU_to_USA;

let currentlyCart = getCart();


const subtotal = (id, unitCost) => {
    let amount = document.getElementById("count"+id).value;
    if(amount<0){
        amount = 0;
        document.getElementById("count"+id).value = 0;
    }
    const subtotal = document.getElementById("subtotal"+id);
    subtotal.innerHTML = amount * unitCost;
    currentlyCart.articles.find((prod)=>prod.id==id).count = amount;
    localStorage.setItem("cart", JSON.stringify(currentlyCart));
    subtotalAll()
}

const subtotalAll = () => {

    let usdCost = 0;
    let uyuCost = 0;

    

    currentlyCart.articles.forEach(({count, unitCost, currency}) => {

        if(currency=="UYU"){
            uyuCost += count * unitCost;
        } else {
            usdCost += count * unitCost;
        }

    })

    document.getElementById("subtotalAll").innerHTML= (uyuCost * UYU_to_USA + usdCost).toFixed(2);


}

const showCart = () => {
    let cartHTML=``;
    currentlyCart.articles.forEach((product)=>{
        const {id, name, count, unitCost, currency, image} = product;
        cartHTML += `<tr class="cart-product">
        <td > <img src="${image}" alt="img" onClick="setProdID(${id})" class="click"></td>
        <td>${name}</td>
        <td>${currency} ${unitCost}</td>
        <td><input type="number" value=${count}  id="count${id}" oninput="subtotal(${id}, ${unitCost})"></td>
        <td> <b>${currency} <span id="subtotal${id}"> ${unitCost * count} </span> </b> </td>
        <td> <button id="delete${id}" type="button" class="btn btn-danger"><span class="fa fa-trash"></span>
        </button> </td>
      </tr>`
    
    })
    document.getElementById("list").innerHTML = cartHTML;

}

document.addEventListener("DOMContentLoaded", () => {

    getJSONData(DOLAR_API).then(function (value) {
        if (value.status === "ok") {
            UYU_to_USA = 1/value.data.rates.USD.sell
        }
    })
    
    getJSONData(CART_URL).then(function (cart) {
        if (cart.status === "ok") {
            addToCart( cart.data.articles[0], false)
            currentlyCart = getCart();
            showCart()
            subtotalAll()
        }
    })

});