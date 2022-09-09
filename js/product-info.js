const prodID = localStorage.getItem("prodID");
const INFO_URL = PRODUCT_INFO_URL + prodID + EXT_TYPE;
const COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;

const setProdID = (id) => {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
};

const showImages = (images) => {
  imagesDiv = document.getElementById("images");

  let imagesToAppend = "";

  images.map((image, index) => {
    imagesToAppend += `
        <div class="image">
            <img src="${image}" alt="${"image" + index}" class="img-thumbnail">
        </div>`;
  });

  imagesDiv.innerHTML = imagesToAppend;
};

/*
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

} */

const showInfo = (data) => {
  const { name, currency, cost, description, category, soldCount, images } =
    data;

  document.getElementById("product-name").innerHTML = name;
  document.getElementById("precio").innerHTML = currency + " " + cost;
  document.getElementById("descripcion").innerHTML = description;
  document.getElementById("categoria").innerHTML = category;
  document.getElementById("cant-vendidos").innerHTML = soldCount;

  showImages(images);
  // showRelatedProducts(data.relatedProducts)
};

const stars = (score)=> {
    let starsToAppend = ""

    for(let i=0; i<score ; i++){
        starsToAppend += '<span class="fa fa-star checked"></span>'
    };

    for(let i=score; i<5 ; i++){
        starsToAppend += '<span class="fa fa-star"></span>'
    };

    return starsToAppend;
}

const showComments = (comments) => {
  const commentsDiv = document.getElementById("comments");
  let htmlContentToAppend = "";

  comments.forEach((comment) => {
    const {dateTime:date, description, score, user} = comment;
    htmlContentToAppend += `
        <div class="list-group-item list-group-item-action cursor-active">
            <div class="row">
                <h5><b>${user}</b> - ${date} - ${stars(score)}</h5>
                <p>${description}</p>
            </div>
        </div>
    `;
  });
  commentsDiv.innerHTML = htmlContentToAppend;
};

const load = () => {
  getJSONData(INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      showInfo(resultObj.data);
    }
  });

  getJSONData(COMMENTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      showComments(resultObj.data);
    }
  });
};

document.addEventListener("DOMContentLoaded", load);
