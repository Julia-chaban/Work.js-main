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
  }).then((response) => {
    if (!response.ok) {
      if (response.status === 400) {
        alert("Некорректный запрос. Проверьте введённые данные.");
      } else if (response.status === 500) {
        alert("Ошибка на сервере. Попробуйте повторить попытку позднее.");
      } else {
        alert(`Произошла ошибка при отправке комментария:${response.status}`);
      }
      throw new Error(`Ошибка при отправке комментария:${response.status}`);
    }
    return response.json();
  });
}
