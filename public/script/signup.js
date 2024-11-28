document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
        document.getElementById('errorMessage').innerText = 'Email is not valid';
        return;
    }

    // Password validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
        document.getElementById('errorMessage').innerText = 'Password must contain at least 8 characters, including one letter and one number';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('errorMessage').innerText = 'Passwords do not match';
        return;
    }

    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert(result.message);
        window.location.href = '/html/login.html';
    } else {
        document.getElementById('errorMessage').innerText = result.message;
    }
});