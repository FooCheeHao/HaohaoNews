// This script is used to fetch the user data from the server and display it on the admin page.
fetch('/data/users.json')
.then(response => response.json())
.then(data => {
    const userDataDiv = document.getElementById('user-data');
    let htmlContent = '';
    for (const [email, userInfo] of Object.entries(data)) {
        htmlContent += `<div>
                            <h2>${email}</h2>
                            
                            <div>
                                <h3>Feedbacks:</h3>
                                <ul>`;
        userInfo.feedbacks.forEach(feedback => {
            htmlContent += `<li>Rating: ${feedback.rating}, Feedback: ${feedback.feedback}</li>`;
        });
        htmlContent += `       </ul>
                            </div>
                            <button onclick="deleteFeedback('${email}')">Delete Feedback</button>
                            <button onclick="deleteUser('${email}')">Delete User</button>
                            <br>
                            <br>
                        </div>`;
    }
    userDataDiv.innerHTML = htmlContent;
});

// delete user feedback
function deleteFeedback(email, feedbackIndex) {
    fetch(`/delete-feedback?email=${email}&feedbackIndex=${feedbackIndex}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('Feedback deleted successfully');
                location.reload(); // Reload the page to update the feedback list
            } else {
                alert('Failed to delete feedback');
            }
        });
}

// delete user
function deleteUser(email) {
    fetch(`/delete-user?email=${email}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                alert('User deleted successfully');
                location.reload(); // Reload the page to update the user list
            } else {
                alert('Failed to delete user');
            }
        });
}