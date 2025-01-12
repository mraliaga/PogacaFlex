const API_URL =
  "https:api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=02";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

// Modal işlemleri için gerekli elementler
const modal = document.getElementById("movieModal");
const modalPoster = modal.querySelector(".modal-poster");
const modalTitle = modal.querySelector(".modal-title");
const modalRating = modal.querySelector(".modal-rating span");
const modalOverview = modal.querySelector(".modal-overview");
const closeModal = modal.querySelector(".close-modal");

getMovies(API_URL);

async function getMovies(url) {
  const res = await fetch(url);
  const data = await res.json();

  console.log(data.results);
  showMovies(data.results);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== "") {
    getMovies(SEARCH_API + searchTerm);

    search.value = "";
  } else {
    window.location.reload();
  }
});

function showMovies(movies) {
  const moviesContainer =
    document.querySelector(".movies-container") ||
    document.createElement("div");
  moviesContainer.className = "movies-container";
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${IMG_PATH + poster_path}" alt="${title}"/>
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>${title}<small>Overview</small></h3>
        <p>${overview}</p>
      </div>
    `;

    // Film kartına tıklama olayı ekleme
    movieEl.addEventListener("click", () => {
      openModal(movie);
    });

    moviesContainer.appendChild(movieEl);
  });

  // Eğer container daha önce eklenmemişse ekle
  if (!document.querySelector(".movies-container")) {
    document.getElementById("main").appendChild(moviesContainer);
  }
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Tema değiştirme fonksiyonu
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute("data-theme");

  if (currentTheme === "light") {
    body.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

// Sayfa yüklendiğinde tema kontrolü
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const themeToggle = document.querySelector(".theme-toggle");

  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
  }

  themeToggle.addEventListener("click", toggleTheme);
});

// Modal açma fonksiyonu
function openModal(movie) {
  modalPoster.src = IMG_PATH + movie.poster_path;
  modalPoster.alt = movie.title;
  modalTitle.textContent = movie.title;
  modalRating.textContent = movie.vote_average.toFixed(1);
  modalOverview.textContent = movie.overview;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Modal içeriğinin görünür olması için küçük bir gecikme ekleyelim
  setTimeout(() => {
    modal.querySelector(".modal-content").style.opacity = "1";
  }, 10);
}

// Modal kapatma fonksiyonu
function closeModalHandler() {
  modal.classList.add("closing");
  modal
    .querySelector(".modal-content")
    .addEventListener("transitionend", function handler() {
      modal.classList.remove("active", "closing");
      document.body.style.overflow = "";
      this.removeEventListener("transitionend", handler);
    });
}

// Modal kapatma olayları
closeModal.addEventListener("click", closeModalHandler);
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModalHandler();
  }
});

// ESC tuşu ile modalı kapatma
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModalHandler();
  }
});
