document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('username', username);
        window.location.href = '/html/main.html';
    } else {
        document.getElementById('errorMessage').innerText = result.message;
    }
});