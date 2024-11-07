document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("item");
    const addButton = document.getElementById("btn");
    const list = document.getElementById("list");

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return "";
    }

    function loadTasks() {
        const savedTasks = getCookie("tasks");
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => addTaskToList(task.text, task.completed));
        }
    }

    function updateEmptyMessage() {
        if (list.children.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.id = "emptyMessage";
            emptyMessage.textContent = "No tasks added yet";
            list.parentNode.insertBefore(emptyMessage, list);
        } else {
            const existingMessage = document.getElementById("emptyMessage");
            if (existingMessage) {
                existingMessage.remove();
            }
        }
    }

    function addTask() {
        const taskText = inputField.value.trim();
        if (taskText === "") return;
        addTaskToList(taskText, false);
        saveTasksToCookie();
        inputField.value = "";
        updateEmptyMessage();
    }

    function addTaskToList(taskText, completed) {
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");
        // Checkbox for marking completion
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.classList.add("task-checkbox");
        checkbox.addEventListener("change", saveTasksToCookie);
        // Task text
        const taskContent = document.createElement("span");
        taskContent.textContent = taskText;
        taskContent.classList.add("task-text");
        if (completed) {
            taskContent.classList.add("completed");
        }
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "➖";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
            listItem.remove();
            saveTasksToCookie();
            updateEmptyMessage();

        });

        listItem.appendChild(checkbox);
        listItem.appendChild(taskContent);
        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
    }

    function saveTasksToCookie() {
        const tasks = Array.from(list.children).map(item => ({
            text: item.querySelector(".task-text").textContent,
            completed: item.querySelector(".task-checkbox").checked
        }));
        setCookie("tasks", JSON.stringify(tasks), 7); // Save for 7 days
    }

    loadTasks();
    updateEmptyMessage();

    addButton.addEventListener("click", addTask);

    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
});
