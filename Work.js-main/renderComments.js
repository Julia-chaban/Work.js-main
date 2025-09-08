import { handleLikeClick } from "./clickHand.js";

export function renderComments(comments) {
  const commentsList = document.querySelector(".comments");
  commentsList.innerHTML = "";

  if (!comments || comments.length === 0) {
    return;
  }
  comments.sort((a, b) => a.date.localeCompare(b.date));

  comments.forEach((comment, index) => {
    const template = `
     <li class="comment" data-comment-id="${comment.id}">
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

export function refreshInterface(comments) {
  renderComments(comments);
}
