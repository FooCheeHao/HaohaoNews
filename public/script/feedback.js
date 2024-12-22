document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').innerText = `Email: ${username}`;
    }

    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const rating = document.querySelector('input[name="rating"]:checked').value;
        const feedback = document.getElementById('feedback').value;

        fetch('/submit-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, rating, feedback })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});