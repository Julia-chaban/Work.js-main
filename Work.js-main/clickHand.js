import { refreshInterface } from "./renderComments.js";

export function handleLikeClick(event, comments) {
  const button = event.target;
  const index = button.dataset.commentIndex;

  if (typeof index === "string" && index >= 0 && index < comments.length) {
    const comment = comments[index];

    comment.isLiked = !comment.isLiked;

    if (comment.isLiked) {
      comment.likes++;
    } else {
      comment.likes--;
      if (comment.likes < 0) {
        comment.likes = 0;
      }
    }
    refreshInterface(comments);
  }
}
