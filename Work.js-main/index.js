import commentsData from "./commentsData.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleClick, handleLikeClick } from "./clickHand.js";
import { updateUI } from "./renderComments.js";
window.onload = () => {
  loadComments();
};
function updatedHandleLikeClick(event, comments) {
  handleLikeClick(event, comments);
  refreshInterface(comments); // Получаем доступ к refreshInterface через импорт
}

// Присваиваем новую версию обработчику оконного события
window.handleLikeClick = updatedHandleLikeClick;

function loadComments() {
  fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки комментариев (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Загруженные комментарии", data.comments);

      renderComments(data.comments);
    })
    .catch((error) => {
      console.error(error.message);
      alert("Не удалось загрузить комментарий");
      renderComments(commentsData);
    });
}
function saveNewComment(comment) {
  fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",
    body: JSON.stringify({ name: comment.name, text: comment.text }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка отправки комментария (${response.status})`);
      }
      return response.json();
    })
    .then(() => {
      alert("Комментарий успешно отправлен");
      loadComments();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error);
      alert("Ошибка при отправке комментария");
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
  
  const newComment = {
    name,
    text,
    liked: false,
    like: false,
    date: new Date().toLocaleString(),
  };

  saveNewComment(newComment);

  document.querySelector(".add-form-name").value = "";
  document.querySelector(".add-form-text").value = "";
});
