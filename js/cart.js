let userCart = 25801;
let currentlyCart = [];
const CART_URL = CART_INFO_URL + userCart + EXT_TYPE;

console.log(CART_URL)



const showCart = () => {
    console.log(currentlyCart)
    let cartHTML=``;
    currentlyCart.forEach((product)=>{
        const {id, name, count, unitCost, currency, image} = product;
        cartHTML += `<tr id="${id}">
        <td>${image}</td>
        <td>${name}</td>
        <td>${currency} ${unitCost}</td>
        <td>cant</td>
        <td>subtotal</td>
      </tr>`
    
    })
    document.getElementById("list").innerHTML += cartHTML;

}

const init = () => {
    getJSONData(CART_URL).then(function (cart) {
        if (cart.status === "ok") {
            currentlyCart = cart.data.articles
            showCart()
        }
    })
};

document.addEventListener("DOMContentLoaded", init);