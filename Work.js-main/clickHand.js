export function handleClick(event) {
  const commentEl = event.target.closest(`comment`);
  if (commentEl && !event.target.classList.contains("like-button")) {
    const author = commentEl.querySelector(
      ".comment-header div:nth-child(1)"
    ).textContent;
    const text = commentEl.querySelector(".comment-text").textContent;

    document.querySelector(".add-form-name").value = "";

    document.querySelector(".add-form-text").value = `@ ${author} \n > ${text}`;
  }
}
export function handleLikeClick(event, comments) {
  if (event.target.classList.contains("like-button")) {
    const button = event.target;
    const commentIndex = parseInt(button.dataset.commentIndex);

    if (
      typeof commentIndex === "number" &&
      commentIndex >= 0 &&
      commentIndex < comments.length
    ) {
      const comment = comments[commentIndex];

      comment.isLiked = !comment.isLiked;

      if (comment.isLiked) {
        comment.likes++;
      } else {
        comment.likes--;
        if (comment.likes < 0) {
          comment.likes = 0;
        }
      }
      const counter = button.parentNode.querySelector(".likes-counter");
      if (counter) {
        counter.textContent = comment.likes.toString();
      }
      button.classList.toggle("active");
    } else {
      console.warn("Недопустимый индекс комментария!");
    }
  }
}
