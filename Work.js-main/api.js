let AUTH_TOKEN = "";

export function setAuthToken(token) {
  AUTH_TOKEN = token || "";
}

export function getAuthToken() {
  return AUTH_TOKEN;
}

export function getComments() {
  return fetch("https://wedev-api.sky.pro/api/v1/julia-chaban/comments", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
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
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
    body: JSON.stringify(comment),
  }).then((response) => {
    if (!response.ok) {
      let errorMessage = "";
      if (response.status === 400) {
        errorMessage = `Неверный запрос. Проверьте правильность введённых данных.`;
      } else if (response.status === 401) {
        errorMessage = "Не авторизованы. Необходимо войти в систему.";
      } else if (response.status === 500) {
        errorMessage = "Ошибка на стороне сервера. Попробуйте позднее.";
      } else {
        errorMessage = `Неизвестная ошибка (${response.status}). Попробуйте снова.`;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  });
}

export function apiLoginUser(login, password) {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    mode: "cors",
    headers: {},
    body: JSON.stringify({
      login: login,
      password: password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          if (errorData.error) {
            throw new Error(errorData.error);
          } else if (response.status === 400) {
            throw new Error("Неверный логин или пароль");
          } else if (response.status === 401) {
            throw new Error("Неверные учетные данные");
          } else if (response.status === 500) {
            throw new Error("Ошибка сервера. Попробуйте позже.");
          } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
          }
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.user && data.user.token) {
        setAuthToken(data.user.token);
        return data;
      } else {
        throw new Error("Токен не получен от сервера");
      }
    })
    .catch((error) => {
      console.error("Ошибка в apiLoginUser:", error);
      throw error;
    });
}
