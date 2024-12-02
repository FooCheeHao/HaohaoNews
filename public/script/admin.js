// This script is used to fetch the user data from the server and display it on the admin page.
        fetch('/data/users.json')
            .then(response => response.json())
            .then(data => {
                const userDataDiv = document.getElementById('user-data');
                let htmlContent = '';
                for (const [email, userInfo] of Object.entries(data)) {
                    htmlContent += `<div>
                                        <h2>${email}</h2>
                                        <button onclick="deleteUser('${email}')">Delete</button>
                                    </div>`;
                }
                userDataDiv.innerHTML = htmlContent;
            });

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