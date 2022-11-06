let productsArray = [];
let catName = '';

let minCount = undefined;
let maxCount = undefined;

const catID = localStorage.getItem("catID");
const CATEGORY_URL = PRODUCTS_URL + catID + EXT_TYPE;

const sortByCostAscBtn = document.getElementById("sortByCostAscBtn");
const sortByCostDescBtn = document.getElementById("sortByCostDescBtn");
const sortBySoldCountBtn = document.getElementById("sortBySoldCountBtn");

const cleanRangeFilterBtn = document.getElementById("clearRangeFilter");
const rangeFilterCountBtn = document.getElementById("rangeFilterCount");

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CATEGORY_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            catName = resultObj.data.catName
            productsArray = resultObj.data.products
            showCatList()
        }

        document.getElementsByClassName("lead")[0].innerHTML = ` <p> Verás aquí todas los productos de la categoría <b>${catName}</b> </p>`;


        sortByCostAscBtn.addEventListener("click", sortByCostAsc);
        sortByCostDescBtn.addEventListener("click", sortByCostDesc);
        sortBySoldCountBtn.addEventListener("click", sortBySoldCount);
        cleanRangeFilterBtn.addEventListener("click", cleanRangeFilter);
        rangeFilterCountBtn.addEventListener("click", rangeFilterCount);
    });

});

function showCatList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < productsArray.length; i++) {
        let product = productsArray[i];
        if (((minCount == undefined) || (parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (parseInt(product.cost) <= maxCount))) {

            htmlContentToAppend += `
            <div onclick="setProdID(${product.id})"  id='${product.id}' class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

const search = () => {
    input = document.getElementById("search").value.toUpperCase();
    tam = input.length;
    productsArray.forEach((product)=>{
        shortName = product.name.toUpperCase().substring(0, tam);
        item = document.getElementById(product.id);
        if(item!= null && input == shortName){
            item.style.display = '';
        } else if(item!= null) item.style.display = 'none'; 
    })
}

const sortByCostAsc = () => {
    productsArray = productsArray.sort((a, b) => {
        return a.cost - b.cost;
    })
    showCatList()
    search()
}

const sortByCostDesc = () => {
    productsArray = productsArray.sort((a, b) => {
        return b.cost - a.cost;
    })
    showCatList()
    search()
}

const sortBySoldCount = () => {
    productsArray = productsArray.sort((a, b) => {
        return b.soldCount - a.soldCount;
    })
    showCatList()
    search()
}

const cleanRangeFilter = () => {
    document.getElementById("rangeFilterCountMin").value = "";
    document.getElementById("rangeFilterCountMax").value = "";
    document.getElementById("search").value = "";

    minCount = undefined;
    maxCount = undefined;

    showCatList();
}

const rangeFilterCount = () => {
    minCount = document.getElementById("rangeFilterCountMin").value;
    maxCount = document.getElementById("rangeFilterCountMax").value;

    if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
        minCount = parseInt(minCount);
    }
    else {
        minCount = undefined;
    }

    if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
        maxCount = parseInt(maxCount);
    }
    else {
        maxCount = undefined;
    }

    showCatList();
    search()
}

console.log("products.js loaded");