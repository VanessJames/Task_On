document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const taskForm = document.getElementById('task-form');
    const rosterList = document.getElementById('roster-list');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const email = document.getElementById('register-email').value;
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await fetch('http://localhost:5000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, username, password })
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Response status:', response.status);
                console.log('Response data:', data);

                if (response.status === 201) {
                    alert('Registration successful!');
                } else {
                    alert('Registration error: ' + data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed: ' + error.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('http://localhost:5000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Response status:', response.status);
                console.log('Response data:', data);

                if (response.status === 200) {
                    localStorage.setItem('token', data.token);
                    console.log('Token set in localStorage:', data.token);
                    alert('Login successful!');
                    updateUI();
                } else {
                    console.log('Login error details:', data);
                    alert('Login error: ' + data.message);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
            }
        });
    }

    function updateUI() {
        const token = localStorage.getItem('token');
        const authSection = document.getElementById('auth-section');
        const taskSection = document.getElementById('task-section');

        if (token) {
            authSection.style.display = 'none';
            taskSection.style.display = 'block';
            loadTasks();
        } else {
            authSection.style.display = 'block';
            taskSection.style.display = 'none';
        }
    }

    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        console.log('Retrieved token from localStorage:', token);
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const response = await fetch(url, options);
        if (response.status === 401) {
            alert('Unauthorized. Please log in again.');
            localStorage.removeItem('token');
            updateUI();
        }
        return response;
    }

    async function loadTasks() {
        try {
            const response = await fetchWithAuth('http://localhost:5000/tasks');
            const tasks = await response.json();
            tasks.forEach(displayTask);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    if (taskForm) {
        taskForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const task = document.getElementById('task').value;
            const priority = document.getElementById('priority').value;

            try {
                const response = await fetchWithAuth('http://localhost:5000/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ task, priority })
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                console.log('Response status:', response.status);
                const data = await response.json();
                console.log('Response data:', data);

                if (response.status === 201) {
                    displayTask(data);
                    alert('Task created successfully!');
                } else {
                    alert('Task creation error: ' + data.message);
                }
            } catch (error) {
                console.error('Task creation error:', error);
                alert('Task creation failed: ' + error.message);
            }
        });
    }

    function displayTask(task) {
        const rosterDiv = document.createElement("div");
        rosterDiv.classList.add("roster");

        const newRoster = document.createElement("li");
        newRoster.innerText = task.task;
        newRoster.classList.add("roster-item");
        newRoster.dataset.task = task.task;
        rosterDiv.appendChild(newRoster);

        const priorityLabel = document.createElement("span");
        priorityLabel.innerText = task.priority;
        priorityLabel.classList.add("priority-level", `priority-${task.priority.toLowerCase()}`);
        rosterDiv.appendChild(priorityLabel);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        rosterDiv.appendChild(completedButton);

        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add("edit-btn");
        rosterDiv.appendChild(editButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></i>';
        trashButton.classList.add("trash-btn");
        rosterDiv.appendChild(trashButton);

        rosterList.appendChild(rosterDiv);
    }

    updateUI();
});
