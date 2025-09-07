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
        let message = "";

        switch (response.status) {
          case 400:
            message = "Некорректный запрос. Проверьте введенные данные.";
            break;

          case 500:
            message = "Ошибка на сервере. Повторите попытку позже.";
            break;

          default:
            message = `Произошла ошибка при отправке комментария (${response.status})`;
        }

        alert(message);
        throw new Error(message);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Ошибка при отправке комментария:", error);
      alert("Ошибка при отправке комментария. Попробуйте снова.");
      throw error;
    });
}
