document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').innerText = `Email: ${username}`;
    }

    document.getElementById('change-password-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match'); // alert if new passwords do not match
            return;
        }

        if (oldPassword === newPassword) {
            alert('Old and new passwords are the same, please try again'); // alert if old and new passwords are the same
            return;
        }

        // Password validation
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(newPassword)) {
            alert('Password must contain at least 8 characters, including one letter and one number'); // alert if password does not meet requirements
            return;
        }

        const response = await fetch('/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                oldPassword,
                newPassword
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Password changed successfully');
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    });
});