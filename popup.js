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

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.textContent = task;
        taskList.appendChild(li);
    }
});
