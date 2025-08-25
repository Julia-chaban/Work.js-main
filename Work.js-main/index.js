import { getComments, postComment } from "./api.js";
import { renderComments, refreshInterface } from "./renderComments.js";
import { handleLikeClick } from "./clickHand.js";
const demoComments = [
  {
    id: "demo-cmt1",
    name: "Глеб Фокин",
    text: "Это будет первый комментарий на этой странице!",
    likes: 3,
    isLiked: false,
    date: "12.02.22 12:18",
  },
  {
    id: "demo-cmt2",
    name: "Варвара Н.",
    text: "Мне нравится как оформлена эта страница! ❤️",
    likes: 75,
    isLiked: true,
    date: "13.02.22 19:22",
  },
];

function showGlobalLoader() {
  document.getElementById("global-loader").style.display = "block";
}

function hideGlobalLoader() {
  document.getElementById("global-loader").style.display = "none";
}

function loadComments() {
  showGlobalLoader();
  getComments()
    .then((comments) => {
      if (comments.length > 0) {
        renderComments(comments);
      } else {
        renderComments(demoComments);
      }
    })
    .catch((error) => {
      console.error("Ошибка при загрузке комментария", error);
      alert("Ошибка при загрузке комментария.Попробуйте еще раз.");
    })
    .finally(() => {
      hideGlobalLoader();
    });
}
setInterval(() => {
  const commentsContainer = document.querySelector(".comments");
  const firstComment = commentsContainer.firstElementChild;
  if (firstComment) {
    commentsContainer.removeChild(firstComment);
  }
}, 10 * 1000);

function saveNewComment(comment) {
  showGlobalLoader();
  postComment(comment)
    .then((result) => {
      if (result && Array.isArray(result.comments)) {
        renderComments(result.comments);
      } else {
        alert("Ошибка при отправке комментария.Попробуйте еще раз");
      }
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария", error);
      alert("Ошибка при отправке комментария.Попробуйте еще раз.");
    })
    .finally(() => {
      hideGlobalLoader();
    });
}

document.querySelector(".add-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector(".add-form-name").value.trim();
  const text = document.querySelector(".add-form-text").value.trim();

  if (!name || !text) {
    alert("Заполните поля.");
    return;
  }

  const newComment = {
    name: name,
    text: text,
    likes: 0,
    isLiked: false,
    date: new Date().toLocaleString(),
  };

  saveNewComment(newComment);
  document.querySelector(".add-form-name").value = "";
  document.querySelector(".add-form-text").value = "";
});

document.querySelectorAll(".like-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    const currentComments = [...document.querySelectorAll(".comment")].map(
      (el) => el.dataset.commentId
    );
    handleLikeClick(event, currentComments);
    refreshInterface(currentComments);
  });
});
window.onload = () => {
  loadComments();
};
