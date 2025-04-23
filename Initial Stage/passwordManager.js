
        // Helper function to get the current logged in user
        function getLoggedInUser() {
            return JSON.parse(localStorage.getItem('loggedInUser'));
        }

        // Function to show the form section (Sign Up, Login, Password Management, Password Page)
        function showSection(section) {
            const sections = ['signupSection', 'loginSection', 'passwordSection', 'passwordPageSection'];
            sections.forEach(s => document.getElementById(s).style.display = 'none');
            document.getElementById(section).style.display = 'block';
        }

        // Function to check if user is logged in
        function checkLoginStatus() {
            const loggedInUser = getLoggedInUser();
            if (loggedInUser) {
                showSection('passwordSection');// Display saved passwords after login
            } else {
                showSection('loginSection');
            }
        }

        // Display saved passwords for logged-in user
        function displaySavedPasswords() {
            const loggedInUser = getLoggedInUser();
            const passwordList = document.getElementById('passwordList');
            passwordList.innerHTML = '';

            if (loggedInUser && loggedInUser.passwords && loggedInUser.passwords.length > 0) {
                loggedInUser.passwords.forEach((item, index) => {
                    passwordList.innerHTML += `
                        <div class="password-item">
                            <p><strong>${item.siteName}:</strong> ${item.password}</p>
                            <button class="delete-btn" onclick="deletePassword(${index})">Delete</button>
                        </div>
                    `;
                });
            } else {
                passwordList.innerHTML = '<p>No passwords saved yet.</p>';
            }
        }

        // Delete a password
       // Delete a password
function deletePassword(index) {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
        // Remove password from the logged-in user's password list
        loggedInUser.passwords.splice(index, 1);

        // Save updated user data to localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === loggedInUser.email);
        if (userIndex !== -1) {
            users[userIndex] = loggedInUser;  // Update the user's data in the users list
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Update loggedInUser
        }

        // Show confirmation and refresh the password list
        alert('Password deleted successfully!');
        displaySavedPasswords();  // Immediately update the password list on the page
    }
}


        // Handle Sign Up
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.email === email)) {
                alert("Email already exists! Please log in.");
                showSection('loginSection');
                return;
            }

            // Create new user and store in localStorage
            users.push({ email, password, passwords: [] });
            localStorage.setItem('users', JSON.stringify(users));

            alert("Account created successfully! Please log in.");
            showSection('loginSection');
        });

        // Handle Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));  // Store logged-in user
                showSection('passwordSection'); // Show saved passwords immediately after login
            } else {
                alert("Invalid login credentials!");
            }
        });

        // Handle saving passwords
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const siteName = document.getElementById('siteName').value;
            const password = document.getElementById('password').value;
            const loggedInUser = getLoggedInUser();

            if (loggedInUser) {
                // Add password to the logged-in user's password list
                loggedInUser.passwords.push({ siteName, password });

                // Save updated user data to localStorage
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(user => user.email === loggedInUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = loggedInUser;  // Update the user's data in the users list
                    localStorage.setItem('users', JSON.stringify(users));
                    localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser)); // Update loggedInUser
                }

                alert('Password saved successfully!'); // Immediately update the password list on the page
            }
        });

        // Log out functionality
        document.getElementById('logoutButton').addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            alert("Logged out successfully!");
            showSection('loginSection');
        });

        // Show Password Page when clicking 'Go to Password Page'
        document.getElementById('goToPasswordPage').addEventListener('click', function() {
            showSection('passwordPageSection');
        });

        // Handle submitting the master password on the password page
        document.getElementById('passwordPageForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const masterPassword = document.getElementById('masterPassword').value;
            const loggedInUser = getLoggedInUser();

            if (masterPassword === loggedInUser.password) {
                displaySavedPasswords();  // Display saved passwords on success
            } else {
                alert("Incorrect Master Password!");
            }
        });

        // Show Login page when clicking 'Login here' button
        document.getElementById('showLoginBtn').addEventListener('click', function() {
            showSection('loginSection');
        });

        // Show Sign Up page when clicking 'Sign up here' button
        document.getElementById('showSignupBtn').addEventListener('click', function() {
            showSection('signupSection');
        });

        // Initial check for logged-in user
        checkLoginStatus();