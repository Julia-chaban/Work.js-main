import commentsData from "./commentsData.js";
import { renderComments } from "./renderComments.js";
import { handleClick, handleLikeClick } from "./clickHand.js";
renderComments(commentsData);

async function loadComments() {
  fetch("https://wedev-api.sky.pro/api/v1/:julia-chaban/comments", {
    method: "GET",
  })
    .then((response) => {
      response.json();
    })
    .then((data) => {
      renderComments(commentsData);
    });
}

async function sendNewComment(name, text) {
  const newComment = {
    name,
    text,
    liked: false,
    likesCount: 0,
    createdAt: new Date().toISOString(),
  };

  fetch("https://wedev-api.sky.pro/api/v1/:julia-chaban/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: newComment }),
  });

  if (response.ok) {
    alert("Комментарий успешно отправлен!");
    loadComments();
    alert("Ошибка при отправке комментария");
  }
}
window.onload = () => {
  loadComments();

  document.querySelector(".comments").addEventListener("click", (event) => {
    handleClick(event);
  });

  document.querySelector(".comments").addEventListener("click", (event) => {
    handleLikeClick(event, commentsData);
  });

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
      likesCount: 0,
      createdAt: new Date().toLocaleString(),
    };

    commentsData.push(newComment);
    renderComments(commentsData);

    document.querySelector(".add-form-name").value = "";
    document.querySelector(".add-form-text").value = "";
  });
};
