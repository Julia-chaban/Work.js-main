import commentsData from "./commentsData.js";
import { renderComments } from "./renderCom.js";
import { handleClick, handleLikeClick } from "./clickHand.js";

renderComments(commentsData);
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
