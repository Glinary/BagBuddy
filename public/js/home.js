const topBar = document.querySelector("#top-sec");
const AddButton = document.querySelector("#add-circle-hide");
const dimPage = document.querySelector(".dim-page");
const addOpHome = document.querySelector("#home-add-op");
const addOpBag = document.querySelector("#bag-add-op");
const addBtnIcon = document.querySelector("#add-main-btn");
const searchBar = document.querySelector(".search-bar-wrapper");
const topBarAct = document.querySelector("#active-header-wrapper");
const searchIcon = document.querySelector("#search-bar-icon");
const searchClose = document.querySelector("#search-close");

var currentURL = window.location.href;

let addToggleFlag = 0;

AddButton.addEventListener("click", (event) => {
  if (addToggleFlag == 0) {
    toggleAddOption();
    addBtnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
    dimPage.style.display = "block";
    addToggleFlag = 1;
  } else {
    toggleAddOption();
    addBtnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`;
    dimPage.style.display = "none";
    addToggleFlag = 0;
  }
});

searchIcon.addEventListener("click", function () {
  topBarAct.style.display = "none";
  searchBar.style.display = "flex";

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      closeSearch();
    }
  });
});

searchClose.addEventListener("click", function () {
  closeSearch();
});

function toggleAddOption() {
  if (currentURL.includes("bag")) {
    if (addToggleFlag == 0) {
      addOpBag.style.display = "flex";
    } else {
      addOpBag.style.display = "none";
    }
  } else {
    if (addToggleFlag == 0) {
      addOpHome.style.display = "flex";
    } else {
      addOpHome.style.display = "none";
    }
  }
}

function closeSearch() {
  searchBar.style.display = "none";
  topBarAct.style.display = "flex";
}
