export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке комментариев: ${response.status}`);
    }
    return response.json();
  });
}
export function postComment(comment) {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",

    body: JSON.stringify(comment),
  })
    .then((response) => {
      if (!response.ok) {
        let errorMessage = "";

        if (response.status === 400) {
          errorMessage =
            "Неверный запрос. Проверьте правильность введённых данных.";
        } else if (response.status === 401) {
          errorMessage = "Не авторизованы. Необходимо войти в систему.";
        } else if (response.status === 403) {
          errorMessage = "Доступ запрещён. Возможно, истек срок сессии.";
        } else if (response.status === 404) {
          errorMessage = "Ресурс не найден. Обратитесь к администратору.";
        } else if (response.status === 500) {
          errorMessage =
            "Ошибка на стороне сервера. Попробуйте повторить действие позднее.";
        } else {
          errorMessage = `Произошла неизвестная ошибка (${response.status}). Попробуйте повторно.`;
        }

        alert(errorMessage);
        throw new Error(errorMessage);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error.message);
      alert("Возникла ошибка при отправке комментария. Попробуйте снова.");
      throw error;
    });
}
