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
            alert('New passwords do not match');
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