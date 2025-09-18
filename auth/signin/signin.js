const back = document.getElementById("back");
back.addEventListener("click", () => history.back());

// Fields
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; 
// At least 6 chars, must include a letter + number, specials allowed

// Validation function
function validateField(input, regex) {
  if (!regex.test(input.value.trim())) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    return false;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  }
}

// Real-time validation
emailInput.addEventListener("change", () => validateField(emailInput, emailRegex));
passwordInput.addEventListener("change", () => validateField(passwordInput, passwordRegex));

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = validateField(emailInput, emailRegex) & validateField(passwordInput, passwordRegex);

  if (!isValid) {
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fix the highlighted fields before submitting.",
    });
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const secretKey = "mySecretKey";

  // ✅ Check admin
  if (email === "admin@ecom.com" && password === "admin123") {
    const adminUser = { fullname: "Admin", email, accountType: "admin" };
    sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
    Swal.fire({
      icon: "success",
      title: "Admin login successful!",
      text: "Redirecting to dashboard...",
    }).then((res) => {
      if (res.isConfirmed) window.location.href = "/admin/admin.html";
    });
    return;
  }

  // ✅ Normal users
  const encryptedData = localStorage.getItem("users");
  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const users = JSON.parse(decryptedData);

    const foundUser = users.find((user) => user.email === email);

    if (foundUser && foundUser.password === password) {
      sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      Swal.fire({
        icon: "success",
        title: "Login successful!",
      }).then((res) => {
        if (res.isConfirmed) window.location.href = "/index.html";
      });
    } else {
      passwordInput.classList.add("is-invalid");
      Swal.fire({
        icon: "error",
        title: "Invalid email or password!",
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "No account found",
      text: "Please register first.",
    });
  }
});
