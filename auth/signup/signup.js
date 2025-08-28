document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let fullname = document.getElementById("fullname").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let accountType = document.getElementById("account-type").value.toLowerCase();

    const existingUsersEncrypted = localStorage.getItem("users");
    let users = [];

    if (existingUsersEncrypted) {
        const bytes = CryptoJS.AES.decrypt(existingUsersEncrypted, "mySecretKey");
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        users = JSON.parse(decryptedData);
    }

    let usersPublic = JSON.parse(localStorage.getItem("usersPublic")) || [];

    const isEmailTaken =
        users.some(user => user.email === email) ||
        usersPublic.some(user => user.email === email);

    if (isEmailTaken) {
        alert("This email is already registered!");
        return;
    }

    function generateId() {
        return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    }

    const newUser = { id: generateId(), fullname, email, password, accountType };
    const publicUser = { id: newUser.id, fullname, email, accountType };
    users.push(newUser);
    usersPublic.push(publicUser);

    const updatedUsersEncrypted = CryptoJS.AES.encrypt(
        JSON.stringify(users),
        "mySecretKey"
    ).toString();
    localStorage.setItem("users", updatedUsersEncrypted);

    localStorage.setItem("usersPublic", JSON.stringify(usersPublic));

    alert("Account created successfully! You can now login.");
    window.location.href = "/auth/signin/signin.html";
});
