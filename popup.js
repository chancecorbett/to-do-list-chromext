document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const addButton = document.getElementById('add-task');
    const taskCategory = document.getElementById('task-category');
    const taskList = document.getElementById('task-list');

    function buildTaskList() {
        taskList.innerHTML = ''; // Clear existing tasks
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.forEach((task, index) => {
                addTaskToList(task, index);
            });
        });
    }

    function addTaskToList(task, index) {
        const li = document.createElement('li');
        li.className = 'task-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'task-checkbox';
        checkbox.onchange = function() {
            toggleTaskCompleted(index);
        };

        const text = document.createElement('span');
        text.textContent = task.text;
        if (task.completed) {
            text.style.textDecoration = 'line-through';
        }

        const categoryLabel = document.createElement('span');
        categoryLabel.textContent = task.category;
        categoryLabel.className = 'category-label';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'deleteBtn';
        deleteBtn.onclick = function() {
            deleteTask(index);
        };

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(categoryLabel);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const categoryValue = taskCategory.value;
        if (taskText) {
            chrome.storage.local.get(['tasks'], function(result) {
                const tasks = result.tasks || [];
                tasks.push({ text: taskText, completed: false, category: categoryValue });
                chrome.storage.local.set({ 'tasks': tasks }, function() {
                    buildTaskList();
                    taskInput.value = ''; // Clear the input field
                });
            });
        }
    }

    function toggleTaskCompleted(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks[index].completed = !tasks[index].completed;
            chrome.storage.local.set({ 'tasks': tasks }, buildTaskList);
        });
    }

    function deleteTask(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.splice(index, 1);
            chrome.storage.local.set({ 'tasks': tasks }, buildTaskList);
        });
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    buildTaskList();
});
