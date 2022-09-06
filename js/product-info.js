const prodID = localStorage.getItem('prodID');
const INFO_URL = PRODUCT_INFO_URL + prodID + EXT_TYPE;

const setProdID = (id) => {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}



const showImages = (images, index) => {
    imagesDiv = document.getElementById('images');
    let textToAppend="";
    images.map((image, index) => {
        textToAppend += `
        <div class="image">
            <img src="${image}" alt="${'image'+index}" class="img-thumbnail">
        </div>
        
        `
    })
    console.log(textToAppend)
    imagesDiv.innerHTML = textToAppend;
    
}

const showRelatedProducts = (relatedProducts) => {
    relatedProductsDiv = document.getElementById('relatedProducts');

    let htmlContentToAppend ='';
    
    relatedProducts.map( (product) =>{

        htmlContentToAppend += `
            <div 
                onclick="setProdID(${product.id})" 
                class = "list-group-item list-group-item-action cursor-active"
            >
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                        </div>
                    </div>
                </div>
            </div>
            `
    })
    relatedProductsDiv.innerHTML= htmlContentToAppend;

}

const showInfo = (data) => {
    console.log(data)
    document.getElementById('product-name').innerHTML=data.name;
    document.getElementById('precio').innerHTML = data.currency + ' ' + data.cost;
    document.getElementById('descripcion').innerHTML = data.description;
    document.getElementById('categoria').innerHTML = data.category;
    document.getElementById('cant-vendidos').innerHTML = data.soldCount;
    showImages(data.images)
    console.log(data.relatedProducts)
    showRelatedProducts(data.relatedProducts)
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            showInfo(resultObj.data)
        }
       
        

    });




    
});