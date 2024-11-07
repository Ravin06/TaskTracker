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
            tasks.forEach(task => addTaskToList(task));
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
        const task = inputField.value.trim();
        if (task === "") return;
        addTaskToList(task);
        saveTasksToCookie();
        inputField.value = "";
        updateEmptyMessage();
    }

    function addTaskToList(task) {
        const listItem = document.createElement("li");
        listItem.textContent = task;
        list.appendChild(listItem);
    }

    function saveTasksToCookie() {
        const tasks = Array.from(list.children).map(item => item.textContent);
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
