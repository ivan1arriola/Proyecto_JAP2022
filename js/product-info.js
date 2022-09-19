const prodID = localStorage.getItem("prodID");
const INFO_URL = PRODUCT_INFO_URL + prodID + EXT_TYPE;
const COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + prodID + EXT_TYPE;


const commentToHtml = (comment) => {
  const { dateTime: date, description, score, user } = comment;
  return `
    <div class="list-group-item ">
      <h5><b class=${(score>3)? 'success' : (score<3)? 'danger' : 'warning'} >${user}</b> - ${date} - ${stars(score)}</h5>
      <p>${description}</p>
    </div>
  `;
}

const setCommentDate = () => {
  const date = new Date();
  console.log(date)

  const month = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
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

const submitScore = () => {
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
  commentsDiv.innerHTML = commentToHtml(newComment) + commentsDiv.innerHTML;
};

const showImages = (images) => {
  imagesDiv = document.getElementById("images");
  let imagesToAppend = "";
  images.forEach((image, index) => {
    imagesToAppend += `
        <div class="image">
            <img src="${image}" alt="${"image" + index}" class="img-thumbnail">
        </div>`;
  });
  imagesDiv.innerHTML = imagesToAppend;
};

const showInfo = (data) => {
  const { name, currency, cost, description, category, soldCount, images } =data;

  document.getElementById("product-name").innerHTML = name;
  document.getElementById("precio").innerHTML = currency + " " + cost;
  document.getElementById("descripcion").innerHTML = description;
  document.getElementById("categoria").innerHTML = category;
  document.getElementById("cant-vendidos").innerHTML = soldCount;

  showImages(images);
  // showRelatedProducts(data.relatedProducts)
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
