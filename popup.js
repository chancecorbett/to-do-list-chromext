document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');

    // Function to rebuild the task list
    function buildTaskList() {
        taskList.innerHTML = ''; // Clear existing tasks
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.forEach((task, index) => {
                addTaskToList(task, index);
            });
        });
    }

    // Function to add a task to the list in the UI
    function addTaskToList(task, index) {
        const li = document.createElement('li');

        // Checkbox for completion status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = function() {
            toggleTaskCompleted(index);
        };

        // Task text
        const text = document.createElement('span');
        text.textContent = task.text;
        if (task.completed) {
            text.style.textDecoration = 'line-through';
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            deleteTask(index);
        };

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    // Function to toggle a task's completion status
    function toggleTaskCompleted(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            let tasks = result.tasks || [];
            tasks[index].completed = !tasks[index].completed;
            chrome.storage.local.set({'tasks': tasks}, function() {
                buildTaskList(); // Rebuild the task list to reflect changes
            });
        });
    }

    // Function to delete a task
    function deleteTask(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            let tasks = result.tasks || [];
            tasks.splice(index, 1); // Remove task at index
            chrome.storage.local.set({'tasks': tasks}, function() {
                buildTaskList(); // Rebuild the task list to reflect changes
            });
        });
    }

    // Event listener for adding a new task
    addButton.addEventListener('click', function() {
        const taskText = taskInput.value;
        if (taskText) {
            chrome.storage.local.get(['tasks'], function(result) {
                const tasks = result.tasks || [];
                tasks.push({text: taskText, completed: false}); // Add task as an object
                chrome.storage.local.set({'tasks': tasks}, function() {
                    buildTaskList(); // Rebuild the task list to include the new task
                    taskInput.value = ''; // Clear the input field
                });
            });
        }
    });

    buildTaskList(); // Initial build of the task list
});


