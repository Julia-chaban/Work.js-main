import { getComments, postComment, setAuthToken } from "./api.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleLikeClick } from "./clickHand.js";

const loginForm = document.querySelector("#loginForm");
const addForm = document.querySelector(".add-form");
const authorField = document.querySelector(".add-form-name");
const commentField = document.querySelector(".add-form-text");
const commentsList = document.querySelector(".comments-list");

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

  return getComments()
    .then((response) => {
      if (response?.comments && Array.isArray(response.comments)) {
        allComments = response.comments;
      } else {
        console.warn(
          "Сервер не предоставил комментарии. Используем существующие данные."
        );
      }
      return allComments;
    })
    .catch((error) => {
      console.error("Ошибка при загрузке комментариев", error);
      alert("Ошибка при загрузке комментариев. Попробуйте еще раз.");
      return allComments;
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

function saveNewComment(comment) {
  showGlobalLoader("Отправка комментария...");

  return postComment(comment)
    .then(() => {
      return loadComments();
    })
    .then((updatedComments) => {
      renderComments(updatedComments);
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария", error);
      alert("Комментарий слишком короткий. Повторите попытку");
      throw error;
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

function toggleForms(isLoggedIn) {
  const loginForm = document.querySelector("#loginForm");
  const commentForm = document.querySelector(".add-form");
  if (isLoggedIn) {
    loginForm.classList.add("hidden");
    addForm.classList.remove("hidden");
  } else {
    loginForm.classList.remove("hidden");
    addForm.classList.add("hidden");
  }
}

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem("isLoggedIn", "true");
  setAuthToken("AUTH_TOKEN");
  toggleForms(true);
});

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

  saveNewComment(newComment)
    .then(() => {
      document.querySelector(".add-form-name").value = "";
      document.querySelector(".add-form-text").value = "";
    })
    .catch((error) => {
      console.log("Ошибка при сохранении комментария:", error);
    });
});

window.onload = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  toggleForms(isLoggedIn);
  loadComments().then((comments) => {
    renderComments(comments);
  });
};
