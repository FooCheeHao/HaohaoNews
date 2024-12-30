const API_KEY = "o2hoEij0v7rO-eYpm-PjS--KhIlADCchkpfxkp8KFeyH8mVA"; //api key
const url = "https://api.currentsapi.services/v1/latest-news?apiKey="; //api url
let language = "en"; // Default language

window.addEventListener("load", () => fetchNews());

async function fetchNews(category = "", lang = language) {
    let categoryUrl = category ? `&category=${category}` : "";
    const res = await fetch(`${url}${API_KEY}&language=${lang}${categoryUrl}`);
    const data = await res.json();
    articles = data.news; // Store fetched articles
    bindData(articles);
}

function onSearchClick() { // Search button click event
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchInput)
        //article.description.toLowerCase().includes(searchInput)
    );
    bindData(filteredArticles);
}

function onLanguageChange() {
    const languageSelector = document.getElementById("languages");
    language = languageSelector.value;
    fetchNews();
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.image) return;

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

    newsImg.src = article.image;
    newsTitle.innerHTML = `${article.title.slice(0, 999)}`;
    newsDesc.innerHTML = `${article.description.slice(0, 999)}`;

    const date = new Date(article.published).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    newsSource.innerHTML = `${article.category} | ${article.author} | ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews();
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

function onCategoryClick(category) {
    fetchNews(category);
    if (curSelectedCategory) {
        curSelectedCategory.classList.remove("active");
    }

    const categoryButton = event.target;
    categoryButton.classList.add("active");
    curSelectedCategory = categoryButton;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Get modal elements
const modal = document.getElementById("newsModal");
const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalSource = document.getElementById("modal-source");
const modalDesc = document.getElementById("modal-desc");
const modalUrl = document.getElementById("modal-url");
const closeModal = document.getElementsByClassName("close")[0];

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.image;
    newsTitle.innerHTML = `${article.title.slice(0, 999)}`;
    newsDesc.innerHTML = `${article.description.slice(0, 100)}`;

    const date = new Date(article.published).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    newsSource.innerHTML = `${article.category} | ${article.author} | ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        openModal(article);
    });
}

function openModal(article) {
    modal.style.display = "block";
    modalTitle.innerHTML = article.title;
    modalImg.src = article.image;
    modalSource.innerHTML = `Category: ${article.category}<br>
                            Author: ${article.author}<br>
                            Date: ${new Date(article.published).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })}`;
    modalDesc.innerHTML = article.description;
    modalUrl.href = article.url;
    modalUrl.innerHTML = article.url;
}

// Close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}