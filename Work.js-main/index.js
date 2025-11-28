import { getComments, postComment, setAuthToken, apiLoginUser } from "./api.js";
import { renderComments } from "./renderComments.js";

let allComments = [];

function showGlobalLoader(text) {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.remove("hidden");
  if (text) {
    loadingScreen.querySelector("p").textContent = text;
  }
}

function hideGlobalLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  loadingScreen.classList.add("hidden");
}

function loadComments() {
  showGlobalLoader("Загрузка комментариев...");

  return getComments()
    .then((response) => {
      if (response?.comments && Array.isArray(response.comments)) {
        allComments = response.comments.map((comment) => ({
          ...comment,
          isLiked: comment.isLiked || false,
        }));
      } else {
        console.warn("Сервер не предоставил комментарии.");
      }
      renderComments(allComments);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке комментариев", error);
      alert("Ошибка при загрузке комментариев. Попробуйте еще раз.");
    });
}

function saveNewComment(comment) {
  showGlobalLoader("Отправка комментария...");

  return postComment(comment)
    .then(() => {
      return loadComments();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария", error);
      alert(
        error.message || "Ошибка при отправке комментария. Попробуйте еще раз."
      );
      throw error;
    });
}

function toggleForms(isLoggedIn) {
  const loginForm = document.getElementById("loginForm");
  const commentForm = document.querySelector(".add-form");

  if (isLoggedIn) {
    loginForm.classList.add("hidden");
    commentForm.classList.remove("hidden");
  } else {
    loginForm.classList.remove("hidden");
    commentForm.classList.add("hidden");
  }
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const login = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const passwordInput = document.getElementById("loginPassword");
  console.log("Отправляемые данные:", login, password);

  if (!login || !password) {
    alert("Заполните все поля для входа.");
    return;
  }

  showGlobalLoader("Авторизация...");

  apiLoginUser(login, password)
    .then((data) => {
      console.log("Успешная авторизация:", data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", data.user.token);

      toggleForms(true);
      alert("Авторизация успешна!");
      return loadComments();
    })
    .catch((error) => {
      console.error("Полная ошибка авторизации:", error);
      alert(error.message || "Ошибка авторизации. Попробуйте снова.");
      passwordInput.value = "";
    })
    .finally(() => {
      hideGlobalLoader();
    });
});

document.querySelector(".add-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("author").value.trim();
  const text = document.getElementById("comment").value.trim();

  if (!name || !text) {
    alert("Заполните все поля.");
    return;
  }

  if (text.length < 3) {
    alert("Комментарий должен содержать минимум 3 символа.");
    return;
  }

  const newComment = {
    name,
    text,
    likes: 0,
    isLiked: false,
    date: new Date().toLocaleString(),
  };

  saveNewComment(newComment)
    .then(() => {
      document.getElementById("author").value = "";
      document.getElementById("comment").value = "";
    })
    .catch((error) => {
      console.log("Ошибка при сохранении комментария:", error);
    })
    .finally(() => {
      hideGlobalLoader();
    });
});

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    setAuthToken(authToken);
  }
  toggleForms(isLoggedIn);

  if (isLoggedIn) {
    loadComments().finally(() => {
      hideGlobalLoader();
    });
  }
});
