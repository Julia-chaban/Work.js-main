
const loginForm = document.querySelector(".login");
const addForm = document.querySelector(".add-form");

if (localStorage.getItem("isLoggedIn") === "true") {
  loginForm.classList.add("hidden");
  addForm.classList.remove("hidden");
} else {
  loginForm.classList.remove("hidden");
  addForm.classList.add("hidden");
}

document.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  localStorage.setItem("isLoggedIn", true);

  loginForm.classList.add("hidden");
  addForm.classList.remove("hidden");
});
