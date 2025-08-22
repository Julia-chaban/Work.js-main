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
        if (response.status === 500) {
          throw new Error("Сервер временно недоступен.Попробуйте позже.");
        } else {
          throw new Error(`Ошибка загрузки комментариев (${response.status})`);
        }
      }
      return response.json();
    })
    .then((data) => {
      if (data.comments) {
        throw new Error("Комментарии не найдены в ответе сервера");
      }
      return data.comments;
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
      return commentsData;
    })
    .finally(hideGlobalLoader);
}

function loadComments() {
  showGlobalLoader();
  getsComments().then((comments) => {
    renderComments(comments);
  });
}

function saveNewComment(comment) {
  const form = document.querySelector("add-form");
  showGlobalLoader();
  fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",

    body: JSON.stringify({
      name: comment.name,
      text: comment.text,
      forceError: true,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Произошла ошибка.Проверьте правильность ввода");
        } else if (response.status === 500) {
          throw new Error("На сервере произошла ошибка.Попробуйте позже");
        } else {
          throw new Error(
            `Ошибка при отправке комментария(${response.status})`
          );
        }
      }
      return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
        method: "GET",
      });
    })
    .then((updateResponse) => {
      if (!updateResponse.ok) {
        throw new Error(
          `Ошибка обновления комментариев(${updateResponse.status})`
        );
      }
      return updateResponse.json();
    })
    .then((updatedData) => {
      const comments = updatedData.comments;
      renderComments(comments);
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
    })
    .finally(hideGlobalLoader);
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

  saveNewComment(newComment).then(() => {});
});
function updatedHandleLikeClick(event, comments) {
  handleLikeClick(event, comments);
  refreshInterface(comments);
  window.handleLikeClick = updatedHandleLikeClick;
}

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
