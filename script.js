document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task");
  const newTaskInput = document.getElementById("new-task");
  const taskList = document.getElementById("tasks");
  const errorMessage = document.getElementById("errorMessage");

  loadTasks();

  function createTaskElement(taskText, completed = false) {
    const li = document.createElement("li");
    li.classList.add("task-item", "fade-in");
    li.setAttribute("draggable", true);

    li.innerHTML = `
          <input type="checkbox" ${completed ? "checked" : ""} />
          <span class="task-text" style="text-decoration: ${
            completed ? "line-through" : "none"
          }">${taskText}
          </span>
          <div class="task buttons">
            <button class="edit-btn" aria-label="Edit task">✏️</button>
            <button class="delete-btn" aria-label="Delete task">🗑️</button>
          </div>`;

    li.querySelector(".edit-btn").addEventListener("click", () => editTask(li));
    li.querySelector(".delete-btn").addEventListener("click", () =>
      deleteTask(li)
    );
    li.querySelector("input").addEventListener("change", () =>
      toggleComplete(li)
    );

    return li;
  }

  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") {
      errorMessage.textContent = "Please enter a task.";
      return;
    }

    // console.log(taskText);

    const li = createTaskElement(taskText);
    taskList.appendChild(li);

    newTaskInput.value = "";
    errorMessage.textContent = "";

    makeTasksDraggable();
    saveTasks();
  }

  function editTask(taskItem) {
    const taskText = taskItem.querySelector(".task-text");
    const newText = prompt("Edit Task:", editTask.textContent);

    if (newText !== null && newText.trim() !== "") {
      taskText.textContent = newText.trim();
      saveTasks();
    }
  }

  function deleteTask(taskItem) {
    taskItem.remove();
    saveTasks();
  }

  function toggleComplete(taskItem) {
    const taskText = taskItem.querySelector(".task-text");
    taskText.style.textDecoration = taskItem.querySelector("input").checked
      ? "line-through"
      : "none";
    saveTasks();
  }

  function saveTasks() {
    const tasks = Array.from(document.querySelectorAll(".task-item")).map(
      (taskItem) => ({
        text: taskItem.querySelector(".task-text").textContent,
        completed: taskItem.querySelector("input").checked,
      })
    );

    // document.querySelectorAll(".task-item").forEach((taskItem) => {
    //   tasks.push({
    //     text: taskItem.querySelector(".task-text").textContent,
    //     completed: taskItem.querySelector("input").checked,
    //   });
    // });

    // console.log(tasks);

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const fragment = document.createDocumentFragment();

    console.log(fragment);

    storedTasks.forEach((task) => {
      const li = createTaskElement(task.text, task.completed);
      fragment.appendChild(li);
    });

    taskList.appendChild(fragment);
    //   li.classList.add("task-item", "fade-in");
    //   li.setAttribute("draggable", true);

    //   li.innerHTML = `
    //       <input type="checkbox" ${task.completed ? "checked" : ""}>
    //       <span class="task-text" style="text-decoration: ${
    //         task.completed ? "line-through" : "none"
    //       }">${task.text}</span>
    //       <div class="task buttons">
    //               <button class="edit-btn">✏️</button>
    //               <button class="delete-btn">🗑️</button>
    //             </div>
    //   `;

    //   taskList.appendChild(li);

    //   li.querySelector(".edit-btn").addEventListener("click", () =>
    //     editTask(li)
    //   );
    //   li.querySelector(".delete-btn").addEventListener("click", () =>
    //     deleteTask(li)
    //   );
    //   li.querySelector("input").addEventListener("change", () =>
    //     toggleComplete(li)
    //   );
    // });

    makeTasksDraggable();
  }

  function makeTasksDraggable() {
    const tasks = document.querySelectorAll(".task-item");

    tasks.forEach((task) => {
      task.addEventListener("dragstart", () => task.classList.add("dragging"));
      task.addEventListener("dragend", () => {
        task.classList.remove("dragging");
        saveTasks();
      });
    });

    taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = document.querySelector(".dragging");
      const afterElement = [...taskList.children].find(
        (task) => task.getBoundingClientRect().top > e.clientY
      );
      taskList.insertBefore(dragging, afterElement);
    });
  }

  addTaskBtn.addEventListener("click", addTask);

  newTaskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
});
