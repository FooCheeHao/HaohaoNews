const API_KEY = "o2hoEij0v7rO-eYpm-PjS--KhIlADCchkpfxkp8KFeyH8mVA";
const url = "https://api.currentsapi.services/v1/latest-news?language=en&apiKey=";

window.addEventListener("load", () => fetchNews());

async function fetchNews(category = "") { // 添加参数 category
    let categoryUrl = category ? `&category=${category}` : ""; // 检查是否传入类别
    const res = await fetch(`${url}${API_KEY}${categoryUrl}`);
    const data = await res.json();
    bindData(data.news);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return; // Adjusted to match the new API response structure

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image; // Adjusted to match the new API response structure
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.published).toLocaleString("en-US", { timeZone: "Asia/Jakarta" }); // Adjusted to match the new API response structure

    newsSource.innerHTML = `${article.source} · ${date}`; // Adjusted to match the new API response structure

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(); // Removed the query parameter as the new API does not support it
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

// change
function onCategoryClick(category) {
    fetchNews(category); // 使用类别筛选新闻
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
}

let curSelectedCategory = null;
function onCategoryClick(category) {
    fetchNews(category);

    // 处理类别按钮的选中状态
    if (curSelectedCategory) {
        curSelectedCategory.classList.remove("active");
    }

    const categoryButton = event.target;
    categoryButton.classList.add("active");
    curSelectedCategory = categoryButton;
}

//searchButton.addEventListener("click", () => {
    //const query = searchText.value;
    //if (!query) return;
    //fetchNews();
    //curSelectedNav?.classList.remove("active");
    //curSelectedNav = null;
//});
