import commentsData from "./commentsData.js";
import { renderComments } from "./renderComments.js";
import { handleClick, handleLikeClick } from "./clickHand.js";

renderComments(commentsData);
async function loadComments() {
  try {
    const response = await fetch(
      "https://wedev-api.sky.pro/api/v1/julia-chaban/comments"
    );

    if (!response.ok) {
      throw new Error(`Ошибка загрузки комментариев (${response.status})`);
    }

    const data = await response.json();
    renderComments(data.comments);
  } catch (error) {
    console.error(error.message);
    alert("Не удалось загрузить комментарии");
  }
}
async function saveNewComment(name, text) {
  const newComment = {
    name,
    text,
    liked: false,
    likesCount: 0,
    createdAt: new Date().toLocaleString(),
  };
  try {
    const response = await fetch(
      "https://wedev-api.sky.pro/api/v1/julia-chaban/comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      }
    );
    if (!response.ok) {
      throw new Error(`Ошибка отправки комментария (${response.status})`);
    }
    alert("Комментарий успешно отправлен!");
    loadComments();
  } catch (error) {
    console.error(error.message);
    alert("Ошибка при отправке комментария");
  }
}

window.onload = async () => {
  await loadComments();
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
      alert("Заполните все поля.");
      return;
    }

    saveNewComment(name, text);

    document.querySelector(".add-form-name").value = "";
    document.querySelector(".add-form-text").value = "";
  });
};
