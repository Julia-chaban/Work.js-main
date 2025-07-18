export const newComment = {
  userName,
  text,
  liked: false,
  likesCount: 0,
  createdAt: new Date().toLocaleString(),
};

commentsData.push(newComment);
renderComments(commentsData);
