export function renderComments(comments) {
  const commentsList = document.querySelector(".comments");
  commentsList.innerHTML = "";

  comments.forEach((comment) => {
    const template = `
      <li class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.createdAt}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likesCount}</span>
            <button class="like-button ${
              comment.liked ? "active" : ""
            }" data-id="${comments.indexOf(comment)}"></button>
          </div>
        </div>
      </li>
    `;
    commentsList.insertAdjacentHTML("beforeend", template);
  });
}
