// Select DOM Elements
const rosterInput = document.querySelector(".roster-input");
const prioritySelect = document.querySelector(".priority-select");
const rosterButton = document.querySelector(".roster-button");
const rosterList = document.querySelector(".roster-list");
const filterOption = document.querySelector(".filter-roster");
const searchBar = document.querySelector(".search-bar");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    getLocalRosters();
    loadDarkMode();
});

rosterButton.addEventListener("click", addRoster);
rosterList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterRoster);
darkModeToggle.addEventListener("change", toggleDarkMode);
searchBar.addEventListener("input", searchRosters);

// Global variables
let editFlag = false;
let editElement;

// Functions
function addRoster(event) {
    event.preventDefault();
    const task = rosterInput.value.trim();
    const priority = prioritySelect.value;

    if (task === "") {
        alert("Task cannot be empty");
        return;
    }

    if (!editFlag) {
        // Adding a new task
        createRosterElement(task, priority);
        saveLocalRosters(task, priority);
    } else {
        // Editing an existing task
        const originalTask = editElement.dataset.task;
        editElement.innerText = task;
        editElement.dataset.task = task;
        editElement.nextSibling.innerText = priority;
        editElement.nextSibling.className = `priority-level priority-${priority.toLowerCase()}`;
        updateLocalRosters(originalTask, task, priority);
        editFlag = false;
    }
    rosterInput.value = "";
}

function deleteCheck(event) {
    const item = event.target;
    const roster = item.parentElement;

    if (item.classList.contains("trash-btn")) {
        roster.classList.add("slide");
        removeLocalRosters(roster);
        roster.addEventListener("transitionend", () => roster.remove());
    } else if (item.classList.contains("complete-btn")) {
        roster.classList.toggle("completed");
    } else if (item.classList.contains("edit-btn")) {
        editFlag = true;
        editElement = roster.querySelector(".roster-item");
        rosterInput.value = editElement.innerText;
        prioritySelect.value = roster.querySelector(".priority-level").innerText;
    }
}

function filterRoster(event) {
    const filter = event.target.value;
    const rosters = Array.from(rosterList.children);
    rosters.forEach(roster => {
        switch (filter) {
            case "all":
                roster.style.display = "flex";
                break;
            case "completed":
                roster.style.display = roster.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                roster.style.display = roster.classList.contains("completed") ? "none" : "flex";
                break;
        }
    });
}

function saveLocalRosters(task, priority) {
    let rosters = JSON.parse(localStorage.getItem("rosters")) || [];
    if (!rosters.some(roster => roster.task === task)) {
        rosters.push({ task, priority });
        localStorage.setItem("rosters", JSON.stringify(rosters));
    } else {
        console.warn("Task already exists:", task);
    }
}

function getLocalRosters() {
    rosterList.innerHTML = ""; // Clear existing tasks to prevent duplicates
    const rosters = JSON.parse(localStorage.getItem("rosters")) || [];
    rosters.forEach(({ task, priority }) => createRosterElement(task, priority));
}

function removeLocalRosters(roster) {
    let rosters = JSON.parse(localStorage.getItem("rosters")) || [];
    const task = roster.querySelector(".roster-item").innerText;
    rosters = rosters.filter(roster => roster.task !== task);
    localStorage.setItem("rosters", JSON.stringify(rosters));
}

function updateLocalRosters(originalTask, newTask, newPriority) {
    let rosters = JSON.parse(localStorage.getItem("rosters")) || [];
    rosters = rosters.map(roster => roster.task === originalTask ? { task: newTask, priority: newPriority } : roster);
    localStorage.setItem("rosters", JSON.stringify(rosters));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    saveDarkModePreference();
}

function loadDarkMode() {
    const darkModeEnabled = localStorage.getItem("dark-mode") === "true";
    if (darkModeEnabled) {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }
}

function saveDarkModePreference() {
    const darkModeEnabled = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", darkModeEnabled);
}

function searchRosters() {
    const searchTerm = searchBar.value.toLowerCase();
    const rosters = Array.from(rosterList.children);
    rosters.forEach(roster => {
        const task = roster.querySelector(".roster-item").innerText.toLowerCase();
        roster.style.display = task.includes(searchTerm) ? "flex" : "none";
    });
}

function createRosterElement(task, priority) {
    const rosterDiv = document.createElement("div");
    rosterDiv.classList.add("roster");

    const newRoster = document.createElement("li");
    newRoster.innerText = task;
    newRoster.classList.add("roster-item");
    newRoster.dataset.task = task;
    rosterDiv.appendChild(newRoster);

    const priorityLabel = document.createElement("span");
    priorityLabel.innerText = priority;
    priorityLabel.classList.add("priority-level", `priority-${priority.toLowerCase()}`);
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
