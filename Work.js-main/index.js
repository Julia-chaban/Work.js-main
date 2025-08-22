import commentsData from "./commentsData.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleClick, handleLikeClick } from "./clickHand.js";
import { updateUI } from "./renderComments.js";

function showGlobalLoader() {
  document.getElementById("global-loader").style.display = "block";
}

function hideGlobalLoader() {
  document.getElementById("global-loader").style.display = "none";
}

function getsComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки комментариев (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.comments) {
        throw new Error("Комментарии не найдены в ответе сервера");
      }
      return data.comments;
    });
}

function loadComments() {
  showGlobalLoader();
  getsComments()
    .then((comments) => {
      console.log("Загруженные комментарии", comments);
      if (Array.isArray(comments) && comments.length === 0) {
        comments = commentsData;
        console.warn("Нет комментариев с сервера, используем резервные данные");
      }
      renderComments(comments);
      hideGlobalLoader();
    })
    .catch((error) => {
      console.error(error.message);
      alert("Не удалось загрузить комментарий");
      renderComments(commentsData);
      hideGlobalLoader();
    });
}

function saveNewComment(comment) {
  const form = document.querySelector("add-form");
  showGlobalLoader();
  fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",

    body: JSON.stringify({ name: comment.name, text: comment.text }),
  })
    .then(() => {
      return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
        method: "GET",
      });
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const comments = data.comments;
      console.log("Обновленные комментарии", comments);
      renderComments(comments);
      hideGlobalLoader();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error);
      alert("Ошибка при отправке комментария");
      hideGlobalLoader();
    });
}

function updatedHandleLikeClick(event, comments) {
  handleLikeClick(event, comments);
  refreshInterface(comments);
  window.handleLikeClick = updatedHandleLikeClick;
}

document.querySelector(".add-form").addEventListener("submit", (event) => {
  event.preventDefault();

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

document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const currentComments = [...document.querySelectorAll(".comment")].map(
      (el) => el.dataset.commentId
    );
    updatedHandleLikeClick(event, currentComments);
  });
});

window.onload = () => {
  loadComments();
};
