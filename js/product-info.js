const prodID = localStorage.getItem("prodID");
const INFO_URL = PRODUCT_INFO_URL + prodID + EXT_TYPE;
const COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;




const stars = (score) => {
  let starsToAppend = "";

  for (let i = 0; i < score; i++) {
    starsToAppend += '<span class="fa fa-star checked"></span>';
  }

  for (let i = score; i < 5; i++) {
    starsToAppend += '<span class="fa fa-star"></span>';
  }

  return starsToAppend;
};


const commentToHtml = (comment) => {
  const { dateTime: date, description, score, user } = comment;
  return `
    <div class="list-group-item ">
      <h5><b class=${(score > 3) ? 'success' : (score < 3) ? 'danger' : 'warning'} >${user}</b> - ${date} - ${stars(score)}</h5>
      <p>${description}</p>
    </div>
  `;
}

const formatDate = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
  );
};

const hideCommentsEmpty = () => {
  document.getElementById('commentsEmpty').style.display = 'none'
};

const pushNewComment = (newComment) => {
  let localComments = JSON.parse(localStorage.getItem("commentOf"+prodID));
  if(localComments == null) localComments = [];
  localComments.unshift(newComment);
  localStorage.setItem("commentOf"+prodID, JSON.stringify(localComments));
}

const submitNewComment = () => {

const commentElem = document.getElementById("comment");
const scoreElem = document.getElementById("score");

  // validar que se haya escrito algo
  if (commentElem.value.trim() == ""){
    alert("Tiene que escribir algo");
    return -1;
  }

  const newComment = {
    product: prodID,
    score: scoreElem.value,
    description: commentElem.value,
    user: localStorage.getItem("user"),
    dateTime: formatDate(new Date()),
  };

  pushNewComment(newComment);

  scoreElem.value = 1;
  commentElem.value = ''

  const commentsDiv = document.getElementById("comments");
  hideCommentsEmpty()
  commentsDiv.innerHTML = commentToHtml(newComment) + commentsDiv.innerHTML;
};

const imagesCarouselHTML = (images) => {
  let imagesToAppend = "";
  images.forEach((image, index) => {

    if (index == 0) {
      imagesToAppend += `
      <div class="carousel-item active">
        <img class="d-block w-100" src="${image}" alt="${"image" + index}">
      </div>
          `
    }
    else {
      imagesToAppend += `
    <div class="carousel-item ">
      <img class="d-block w-100" src="${image}" alt="${"image" + index}">
    </div>
        `
    };
  });
  return imagesToAppend;
};

const carouselIndicatorsHTML = (images) => {
  let carouselIndicators = '';
  images.forEach((image, index) => {

    if (index == 0) {
      carouselIndicators += `<li data-target="#carouselIndicators" data-slide-to="${index}" class="active"></li>`;
    }
    else {
      carouselIndicators += `<li data-target="#carouselIndicators" data-slide-to="${index}"></li>`;
    };
  });

  return carouselIndicators;
};

const relatedProductsToHTML = (products) => {
  let relatedProductsHTML = ``;
  products.forEach((product) => {
    const { id, name, image } = product;
    relatedProductsHTML += `
    <div onclick="setProdID(${id})" class="card hover">
      <img class="card-img " src=${image} alt="${name + ' ' + id}">
      <div class="card-body">
        <h3 class="card-title">${name}</h3>
      </div>
    </div>
    `
  })
  return relatedProductsHTML;

}

const showInfo = (data) => {
  const { name, currency, cost, description, category, soldCount, images, relatedProducts } = data;

  document.getElementById("product-name").innerHTML = name;
  document.getElementById("product-name-modal").innerHTML = name;
  document.getElementById("precio").innerHTML = currency + " " + cost;
  document.getElementById("descripcion").innerHTML = description;
  document.getElementById("categoria").innerHTML = category;
  document.getElementById("cant-vendidos").innerHTML = soldCount;
  document.getElementById('relatedProducts').innerHTML = relatedProductsToHTML(relatedProducts);

  document.getElementById('carousel-indicators').innerHTML = carouselIndicatorsHTML(images);
  document.getElementById("images").innerHTML = imagesCarouselHTML(images);

  newArticle = {
    id: prodID,
    name: name,
    count: 1,
    unitCost: cost,
    currency: currency,
    image: images[0]
  }

  document.getElementById("btn-addToCart").addEventListener("click", () => addToCart(newArticle));
};



const showComments = (comments, localComments) => {
  if (comments.length > 0 || localComments.length > 0) hideCommentsEmpty();

  let htmlContentToAppend = "";
  
  localComments.forEach( (comment) => { htmlContentToAppend += commentToHtml(comment); } );
  comments.forEach( (comment) => { htmlContentToAppend += commentToHtml(comment); } );

  document.getElementById("comments").innerHTML = htmlContentToAppend;
  document.getElementById("newComment").addEventListener("click", ()=>{
    submitNewComment();
  })
};

document.addEventListener("DOMContentLoaded", () => {
  getJSONData(INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      showInfo(resultObj.data);
    }
  });

  getJSONData(COMMENTS_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      const localComments = JSON.parse(localStorage.getItem("commentOf"+prodID))

      localComments == null ? 
        showComments(resultObj.data, []) :
        showComments(resultObj.data, localComments);
    }
  });
});
