const rosterInput = document.querySelector(".roster-input");
const prioritySelect = document.querySelector(".priority-select");
const rosterButton = document.querySelector(".roster-button");
const rosterList = document.querySelector(".roster-list");
const filterOption = document.querySelector(".filter-roster");

document.addEventListener("DOMContentLoaded", () => {
    getLocalRosters();
    loadDarkMode();
});

document.addEventListener("DOMContentLoaded", getLocalRosters);
document.querySelector(".roster-button").addEventListener("click", addRoster);
document.querySelector(".roster-list").addEventListener("click", deleteCheck);
document.querySelector(".filter-roster").addEventListener("change", filterRoster);
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);

let editFlag = false;
let editElement;

function addRoster(event) {
    event.preventDefault();
    const rosterInput = document.querySelector(".roster-input");
    const priority = prioritySelect.value;

    if (!editFlag) {
        const rosterDiv = document.createElement("div");
        rosterDiv.classList.add("roster");


        const newRoster = document.createElement("li");
        newRoster.innerText = rosterInput.value; 
        newRoster.classList.add("roster-item");
        rosterDiv.appendChild(newRoster);

        const priorityLabel = document.createElement("span");
        priorityLabel.innerText = priority;
        priorityLabel.classList.add("priority-level", `priority-${priority.toLowerCase()}`);
        rosterDiv.appendChild(priorityLabel);

    //ADDING TO LOCAL STORAGE 
    saveLocalRosters(rosterInput.value);

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
    completedButton.classList.add("complete-btn");
    rosterDiv.appendChild(completedButton);

    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.classList.add("edit-btn");
    console.log("Edit button created:", editButton);
    rosterDiv.appendChild(editButton);


    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    rosterDiv.appendChild(trashButton);
    
    document.querySelector(".roster-list").appendChild(rosterDiv);
    rosterInput.value = "";
}
    else {
        editElement.innerText = rosterInput.value;
        editElement.nextSibling.innerText = priority;
        editElement.nextSibling.className = `priority-level priority-${priority.toLowerCase()}`;
        updateLocalRosters(editElement, priority);
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

function saveLocalRosters(roster) {
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    rosters.push(roster);
    localStorage.setItem("rosters", JSON.stringify(rosters));
}

function getLocalRosters() {
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    rosters.forEach(function (roster) {
        const rosterDiv = document.createElement("div");
        rosterDiv.classList.add("roster");

        const newRoster = document.createElement("li");
        newRoster.innerText = roster;
        newRoster.classList.add("roster-item");
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
    });
}

function removeLocalRosters(roster) {
    let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
    const rosterIndex = roster.children[0].innerText;
    rosters.splice(rosters.indexOf(rosterIndex), 1);
    localStorage.setItem("rosters", JSON.stringify(rosters));
    }

    function updateLocalRosters(editElement, newPriority) {
        let rosters = localStorage.getItem("rosters") ? JSON.parse(localStorage.getItem("rosters")) : [];
        const oldRoster = editElement.innerText;
        rosters = rosters.map(r => r.task === oldRoster ? { task: oldRoster, priority: newPriority } : r);
        localStorage.setItem("rosters", JSON.stringify(rosters));
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        document.querySelector(".container").classList.toggle("dark-mode");
        document.querySelector(".roster-input").classList.toggle("dark-mode");
        document.querySelector(".roster-button").classList.toggle("dark-mode");
        document.querySelector(".filter-roster").classList.toggle("dark-mode");
        document.querySelector(".priority-select").classList.toggle("dark-mode");
    
        const rosters = document.querySelectorAll(".roster");
        rosters.forEach(roster => {
            roster.classList.toggle("dark-mode");
            roster.querySelector(".priority-level").classList.toggle("dark-mode");
        });
    
        saveDarkModePreference();
    }
    
    function saveDarkModePreference() {
        const darkModeEnabled = document.body.classList.contains("dark-mode");
        localStorage.setItem("dark-mode", darkModeEnabled);
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
    
            const rosters = document.querySelectorAll(".roster");
            rosters.forEach(roster => {
                roster.classList.add("dark-mode");
                roster.querySelector(".priority-level").classList.add("dark-mode");
            });
        }
    }