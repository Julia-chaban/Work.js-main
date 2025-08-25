export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки комментариев (${response.status})`);
      }
      return response.json();
    })
    .then((data) => data.comments)
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
      return [];
    });
}

export function postComment(comment) {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "POST",

    body: JSON.stringify(comment),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка при отправке комментария (${response.status})`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error.message);
      alert(error.message);
      return {};
    });
}
