let AUTH_TOKEN = "";

export function setAuthToken(token) {
  AUTH_TOKEN = token || "";
}

export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
    Authorization: `Bearer ${AUTH_TOKEN}`,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке комментариев: ${response.status}`);
    }
    return response.json();
  });
}

export function postComment(comment) {
  const headers = {};
  if (AUTH_TOKEN) headers["Authorization"] = AUTH_TOKEN;

  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments ", {
    method: "POST",
    headers,
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
          errorMessage = "Доступ запрещён. Возможно, истёк срок сессии.";
        } else if (response.status === 404) {
          errorMessage = "Ресурс не найден. Обратитесь к администратору.";
        } else if (response.status === 500) {
          errorMessage = "Ошибка на стороне сервера. Попробуйте позднее.";
        } else {
          errorMessage = `Неизвестная ошибка (${response.status}). Попробуйте снова.`;
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
