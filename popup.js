document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('add-task');
    const taskInput = document.getElementById('new-task');
    const taskCategory = document.getElementById('task-category');
    const taskList = document.getElementById('task-list');

    function addTask() {
        const taskText = taskInput.value;
        const category = taskCategory.value;
        if (taskText) {
            chrome.storage.local.get(['tasks'], function(result) {
                const tasks = result.tasks || [];
                tasks.push({ text: taskText, completed: false, category: category });
                chrome.storage.local.set({ 'tasks': tasks }, function() {
                    buildTaskList();
                    taskInput.value = '';
                    taskCategory.selectedIndex = 0; // Reset category selection
                });
            });
        }
    }

    function addTaskToList(task, index) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
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

    function toggleTaskCompleted(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            let tasks = result.tasks || [];
            tasks[index].completed = !tasks[index].completed;
            chrome.storage.local.set({ 'tasks': tasks }, buildTaskList);
        });
    }

    function deleteTask(index) {
        chrome.storage.local.get(['tasks'], function(result) {
            let tasks = result.tasks || [];
            tasks.splice(index, 1);
            chrome.storage.local.set({ 'tasks': tasks }, buildTaskList);
        });
    }

    function buildTaskList() {
        taskList.innerHTML = '';
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.forEach(addTaskToList);
        });
    }

    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Keyboard shortcut event listener
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            taskInput.focus();
        }
    });

    buildTaskList();
});
