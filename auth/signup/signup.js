const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const accountType = document.getElementById("account-type");

// Regex patterns
const nameRegex = /^[A-Za-z\s]{3,}$/; // at least 3 letters
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

// ✅ Reusable validation function
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

// ✅ Attach real-time validation
fullname.addEventListener("change", () => validateField(fullname, nameRegex));
email.addEventListener("change", () => validateField(email, emailRegex));
password.addEventListener("change", () => validateField(password, passwordRegex));
accountType.addEventListener("change", () => {
  if (!accountType.value) {
    accountType.classList.add("is-invalid");
    accountType.classList.remove("is-valid");
  } else {
    accountType.classList.remove("is-invalid");
    accountType.classList.add("is-valid");
  }
});

// ✅ Submit handling
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid =
    validateField(fullname, nameRegex) &
    validateField(email, emailRegex) &
    validateField(password, passwordRegex);

  if (!accountType.value) {
    accountType.classList.add("is-invalid");
    isValid = false;
  }

  if (!isValid) {
    // 👉 Show error only when pressing Create Account
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: "Please fix the highlighted fields before submitting.",
    });
    return;
  }

  // ✅ If all valid → save user
  const existingUsersEncrypted = localStorage.getItem("users");
  let users = [];

  if (existingUsersEncrypted) {
    const bytes = CryptoJS.AES.decrypt(existingUsersEncrypted, "mySecretKey");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    users = JSON.parse(decryptedData);
  }

  // Check if email already exists
  const isEmailTaken = users.some((user) => user.email === email.value.trim());
  if (isEmailTaken) {
    email.classList.add("is-invalid");
    Swal.fire({
      icon: "error",
      title: "Email Already Registered",
      text: "Please use a different email address.",
    });
    return;
  }

  // Add new user
  const newUser = {
    fullname: fullname.value.trim(),
    email: email.value.trim(),
    password: password.value.trim(),
    accountType: accountType.value.toLowerCase(),
  };
  users.push(newUser);

  // Encrypt and save
  const updatedUsersEncrypted = CryptoJS.AES.encrypt(
    JSON.stringify(users),
    "mySecretKey"
  ).toString();
  localStorage.setItem("users", updatedUsersEncrypted);

  // ✅ Success with SweetAlert2
  Swal.fire({
    icon: "success",
    title: "Account Created!",
    text: "You can now log in.",
    confirmButtonText: `<i class="fa fa-thumbs-up"></i> Great!`,
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/auth/signin/signin.html";
    }
  });
});
