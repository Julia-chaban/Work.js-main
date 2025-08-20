import commentsData from "./commentsData.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleClick, handleLikeClick } from "./clickHand.js";
import { updateUI } from "./renderComments.js";

function fetchComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки комментариев (${response.status})`);
      }
      return response.json();
    })
    .then((data) => data.comments);
}

function loadComments() {
  fetchComments()
    .then((comments) => {
      console.log("Загруженные комментарии", comments);
      renderComments(comments);
    })
    .catch((error) => {
      console.error(error.message);
      alert("Не удалось загрузить комментарий");
      renderComments(commentsData);
    });
}
button.disabled = true;
button.textContent = "создание задачи...";
function saveNewComment(comment) {
  fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",

    body: JSON.stringify({ name: comment.name, text: comment.text }),
  })
    .then(() => {
      return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
        method: "GET",
      });

      // if (!response.ok) {
      //throw new Error(`Ошибка отправки комментария (${response.status})`);
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error);
      alert("Ошибка при отправке комментария");
      button.disabled = false;
      button.textContent = "Добавить";

      loadComments();
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
    liked: 0,
    liked: false,
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
