document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const secretKey = "mySecretKey";

    // 1. التحقق من بيانات الأدمن أولاً
    if (email === "admin@ecom.com" && password === "admin123") {
        const adminUser = {
            fullname: 'Admin',
            email: email,
            accountType: 'admin'
        };
        // بنخزن بيانات الأدمن في ال sessionStorage
        sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
        alert("Admin login successful! Redirecting to dashboard...");
        window.location.href = "/admin/admin.html"; // بنوديه لصفحة الأدمن على طول
        return; // بنوقف الكود هنا عشان منطبقش عليه منطق المستخدم العادي
    }

    // 2. دخول المستخدم العادي زي ما هوا
    const encryptedData = localStorage.getItem("users");

    if (encryptedData) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        const users = JSON.parse(decryptedData);

        const foundUser = users.find(user => user.email === email);

        if (foundUser && foundUser.password === password) {
            sessionStorage.setItem("loggedInUser", JSON.stringify(foundUser));
            alert("Login successful!");
            window.location.href = "/index.html";
        } else {
            alert("Invalid email or password!");
        }
    } else {
        alert("No account found. Please register first.");
    }
});