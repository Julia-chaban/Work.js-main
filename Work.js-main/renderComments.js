import { handleLikeClick } from "./clickHand.js";
export function renderComments(comments) {
  const commentsList = document.querySelector(".comments");
  commentsList.innerHTML = "";

  comments.forEach((comment, index) => {
    const template = `
<li class="comment">
<div class="comment-header">
<div>${comment.author.name}</div>
<div>${new Date(comment.date).toLocaleString()}</div>
</div>
<div class="comment-body">
<div class="comment-text">${comment.text}</div>
</div>
<div class="comment-footer">
<div class="likes">
<span class="likes-counter">${comment.likes}</span>
<button class="like-button ${
      comment.isLiked ? "active" : ""
    }" data-comment-index="${index}"></button>
  </div>
 </div>
 </li>
 `;
    commentsList.insertAdjacentHTML("beforeend", template);

    const likeBtn = commentsList.lastElementChild.querySelector(".like-button");
    if (likeBtn) {
      likeBtn.addEventListener("click", (e) => handleLikeClick(e, comments));
    }
  });
}
export function updateUI(comments) {
  comments.forEach((comment, i) => {
    const btn = document.querySelector(
      `.like-button[data-comment-index='${i}']`
    );
    if (btn) {
      const count = btn.previousElementSibling;
      if (count) {
        count.textContent = `${comment.likes}`;
      }
    }
  });
}

// Перемещаем функцию refreshInterface сюда
export function refreshInterface(comments) {
  updateUI(comments); // Обновляем UI после любого изменения
}
