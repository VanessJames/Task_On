const rosterInput = document.querySelector(".roster-input");
const prioritySelect = document.querySelector(".priority-select");
const rosterButton = document.querySelector(".roster-button");
const rosterList = document.querySelector(".roster-list");
const filterOption = document.querySelector(".filter-roster");
const searchBar = document.querySelector(".search-bar");

document.addEventListener("DOMContentLoaded", () => {
    getLocalRosters();
    loadDarkMode();
});


document.querySelector(".roster-button").addEventListener("click", addRoster);
document.querySelector(".roster-list").addEventListener("click", deleteCheck);
document.querySelector(".filter-roster").addEventListener("change", filterRoster);
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);
searchBar.addEventListener("input", searchRosters);

let editFlag = false;
let editElement;

function addRoster(event) {
    event.preventDefault();
    const rosterInput = document.querySelector(".roster-input");
    const priority = prioritySelect.value;

    if (!editFlag) {
        // Adding a new task
        const rosterDiv = document.createElement("div");
        rosterDiv.classList.add("roster");

        const newRoster = document.createElement("li");
        newRoster.innerText = rosterInput.value; 
        newRoster.classList.add("roster-item");
        newRoster.dataset.task = rosterInput.value; // Store original task name
        rosterDiv.appendChild(newRoster);

        const priorityLabel = document.createElement("span");
        priorityLabel.innerText = priority;
        priorityLabel.classList.add("priority-level", `priority-${priority.toLowerCase()}`);
        rosterDiv.appendChild(priorityLabel);

        saveLocalRosters(rosterInput.value, priority); // Pass the priority here

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

        document.querySelector(".roster-list").appendChild(rosterDiv);
        rosterInput.value = "";
    } else {
        // Editing an existing task
        const originalTask = editElement.dataset.task; // Get the original task name
        editElement.innerText = rosterInput.value;
        editElement.dataset.task = rosterInput.value; // Update dataset with new task name
        editElement.nextSibling.innerText = priority;
        editElement.nextSibling.className = `priority-level priority-${priority.toLowerCase()}`;
        updateLocalRosters(originalTask, rosterInput.value, priority); // Pass the original and new task names
        editFlag = false;
        rosterInput.value = "";
    }
}



function deleteCheck(e) {
    const item = e.target;
    const rosterInput = document.querySelector(".roster-input");

    if (item.classList.contains("trash-btn")) {
        const roster = item.parentElement;
        roster.classList.add("slide");
        removeLocalRosters(roster);
        roster.addEventListener("transitionend", function() {
            roster.remove();
        });
    }

    if (item.classList.contains("complete-btn")) {
        const roster = item.parentElement;
        roster.classList.toggle("completed");
    }

    if (item.classList.contains("edit-btn")) {
        editFlag = true;
        editElement = item.parentElement.querySelector(".roster-item");
        rosterInput.value = editElement.innerText;
        prioritySelect.value = item.parentElement.querySelector(".priority-level").innerText;
    }
}

function filterRoster(e) {
    const rosters = rosterList.childNodes;
    rosters.forEach(function(roster) {
        switch(e.target.value) {
            case "all": 
                roster.style.display = "flex";
                break;
            case "completed": 
                if(roster.classList.contains("completed")) {
                    roster.style.display = "flex";
                } else {
                    roster.style.display = "none";
                }
                break;
            case "incomplete":
                if(!roster.classList.contains("completed")) {
                    roster.style.display = "flex";
                } else {
                    roster.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalRosters(task, priority) {
    if (task && priority) {
        let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
        // Check if the task already exists
        const existingTask = rosters.find(roster => roster.task === task);
        if (!existingTask) {
            rosters.push({ task, priority });
            localStorage.setItem("rosters", JSON.stringify(rosters));
        } else {
            console.warn("Task already exists:", task);
        }
    } else {
        console.error("Task or priority is missing", { task, priority });
    }
}


function getLocalRosters() {
    rosterList.innerHTML = ""; // Clear existing tasks to prevent duplicates
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    rosters.forEach(function (rosterObj) {
        if (rosterObj && typeof rosterObj.task === 'string' && typeof rosterObj.priority === 'string') {
            const rosterDiv = document.createElement("div");
            rosterDiv.classList.add("roster");

            const newRoster = document.createElement("li");
            newRoster.innerText = rosterObj.task;
            newRoster.classList.add("roster-item");
            newRoster.dataset.task = rosterObj.task; // Store original task name
            rosterDiv.appendChild(newRoster);

            const priorityLabel = document.createElement("span");
            priorityLabel.innerText = rosterObj.priority;
            priorityLabel.classList.add("priority-level", `priority-${rosterObj.priority.toLowerCase()}`);
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

            document.querySelector(".roster-list").appendChild(rosterDiv);
        } else {
            console.error("Invalid roster object:", rosterObj);
        }
    });
}




function removeLocalRosters(roster) {
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    const rosterIndex = roster.children[0].innerText;
    rosters = rosters.filter(roster => roster.task !== rosterIndex);
    localStorage.setItem("rosters", JSON.stringify(rosters));
}

function updateLocalRosters(originalTask, newTask, newPriority) {
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    rosters = rosters.map(roster => roster.task === originalTask ? { task: newTask, priority: newPriority } : roster);
    localStorage.setItem("rosters", JSON.stringify(rosters));
}




function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".roster-input").classList.toggle("dark-mode");
    document.querySelector(".roster-button").classList.toggle("dark-mode");
    document.querySelector(".filter-roster").classList.toggle("dark-mode");
    document.querySelector(".priority-select").classList.toggle("dark-mode");
    document.querySelector(".search-bar").classList.toggle("dark-mode");

    const rosters = document.querySelectorAll(".roster");
    rosters.forEach(roster => {
        roster.classList.toggle("dark-mode");
        roster.querySelector(".priority-level").classList.toggle("dark-mode");
    });

    saveDarkModePreference();
}

function loadDarkMode() {
    const darkModeEnabled = localStorage.getItem("dark-mode") === "true";
    if (darkModeEnabled) {
        document.body.classList.add("dark-mode");
        document.querySelector(".container").classList.add("dark-mode");
        document.querySelector(".roster-input").classList.add("dark-mode");
        document.querySelector(".roster-button").classList.add("dark-mode");
        document.querySelector(".filter-roster").classList.add("dark-mode");
        document.querySelector(".priority-select").classList.add("dark-mode");
        document.querySelector(".search-bar").classList.add("dark-mode");

        const rosters = document.querySelectorAll(".roster");
        rosters.forEach(roster => {
            roster.classList.add("dark-mode");
            roster.querySelector(".priority-level").classList.add("dark-mode");
        });
    }
}


function loadDarkMode() {
    const darkModeEnabled = localStorage.getItem("dark-mode") === "true";
    if (darkModeEnabled) {
        document.getElementById("dark-mode-toggle").checked = true;
        toggleDarkMode();  // This will add all necessary dark mode classes
    }
}

function saveDarkModePreference() {
    const darkModeEnabled = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", darkModeEnabled);
}

function searchRosters() {
    const searchTerm = searchBar.value.toLowerCase();
    const rosters = rosterList.childNodes;

    rosters.forEach(roster => {
        const rosterText = roster.querySelector(".roster-item").innerText.toLowerCase();
        if (rosterText.includes(searchTerm)) {
            roster.style.display = "flex";
        } else {
            roster.style.display = "none";
        }
    });
}
