const prodID = localStorage.getItem("prodID");
const INFO_URL = PRODUCT_INFO_URL + prodID + EXT_TYPE;
const COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;

const hideCommentsEmpty = () => {
  document.getElementById('commentsEmpty').style.display = 'none'
};

const setProdID = (id) => {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html"
}

const commentToHtml = (comment) => {
  const { dateTime: date, description, score, user } = comment;
  return `
    <div class="list-group-item ">
      <h5><b class=${(score > 3) ? 'success' : (score < 3) ? 'danger' : 'warning'} >${user}</b> - ${date} - ${stars(score)}</h5>
      <p>${description}</p>
    </div>
  `;
}

const setCommentDate = () => {
  const date = new Date();
  console.log(date)

  const month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
  const day = date.getDate() < 9 ? "0" + date.getDate() : date.getDate();
  const year = date.getFullYear();
  const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  console.log(date.getDate())

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
  );
};

const submitComment = () => {
  const newComment = {
    product: prodID,
    score: document.getElementById("score").value,
    description: document.getElementById("comment").value,
    user: localStorage.getItem("user"),
    dateTime: setCommentDate(),
  };

  document.getElementById("score").value = 1;
  document.getElementById("comment").value = ''

  let commentsDiv = document.getElementById("comments");
  hideCommentsEmpty()
  commentsDiv.innerHTML = commentToHtml(newComment) + commentsDiv.innerHTML;
};

const showImages = (images) => {
  let imagesToAppend = "";
  let carouselIndicators = '';
  images.forEach((image, index) => {

    if (index == 0) {
      carouselIndicators += `<li data-target="#carouselIndicators" data-slide-to="${index}" class="active"></li>`;
      imagesToAppend += `
      <div class="carousel-item active">
        <img class="d-block w-100" src="${image}" alt="${"image" + index}">
      </div>
          `
    }
    else {
      carouselIndicators += `<li data-target="#carouselIndicators" data-slide-to="${index}"></li>`;
      imagesToAppend += `
    <div class="carousel-item ">
      <img class="d-block w-100" src="${image}" alt="${"image" + index}">
    </div>
        `
    };
  });
  document.getElementById("images").innerHTML = imagesToAppend;
  document.getElementById('carousel-indicators').innerHTML = carouselIndicators;
};

const showRelatedProducts= (products) => {
  let reletedHTML = ``;
  products.forEach((product)=>{
    console.log(product);
    const {id, name, image} = product;
    reletedHTML += `
    <div class="col">
    <div onclick="setProdID(${id})" class="card mx-5" >
      <img class="card-img-top " src=${image} alt="${name + ' ' + id}">
      <div class="card-body">
        <h3 class="card-title">${name}</h3>
      </div>
    </div>
    </div>
    `
  })
  document.getElementById('relatedProducts').innerHTML= reletedHTML;

}

const showInfo = (data) => {
  const { name, currency, cost, description, category, soldCount, images, relatedProducts } = data;

  document.getElementById("product-name").innerHTML = name;
  document.getElementById("precio").innerHTML = currency + " " + cost;
  document.getElementById("descripcion").innerHTML = description;
  document.getElementById("categoria").innerHTML = category;
  document.getElementById("cant-vendidos").innerHTML = soldCount;

  showImages(images);
  showRelatedProducts(relatedProducts)
};

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



const showComments = (comments) => {
  const commentsDiv = document.getElementById("comments");
  let htmlContentToAppend = "";
  if (comments.length >0) hideCommentsEmpty();
  comments.forEach((comment) => {
    htmlContentToAppend += commentToHtml(comment);
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
