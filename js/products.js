let currentCatArray = [];
let catName ='';

let minCount = undefined;
let maxCount = undefined;

const catID = localStorage.getItem("catID");
const URL_CAT = "https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json";

const sortByCostAscBtn = document.getElementById("sortByCostAscBtn");
const sortByCostDescBtn = document.getElementById("sortByCostDescBtn");
const sortBySoldCountBtn = document.getElementById("sortBySoldCountBtn")

function showCatList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCatArray.length; i++){
        let cat = currentCatArray[i];
        if (((minCount == undefined) || (minCount != undefined && parseInt(cat.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(cat.cost) <= maxCount))){

            htmlContentToAppend += `
            <div onclick="setCatID(${cat.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${cat.image}" alt="${cat.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${cat.name} - ${cat.currency} ${cat.cost}</h4>
                            <small class="text-muted">${cat.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${cat.description}</p>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

const sortByCostAsc = () => {
    currentCatArray = currentCatArray.sort((a,b)=>{
        return a.cost - b.cost;
    })
    showCatList()
}

const sortByCostDesc = () => {
    currentCatArray = currentCatArray.sort((a,b)=>{
        return b.cost - a.cost;
    })
    showCatList()
}

const sortBySoldCount = () => {
    currentCatArray = currentCatArray.sort((a,b)=>{
        return b.soldCount - a.soldCount;
    })
    showCatList()
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(URL_CAT).then(function(resultObj){
        if (resultObj.status === "ok"){
            catName = resultObj.data.catName
            currentCatArray = resultObj.data.products
            showCatList()
        }

        document.getElementsByClassName("lead")[0].innerHTML =` <p> Verás aquí todas los productos de la categoria <b>${catName}</b> </p>`
        
        
        sortByCostAscBtn.addEventListener("click", sortByCostAsc)
        sortByCostDescBtn.addEventListener("click", sortByCostDesc)
        sortBySoldCountBtn.addEventListener("click", sortBySoldCount)

    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCatList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCatList();
    });
});

/* Con el listado de productos desplegado:
    Aplicar filtros a partir de rango de precio definido.
    Agregar las funcionalidades de orden ascendente y descendente en función del precio 
    y descendente en función de la relevancia (tomaremos para ello la cantidad de artículos vendidos)
*/

