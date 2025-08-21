document.addEventListener("DOMContentLoaded", () => {
    // --- 1. ELEMENT SELECTION ---
    const profileForm = document.getElementById("profileForm");
    const fullnameInput = document.getElementById("profileFullname");
    const emailInput = document.getElementById("profileEmail");
    const passwordInput = document.getElementById("profilePassword");
    const accountTypeInput = document.getElementById("profileAccountType");
    const updateBtn = document.getElementById("updateBtn");
    
    // Sidebar elements
    const profileInitialsEl = document.getElementById("profile-initials"); // <-- العنصر الجديد بتاع الحروف
    const sidebarName = document.getElementById("profile-sidebar-name");
    const sidebarEmail = document.getElementById("profile-sidebar-email");
    const logoutSidebarBtn = document.getElementById("logoutBtn-sidebar");

    const secretKey = "mySecretKey";

    // --- 2. LOAD USER DATA ON PAGE LOAD ---
    function loadUserData() {
        const loggedInUserJSON = sessionStorage.getItem("loggedInUser");

        if (!loggedInUserJSON) {
            alert("You must be logged in to view this page.");
            window.location.href = "/auth/signin/signin.html";
            return;
        }

        const user = JSON.parse(loggedInUserJSON);

        // Populate the form
        fullnameInput.value = user.fullname;
        emailInput.value = user.email;
        accountTypeInput.value = user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1);

        // Populate the sidebar
        sidebarName.textContent = user.fullname;
        sidebarEmail.textContent = user.email;

        // ## التعديل هنا: حساب وعرض الحروف الأولى ##
        if (user.fullname) {
            const nameParts = user.fullname.split(' ');
            const initials = nameParts.map(part => part[0]).join('').toUpperCase();
            profileInitialsEl.textContent = initials;
        }
    }

    // --- 3. HANDLE PROFILE UPDATE ---
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault(); // <-- بنمنع الفورم من إنه يعمل submit

        // بنضيف كلاس بوتستراب عشان يظهر رسائل الخطأ
        profileForm.classList.add('was-validated');

        // بنتأكد إن الفورم سليم قبل ما نكمل
        if (!profileForm.checkValidity()) {
            return; // لو الفورم مش سليم، بنوقف كل حاجة
        }

        // لو الفورم سليم، بنكمل عملية التحديث
        updateBtn.disabled = true;
        updateBtn.querySelector('.spinner-border').classList.remove('d-none');

        const usersEncrypted = localStorage.getItem("users");
        if (!usersEncrypted) {
            alert("Error: User database not found.");
            updateBtn.disabled = false;
            updateBtn.querySelector('.spinner-border').classList.add('d-none');
            return;
        }

        const bytes = CryptoJS.AES.decrypt(usersEncrypted, secretKey);
        const decryptedUsers = bytes.toString(CryptoJS.enc.Utf8);
        let users = JSON.parse(decryptedUsers);

        const currentUserEmail = emailInput.value;
        const userIndex = users.findIndex(u => u.email === currentUserEmail);

        if (userIndex === -1) {
            alert("Error: Could not find your profile to update.");
            updateBtn.disabled = false;
            updateBtn.querySelector('.spinner-border').classList.add('d-none');
            return;
        }

        users[userIndex].fullname = fullnameInput.value;
        if (passwordInput.value) {
            users[userIndex].password = passwordInput.value;
        }

        const updatedUsersEncrypted = CryptoJS.AES.encrypt(JSON.stringify(users), secretKey).toString();
        localStorage.setItem("users", updatedUsersEncrypted);
        sessionStorage.setItem("loggedInUser", JSON.stringify(users[userIndex]));

        setTimeout(() => {
            updateBtn.disabled = false;
            updateBtn.querySelector('.spinner-border').classList.add('d-none');
            alert("Profile updated successfully!");
            loadUserData(); // بنعيد تحميل كل البيانات عشان الحروف تتحدث
        }, 1000);
    });

    // --- 4. HANDLE LOGOUT ---
    function logout() {
        sessionStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "/auth/signin/signin.html";
    }

    logoutSidebarBtn.addEventListener("click", logout);

    // --- 5. INITIALIZE THE PAGE ---
    loadUserData();
});