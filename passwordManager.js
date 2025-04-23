function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

function updateUser(user) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(user));
}

function generateAndFill() {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pwd = "";
    for (let i = 0; i < 16; i++) {
        pwd += charset[Math.floor(Math.random() * charset.length)];
    }
    document.getElementById("password").value = pwd;
}

function clearInputs() {
    document.getElementById("site").value = "";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function promptMasterPassword() {
    const masterPassword = prompt("Enter your master password:");
    const encryptedMasterPassword = btoa(masterPassword); // Encrypt the entered master password

    const loggedInUser = getLoggedInUser();

    if (loggedInUser && encryptedMasterPassword === loggedInUser.password) {
        alert("Master password verified!");
        // Decrypt and display stored passwords
        showPasswords(loggedInUser.passwords.map(p => ({
            site: p.site,
            username: p.username,
            password: atob(p.password) // Decrypt the password
        })));
    } else {
        alert("Incorrect master password!");
    }
}

function showPasswords(passwords) {
    const list = document.getElementById("passwordList");
    list.innerHTML = "";
    passwords.forEach((entry, index) => {
        list.innerHTML += `
            <p><strong>${entry.site}</strong><br>
            Username: ${entry.username}<br>
            Password: ${entry.password}
            <button onclick="deletePassword(${index})">Delete</button></p><hr>
        `;
    });
}

function deletePassword(index) {
    const user = getLoggedInUser();
    user.passwords.splice(index, 1); // Remove the password at the specified index
    updateUser(user); // Update the user data in localStorage
    alert("Password deleted!");
    showPasswords(user.passwords.map(p => ({
        site: p.site,
        username: p.username,
        password: atob(p.password) // Decrypt the remaining passwords
    }))); // Show the remaining passwords
}

function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{12,}$/;
    return strongPasswordRegex.test(password);
}

function savePassword() {
    const user = getLoggedInUser();
    const site = document.getElementById("site").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!site || !username || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (!isStrongPassword(password)) {
        alert("Password must be at least 12 characters long and include numbers and special characters.");
        return;
    }
    // Check if the password is already used for another website
    const isDuplicatePassword = user.passwords.some(p => atob(p.password) === password);
    if (isDuplicatePassword) {
        alert("Warning: You are using the same password for multiple websites. It's recommended to use unique passwords for better security.");
        return;
    }
    const encryptedPassword = btoa(password); // Encrypt password
    user.passwords.push({ site, username, password: encryptedPassword });
    updateUser(user);
    alert("Saved!");
    clearInputs();
}