const CART_URL = CART_INFO_URL + userID + EXT_TYPE;

let currentlyCart = getCart();

const subtotal = (id, unitCost) => {
    let i = document.getElementById("count"+id).value;
    if(i<0){
        i = 0;
        document.getElementById("count"+id).value = 0;
    }
    const subtotal = document.getElementById(id);
    subtotal.innerHTML = i * unitCost;
    currentlyCart.articles.find((prod)=>prod.id==id).count = i;
    localStorage.setItem("cart", JSON.stringify(currentlyCart));
}


const showCart = () => {
    let cartHTML=``;
    currentlyCart.articles.forEach((product)=>{
        console.log(product)
        const {id, name, count, unitCost, currency, image} = product;
        cartHTML += `<tr class="cart">
        <td> <img src="${image}" alt="img"></td>
        <td>${name}</td>
        <td>${currency} ${unitCost}</td>
        <td><input type="number" value=${count}  id="count${id}" oninput="subtotal(${id}, ${unitCost})"></td>
        <td> <b>${currency} </b> <b id="${id}"> ${unitCost * count} </b> </td>
      </tr>`
    
    })
    document.getElementById("list").innerHTML = cartHTML;

}

const init = () => {
    getJSONData(CART_URL).then(function (cart) {
        if (cart.status === "ok") {
            addToCart( cart.data.articles[0], false)
            currentlyCart = getCart();
            showCart()
        }
    })
};

document.addEventListener("DOMContentLoaded", init);