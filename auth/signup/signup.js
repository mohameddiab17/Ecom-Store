const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let accountType = document
      .getElementById("account-type")
      .value.toLowerCase();

    // ✅ Email validation with regex
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    if (!isValidEmail(email)) {
      Swal.fire({
        title: "Invalid email format!",
        text: "Please enter a valid email like example@domain.com",
        icon: "error",
      });
      return; // stop form submission
    }

    const existingUsersEncrypted = localStorage.getItem("users");
    let users = [];

    if (existingUsersEncrypted) {
      const bytes = CryptoJS.AES.decrypt(existingUsersEncrypted, "mySecretKey");
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      users = JSON.parse(decryptedData);
    }

    // Check if email already exists
    const isEmailTaken = users.some((user) => user.email === email);
    if (isEmailTaken) {
      Swal.fire({
        title: "This email is already registered!",
        icon: "error",
      });
      return;
    }

    // Add new user
    const newUser = { fullname, email, password, accountType };
    users.push(newUser);

    // Encrypt and save
    const updatedUsersEncrypted = CryptoJS.AES.encrypt(
      JSON.stringify(users),
      "mySecretKey"
    ).toString();
    localStorage.setItem("users", updatedUsersEncrypted);

    Swal.fire({
      title: "Account created successfully! You can now login.",
      icon: "success",
      confirmButtonText: `<i class="fa fa-thumbs-up"></i> Great!`,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/auth/signin/signin.html";
      }
    });
  });
