export function handleClick(event) {
  const commentEl = event.target.closest(`comment`);
  if (commentEl && !event.target.classList.contains("like-button")) {
    const author = commentEl.querySelector(
      ".comment-header div:nth-child(1)"
    ).textContent;
    const text = commentEl.querySelector(".comment-text").textContent;

    document.querySelector(".add-form-name").value = "";
    document.querySelector(".add-form-text").value =
      "@" + author + "\n> " + text;
  }
}
export function handleLikeClick(event, commentsData) {
  if (event.target.classList.contains("like-button")) {
    const likeButton = event.target;
    const commentId = Number(likeButton.dataset.id);

    const comment = commentsData[commentId];

    comment.liked = !comment.liked;

    if (comment.liked) {
      comment.likesCount++;
    } else {
      comment.likesCount--;
    }

    likeButton.classList.toggle("active");
    likeButton.previousElementSibling.textContent = comment.likesCount;
  }
}
