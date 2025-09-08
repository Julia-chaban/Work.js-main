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
        allComments = demoComments;
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
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка при отправке комментария: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      loadComments();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error);
      alert("Ошибка при отправке комментария. Попробуйте еще раз.");
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

document.querySelector(".add-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const authorInput = document.querySelector(".add-form-name").value.trim();
  const textInput = document.querySelector(".add-form-text").value.trim();

  if (!authorInput || !textInput) {
    alert("Заполните поля.");
    return;
  }
  if (textInput.length < 3) {
    alert("Комментарий должен содержать минимум три символа.");
    return;
  }

  const newComment = {
    name: authorInput,
    text: textInput,
    likes: 0,
    isLiked: false,
    date: new Date().toLocaleString(),
  };

  saveNewComment(newComment);

  document.querySelector(".add-form-name").value = "";
  document.querySelector(".add-form-text").value = "";
});

document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const currentComments = [...document.querySelectorAll(".comment")].map(
      (el) => el.dataset.commentId
    );
    handleLikeClick(event, currentComments);
    refreshInterface(currentComments);
  });
});
window.onload = () => {
  loadComments();
};
const loginForm = document.querySelector(".login");
const addForm = document.querySelector(".add-form");

// Проверяем статус авторизации
if (localStorage.getItem("isLoggedIn") === "true") {
  // Если пользователь авторизован, прячем форму авторизации и показываем форму отправки комментария
  loginForm.classList.add("hidden");
  addForm.classList.remove("hidden");
} else {
  // Иначе показываем форму авторизации и скрываем форму отправки комментария
  loginForm.classList.remove("hidden");
  addForm.classList.add("hidden");
}

// Далее добавляем слушатель события submit на форму авторизации
document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Простая имитация успешной авторизации
  localStorage.setItem("isLoggedIn", true);

  // Скрываем форму авторизации и показываем форму отправки комментария
  loginForm.classList.add("hidden");
  addForm.classList.remove("hidden");
});
