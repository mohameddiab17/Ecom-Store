const back = document.getElementById("back");
back.addEventListener("click", function () {
  history.back();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const secretKey = "mySecretKey";

  // 1. التحقق من بيانات الأدمن أولاً
  if (email === "admin@ecom.com" && password === "admin123") {
    const adminUser = {
      fullname: "Admin",
      email: email,
      accountType: "admin",
    };
    // بنخزن بيانات الأدمن في ال sessionStorage
    sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
    Swal.fire({
      title: "Admin login successful! Redirecting to dashboard...",
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/admin/admin.html";
      }
    });
    return; // بنوقف الكود هنا عشان منطبقش عليه منطق المستخدم العادي
  }

  // 2. دخول المستخدم العادي زي ما هوا
  const encryptedData = localStorage.getItem("users");

  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    const users = JSON.parse(decryptedData);

    const foundUser = users.find((user) => user.email === email);

    if (foundUser && foundUser.password === password) {
      sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      Swal.fire({
        title: "Login successful!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/index.html";
        }
      });
    } else {
      Swal.fire({
        title: "Invalid email or password!",
        icon: "error",
      });
    }
  } else {
    Swal.fire({
      title: "No account found. Please register first.",
      icon: "error",
    });
  }
});
