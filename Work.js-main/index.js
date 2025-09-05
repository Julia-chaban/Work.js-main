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
  loadingScreen.innerText = text || "Загрузка...";
}

function hideGlobalLoader() {
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.classList.add("hidden");
  }, 1000);
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

  allComments.unshift(comment);
  renderComments(allComments);

  postComment(comment)
    .then((response) => {
      if (response.result === "ok") {
        console.log("Комментарий успешно отправлен.");
      } else {
        console.error(
          "Ответ сервера не содержит информации",
          response.message || response.error || "Неизвестная ошибка."
        );
        alert("Ошибка при отправке комментария.Попробуйте еще раз.");
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария", error);
      alert("Ошибка при отправке комментария.Попробуйте еще раз.");
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

document.querySelector(".add-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector(".add-form-name").value.trim();
  const text = document.querySelector(".add-form-text").value.trim();

  if (!name || !text) {
    alert("Заполните поля.");
    return;
  }
  if (text.length < 3) {
    alert("Комментарий должен содержать минимум три символа.");
    return;
  }
  const newComment = {
    name: name,
    text: text,
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
