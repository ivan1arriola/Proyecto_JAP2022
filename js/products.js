let currentCatArray = [];
let catName ='';
const catID = localStorage.getItem("catID");
const URL_CAT = "https://japceibal.github.io/emercado-api/cats_products/" + catID + ".json";

function showCatList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentCatArray.length; i++){
        let cat = currentCatArray[i];

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
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
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

    });
});