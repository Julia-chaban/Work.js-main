export function querySelector(comments) {
  document.querySelector(`.comments`).addEventListener("click", (event) => {
    const commentEl = event.target.closest(".comment");
    if (commentEl && !event.target.classList.contains("like-button")) {
      const author = commentEl.querySelector(
        ".comment-header div:nth-child(1)"
      ).textContent;
      const text = commentEl.querySelector(".comment-text").textContent;

      document.querySelector(".add-form-name").value = "";
      document.querySelector(".add-form-text").value =
        "@" + author + ":\n> " + text;
    }
  });
  document.querySelector(".comments").addEventListener("click", (event) => {
    if (event.target.classList.contains("like-button")) {
      const likeButton = event.target;
      const commentId = likeButton.dataset.id;
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
  });

  document.querySelector(".add-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector(".add-form-name").value.trim();
    const text = document.querySelector(".add-form-text").value.trim();

    if (!name || !text) {
      alert("Заполните поля.");
      return;
    }

    document.querySelector(".add-form-name").value = "";
    document.querySelector(".add-form-text").value = "";
  });
}
