document.addEventListener('DOMContentLoaded', function () {
    const addButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Load existing tasks
    chrome.storage.local.get(['tasks'], function(result) {
        const tasks = result.tasks || [];
        tasks.forEach(task => {
            addTaskToList(task);
        });
    });

    addButton.addEventListener('click', function() {
        const task = taskInput.value;
        if (task) {
            // Add to storage
            chrome.storage.local.get(['tasks'], function(result) {
                const tasks = result.tasks || [];
                tasks.push(task);
                chrome.storage.local.set({'tasks': tasks}, function() {
                    addTaskToList(task);
                    taskInput.value = ''; // Clear input box
                });
            });
        }
    });

function addTaskToList(task, index) {
    const li = document.createElement('li');
    li.textContent = task;

    // Create a delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function() {
        deleteTask(index);
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}
function deleteTask(index) {
    chrome.storage.local.get(['tasks'], function(result) {
        let tasks = result.tasks || [];
        tasks.splice(index, 1); // Remove the task
        chrome.storage.local.set({'tasks': tasks}, function() {
            buildTaskList(); // Rebuild the task list
        });
    });
}
function buildTaskList() {
    taskList.innerHTML = ''; // Clear existing tasks
    chrome.storage.local.get(['tasks'], function(result) {
        const tasks = result.tasks || [];
        tasks.forEach((task, index) => {
            addTaskToList(task, index);
        });
    });
}

// Call buildTaskList on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    buildTaskList();
    // Rest of the code...
});

