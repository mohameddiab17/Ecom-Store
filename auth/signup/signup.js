document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let accountType = document.getElementById("account-type").value.toLowerCase();

    const existingUsersEncrypted = localStorage.getItem("users");
    let users = []; // بنجهز قايمة فاضية

    if (existingUsersEncrypted) {
        // لو فيه مستخدمين متخزنين، هنفك تشفيرهم ونحولهم لـ array
        const bytes = CryptoJS.AES.decrypt(existingUsersEncrypted, "mySecretKey");
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        users = JSON.parse(decryptedData);
    }

    // 2. هنتأكد إن الإيميل ده مش متسجل قبل كده
    const isEmailTaken = users.some(user => user.email === email);
    if (isEmailTaken) {
        alert("This email is already registered!");
        return; // هنوقف العملية عشان الإيميل ميتكررش
    }

    // 3. هنضيف المستخدم الجديد للقائمة
    const newUser = { fullname, email, password, accountType };
    users.push(newUser);

    // 4.  local storage هنشفر القايمة المحدثة كلها ونخزنها تاني في ال
    const updatedUsersEncrypted = CryptoJS.AES.encrypt(JSON.stringify(users), "mySecretKey").toString();
    localStorage.setItem("users", updatedUsersEncrypted); // بنخزن في "users"

    alert("Account created successfully! You can now login.");
    window.location.href = "/auth/signin/signin.html";
});