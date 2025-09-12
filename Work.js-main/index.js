import { getComments, postComment } from "./api.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleLikeClick } from "./clickHand.js";

const demoComments = [
  {
    id: "cmt1",
    name: "Глеб Фокин",
    text: "Это будет первый комментарий на этой странице!",
    likes: 3,
    isLiked: false,
    date: "12.02.22 12:18",
  },
  {
    id: "cmt2",
    name: "Варвара Н.",
    text: "Мне нравится как оформлена эта страница! ❤️",
    likes: 75,
    isLiked: true,
    date: "13.02.22 19:22",
  },
];
let allComments = [];

function showGlobalLoader(text) {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.remove("hidden");
  loadingScreen.innerText = text || "Загрузка";
}

function hideGlobalLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.add("hidden");
}

function loadComments() {
  showGlobalLoader("Загрузка комментариев...");

  getComments()
    .then((response) => {
      if (response?.comments && Array.isArray(response.comments)) {
        allComments = response.comments;
      } else {
        console.warn(
          "Сервер не предоставил комментарии.Используем существующие данные."
        );
      }
      renderComments(allComments);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке комментария", error);
      alert("Ошибка при загрузке комментария.Попробуйте еще раз.");
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

function saveNewComment(comment) {
  showGlobalLoader("Отправка комментария...");

  postComment(comment)
    .then((data) => {
      if (data?.comments && Array.isArray(data.comments)) {
        allComments = data.comments;
        renderComments(allComments);
      }
      return loadComments();
    })
    //.catch((error) => {
    //console.error("Ошибка при отправке комментария:", error);
    //alert("Возникла ошибка при отправке комментария. Попробуйте снова.");
    //})
    .finally(() => {
      hideGlobalLoader();
    });
}

document.querySelector(".add-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector(".add-form-name").value.trim();
  const text = document.querySelector(".add-form-text").value.trim();

  if (!name || !text) {
    alert("Заполните поля.");
    return;
  }

  const newComment = {
    name,
    text,
    likes: 0,
    isLiked: false,
    date: new Date().toLocaleString(),
  };

  saveNewComment(newComment);

  document.querySelector(".add-form-name").value = "";
  document.querySelector(".add-form-text").value = "";
});

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document
    .querySelector("#loginForm input[type='email']")
    .value.trim();
  const password = document
    .querySelector("#loginForm input[type='password']")
    .value.trim();

  document.querySelector(".login").classList.add("hidden");
  document.querySelector(".add-form").classList.remove("hidden");
});
window.onload = () => {
  loadComments();
};
