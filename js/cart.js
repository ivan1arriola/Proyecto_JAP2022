const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

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
        <td> <b>${currency} </b> <b id="subtotal${id}"> ${unitCost * count} </b> </td>
      </tr>`
    
    })
    document.getElementById("list").innerHTML = cartHTML;

}

document.addEventListener("DOMContentLoaded", () => {
    getJSONData(CART_URL).then(function (cart) {
        if (cart.status === "ok") {
            addToCart( cart.data.articles[0], false)
            currentlyCart = getCart();
            showCart()
        }
    })
});