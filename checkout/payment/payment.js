const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
});
