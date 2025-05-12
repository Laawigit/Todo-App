let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const nameElement = document.querySelector(".js-todo-input-name");
const dateElement = document.querySelector(".js-todo-input-date");

renderList();

function saveToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

///////////////////////////////////////////////////////////////

function addToTasks() {
  const name = nameElement.value.trim();
  const date = dateElement.value.trim();

  if (name === "" || date === "") {
    alert("Please fill the form!");
    return;
  }

  // Find the existing task (if any)
  const existingTask = tasks.find(
    (task) => task.name === name && task.date === date
  );

  if (existingTask) {
    // If editing the same task without changes, alert the user
    alert("Task already exists!");
  } else {
    // If not editing, push the new task
    tasks.push({ name, date, checked: false });
  }

  // Save and update the list
  saveToStorage();
  renderList();

  // Clear the form fields
  nameElement.value = "";
  dateElement.value = "";

  const cancelButton = getCancelButton();
  if (cancelButton && cancelButton.classList.contains("show")) {
    cancelButton.classList.remove("show");
  }
}

//////////////////////////////////////////////////////////////

function renderList() {
  let listHTML = "";
  tasks.forEach((task) => {
    listHTML += `
            <div class="task-list js-task-list"
            data-task-name="${task.name}"
            data-task-date="${task.date}"
            >
            <input type="checkbox" class="checkbox-input js-checkbox-input"
            data-task-name="${task.name}"
            data-task-date="${task.date}"
            ${task.checked ? "checked" : ""}
            />
            <div>
            ${task.name}
            </div>
            <div>
            ${task.date}
            </div>
            <button class="edit-button js-edit-button"
             data-task-name="${task.name}"
             data-task-date="${task.date}"
             data-task-checked="${task.checked}"
            >Edit</button>
            <button class="delete-button js-delete-button"
             data-task-name="${task.name}"
             data-task-date="${task.date}"
             >Delete</button>
             </div>
        `;
  });

  document.querySelector(".js-task-list-container").innerHTML = listHTML;

  document.querySelectorAll(".js-delete-button").forEach((deleteButton) => {
    deleteButton.addEventListener("click", () => {
      console.log("working");
      const name = deleteButton.dataset.taskName;
      const date = deleteButton.dataset.taskDate;
      // console.log(name);
      // console.log(date);
      removeTask(name, date);
    });
  });

  document.querySelectorAll(".js-edit-button").forEach((editButton) => {
    const { taskName, taskDate, taskChecked } = editButton.dataset;
    editButton.addEventListener("click", () => {
      //console.log(taskChecked);
      editTask(taskName, taskDate, taskChecked);
      console.log(taskChecked);
      console.log(editButton.dataset);
      console.log(tasks);
    });
  });

  document.querySelectorAll(".js-checkbox-input").forEach((checkBox) => {
    const { taskName, taskDate } = checkBox.dataset;
    checkBox.addEventListener("change", (event) => {
      markAsCompleted(taskName, taskDate, checkBox.checked);
      saveToStorage();
      console.log(tasks);
    });
  });
}

///////////////////////////////////////////////////////////////
function removeTask(name, date) {
  tasks = tasks.filter((task) => !(task.name === name && task.date === date));
  saveToStorage();

  let removedElement;
  document.querySelectorAll(".js-task-list").forEach((element) => {
    const { taskName, taskDate } = element.dataset;
    if (taskName === name && taskDate === date) {
      removedElement = element;
    }
  });

  if (removedElement) {
    removedElement.remove();
  }
  console.log(tasks);
}

///////////////////////////////////////////////////////////////////

function editTask(name, date, taskChecked) {
  removeTask(name, date);
  nameElement.value = name;
  dateElement.value = date;

  const checked = taskChecked.toLowerCase() === "true" ? true : false;
  cancelEditTask(name, date, checked);
}

///////////////////////////////////////////////////////////////////

function getCancelButton() {
  const cancelButton = document.querySelector(".js-cancel-task-button");
  return cancelButton;
}

////////////////////////////////////////////////////////////////

function cancelEditTask(name, date, checked) {
  const cancelButton = getCancelButton();
  if (cancelButton) {
    cancelButton.classList.add("show");

    // Handle the cancel button click
    cancelButton.onclick = () => {
      // Restore the task in the list
      tasks.push({ name, date, checked });

      // Update the UI
      renderList();
      saveToStorage();

      // Clear the form fields
      nameElement.value = "";
      dateElement.value = "";

      // Hide the cancel button
      cancelButton.classList.remove("show");
    };
  }
}

/////////////////////////////////////////////////////////////////

function markAsCompleted(name, date, checked) {
  tasks.forEach((task, index) => {
    if (task.name === name && task.date === date) {
      //console.log(checked)
      task.checked = checked;
      //console.log(task.checked)
      saveToStorage();
      renderList();
    }
  });
  console.log(checked);
}

//////////////////////////////////////////////////////////////////

const form = document.querySelector(".js-todo-list-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addToTasks();
});

const completed = document.querySelector(".js-completed-input");

completed.addEventListener( "click", () => {
  checkAll()
  renderList()
});

function checkAll() {
  tasks.forEach( ( task ) => {
    if ( completed.checked === true ) {
      task.checked = true;
    } else if ( completed.checked === false ) {
      task.checked = false
    }
  } );
  saveToStorage()
  console.log(tasks);
}

console.log(tasks);
