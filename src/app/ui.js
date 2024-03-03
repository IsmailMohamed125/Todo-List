"use strict";

import {
  ToDoCl,
  important,
  allToDo,
  today,
  week,
  completedTasks,
} from "./todo.js";

import { ProjectCl, allProjects } from "./project.js";

import {
  createTodoContent,
  infoDialogs,
  createCheckbox,
  drop,
  renderProject,
} from "./renderHTML.js";

import {
  submitForm,
  submitForm1,
  submitForm2,
  completedProject,
  completedForm,
} from "./formdata.js";

export const dropSection = document.getElementById("project");
export let projectList = document.querySelector(".project-list");
let completedEditProject;
let listTasks = document.querySelector(".all-tasks");
const showDialogButton = document.getElementById("showDialogBtn");
const exampleDialog = document.getElementById("exampleDialog");
const closeDialogButton = document.getElementById("closeDialogBtn");
const submitAndClose = document.getElementById("submitAndClose");
const showDialogButton1 = document.getElementById("showDialogBtn1");
const exampleDialog1 = document.getElementById("exampleDialog1");
const closeDialogButton1 = document.getElementById("closeDialogBtn1");
const addAndClose = document.getElementById("addAndClose");
const notifs = document.querySelector(".notifs");
const sectionTitle = document.querySelector(".section-title");

listTasks.addEventListener("change", function (event) {
  if (event.target.type === "checkbox") {
    const taskId = parseInt(event.target.getAttribute("data-task-id"), 10);
    const task = allToDo.find((task) => task.id === taskId);
    const container = event.target.closest(".task-container");

    if (task) {
      // Update completion status based on the checkbox state
      const completed = event.target.checked;

      // Check if the task is already in the completedTasks array
      const isAlreadyCompleted = completedTasks.some((t) => t.id === taskId);

      // Update completion status
      task.updateCompletionStatus(completed);

      // Update selected class
      container.classList.toggle("selected", completed);

      // Update completedTasks array
      if (completed) {
        // Add the task to completedTasks only if it's not already there
        if (!isAlreadyCompleted) {
          completedTasks.push(task);
          saveToLocalStorage();
        }
      } else {
        // Remove the task from completedTasks if it's already there
        if (isAlreadyCompleted) {
          const index = completedTasks.findIndex((t) => t.id === taskId);
          if (index !== -1) {
            completedTasks.splice(index, 1);
            saveToLocalStorage();
          }
        }
      }

      let titleSec = sectionTitle.textContent;
      const filters = ["Inbox", "Today", "Week", "Important", "Completed"];

      if (filters.includes(titleSec)) {
        selectedState(titleSec);
      } else {
        handleTaskProjectCompletion(titleSec);
      }
      // Re-render tasks based on the selected state
    }
  }
});

function handleTaskProjectCompletion(title) {
  selectedState("", sectionTitle.textContent);
}

listTasks.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".btn-delete-todo");
  if (deleteButton) {
    const taskId = parseInt(deleteButton.getAttribute("data-task-id"), 10);
    // Call a function to handle the deletion based on the taskId
    handleTaskDeletion(taskId);
  }
});

listTasks.addEventListener("click", function (event) {
  const editButton = event.target.closest(".btn-edit-todo");
  if (editButton) {
    const taskId = parseInt(editButton.getAttribute("data-task-id"), 10);
    // Call a function to handle opening the edit dialog
    openEditDialog(taskId);
  }
});

listTasks.addEventListener("click", function (event) {
  const infoButton = event.target.closest(".btn-info-todo");
  if (infoButton) {
    const taskId = parseInt(infoButton.getAttribute("data-task-id"), 10);
    // Call a function to handle opening the info dialog
    openInfoDialog(taskId);
  }
});

export function projectRender() {
  allProjects.forEach((project) => {
    dropSection.insertAdjacentHTML("beforeend", drop(project));
    projectList.insertAdjacentHTML("beforeend", renderProject(project));
  });
}

export function editProject() {
  const btnEditProject = document.querySelectorAll(".btn-project-edit");
  const btnCloseEdit = document.querySelectorAll(".closeDialogBtn2");
  const btnAddEdit = document.querySelectorAll(".editAndClose");
  btnEditProject.forEach((button) => {
    button.addEventListener("click", (e) => {
      const pa = e.target.closest(".project-actions");
      const editP = pa.querySelector(".edit-p");
      editP.showModal();
    });
  });
  btnCloseEdit.forEach((button) => {
    button.addEventListener("click", (e) => {
      const editP = e.target.closest(".edit-p");
      const editF = editP.querySelector(".edit-f");
      editF.reset();
      editP.close();
    });
  });
  btnAddEdit.forEach((button) => {
    button.addEventListener("click", (e) => {
      const projectContainer = e.target.closest(".project-details");
      const pt = projectContainer.querySelector(".project-title").textContent;
      const input = projectContainer.querySelector(`#${pt}`).value;
      const valid = projectContainer.querySelector(".projectNameError");
      // console.log(valid);
      completedEditProject = false;
      valid.innerText = "";
      if (input === "") {
        valid.innerText = "Description is required";
        return;
      }

      const foundObject = allProjects.find((obj) => obj.name === pt);
      const index = allProjects.indexOf(foundObject);
      const newName = allProjects.find((obj) => obj.name === input);
      if (!newName) {
        allToDo.forEach((item) => {
          if (item.project === pt) item.project = input;
        });
        today.forEach((item) => {
          if (item.project === pt) item.project = input;
        });
        week.forEach((item) => {
          if (item.project === pt) item.project = input;
        });
        important.forEach((item) => {
          if (item.project === pt) item.project = input;
        });
        completedTasks.forEach((item) => {
          if (item.project === pt) item.project = input;
        });
        allProjects[index].name = input;
      }
      completedEditProject = true;
      const editP = e.target.closest(".edit-p");
      if (completedEditProject) editP.close();
      setTimeout(() => {
        submitForm2(new Event("click")); // Manually trigger the form submission function
      }, 500);
    });
  });
}

export function deleteProject() {
  const btnDeleteProject = document.querySelectorAll(".btn-project-delete");
  btnDeleteProject.forEach((button) => {
    button.addEventListener("click", function (e) {
      const target = e.target;
      const projectContainer = target.closest(".project-details");
      const pt = projectContainer.querySelector(".project-title").textContent;

      const updatedArrays = removeTasksByProjectName(
        allToDo,
        today,
        week,
        important,
        completedTasks,
        pt
      );
      allToDo.length = 0;
      allToDo.push(...updatedArrays.taskArray);
      today.length = 0;
      today.push(...updatedArrays.todayArray);
      week.length = 0;
      week.push(...updatedArrays.weekArray);
      important.length = 0;
      important.push(...updatedArrays.importantArray);
      completedTasks.length = 0;
      completedTasks.push(...updatedArrays.completedTasksArray);

      const optionToRemove = document.querySelector(`option[value="${pt}"]`);
      const foundObject = allProjects.find((obj) => obj.name === pt);
      const index = allProjects.indexOf(foundObject);

      if (index !== -1) {
        allProjects.splice(index, 1);
      }
      setTimeout(() => {
        saveToLocalStorage();
        homepage(); // Manually trigger the form submission function
      }, 100);

      try {
        optionToRemove.remove();
        projectContainer.remove();
      } catch (error) {
        console.error(error);
      }
    });
  });
}

export function homepage() {
  remove();
  const notifElement = document.querySelector(".home");
  listTasks.innerHTML = "";
  notifElement.click();
}

showDialogButton.addEventListener("click", () => {
  exampleDialog.showModal();
});

closeDialogButton.addEventListener("click", () => {
  exampleDialog.close();
});

submitAndClose.addEventListener("click", () => {
  // Use a delay before calling the form submission function
  submitForm(new Event("submit")); // Manually trigger the form submission function
  // Adjust the delay as needed
  if (completedForm) exampleDialog.close();
});

showDialogButton1.addEventListener("click", () => {
  exampleDialog1.showModal();
});

closeDialogButton1.addEventListener("click", () => {
  exampleDialog1.close();
});

addAndClose.addEventListener("click", () => {
  submitForm1(new Event("submit")); // Manually trigger the form submission function
  if (completedProject) exampleDialog1.close();

  // Use a delay before calling the form submission function

  // Adjust the delay as needed
});

function remove() {
  document
    .querySelectorAll(".select")
    .forEach((item) => item.classList.remove("visited"));
}

notifs.addEventListener("click", function (event) {
  let selectElement = event.target.closest(".select");
  if (selectElement) {
    remove();
    selectElement.classList.add("visited");
    let contentTitle = selectElement.querySelector(".notif-title");
    sectionTitle.textContent = "";
    sectionTitle.textContent = `${contentTitle.textContent}`;
    listTasks.innerHTML = "";
    selectedState(contentTitle.textContent);
  }
});

projectList.addEventListener("click", function (event) {
  let selectElement = event.target.closest(".select");
  if (selectElement) {
    remove();
    selectElement.classList.add("visited");
    let contentTitle = selectElement.querySelector(".project-title");
    sectionTitle.textContent = "";
    sectionTitle.textContent = `${contentTitle.textContent}`;
    listTasks.innerHTML = "";
    let projectTitle = contentTitle.textContent;
    selectedState("", projectTitle);
  }
});

function removeTasksByProjectName(
  taskArray,
  todayArray,
  weekArray,
  importantArray,
  completedTasksArray,
  projectNameToRemove
) {
  taskArray = taskArray.filter((task) => task.project !== projectNameToRemove);
  todayArray = todayArray.filter(
    (task) => task.project !== projectNameToRemove
  );
  weekArray = weekArray.filter((task) => task.project !== projectNameToRemove);
  importantArray = importantArray.filter(
    (task) => task.project !== projectNameToRemove
  );
  completedTasksArray = completedTasksArray.filter(
    (task) => task.project !== projectNameToRemove
  );
  return {
    taskArray,
    todayArray,
    weekArray,
    importantArray,
    completedTasksArray,
  };
}
function selectedState(selectElement, project) {
  // Clear the list before rendering tasks
  listTasks.innerHTML = "";
  let projectArray = allToDo.filter((obj) => obj.project === project);

  let selectedArray;

  switch (selectElement) {
    case "Inbox":
      selectedArray = allToDo;
      break;
    case "Today":
      selectedArray = today;
      break;
    case "Week":
      selectedArray = week;
      break;
    case "Important":
      selectedArray = important;
      break;
    case "Completed":
      selectedArray = completedTasks;
      break;
    case "":
      selectedArray = projectArray;
      break;
  }
  if (selectedArray) {
    selectedArray.forEach((item) => {
      const checklistHtml = createCheckbox(
        item.id,
        item.name,
        item.project,
        item.date,
        item.completed
      );
      const todoHtml = createTodoContent(item.id, item.name, item.date);
      const dialogInfo = infoDialogs(item);
      const container = document.createElement("div");
      container.classList.add("task-container");
      container.innerHTML = `
          ${checklistHtml}
    ${todoHtml}
    ${dialogInfo}`;
      listTasks.appendChild(container);

      // Add the "selected" class for completed tasks
      if (item.completed) {
        container.classList.add("selected");
      }
    });
  }
}

function handleTaskDeletion(taskId) {
  // Find the task with the specified taskId
  const taskIndex = allToDo.findIndex((task) => task.id === taskId);

  // Check if the task was found
  if (taskIndex !== -1) {
    const deletedTask = allToDo.splice(taskIndex, 1)[0];

    // Remove the task from other arrays if it exists
    removeTaskFromOtherArrays(deletedTask);

    // Re-render tasks based on the selected state
    let titleSec = sectionTitle.textContent;
    const filters = ["Inbox", "Today", "Week", "Important", "Completed"];

    if (filters.includes(titleSec)) {
      selectedState(titleSec);
    } else {
      handleTaskProjectCompletion(titleSec);
    }

    // Update local storage
    saveToLocalStorage();
  }
}

function removeTaskFromOtherArrays(task) {
  // Remove the task from other arrays if it exists
  removeFromArray(today, task);
  removeFromArray(week, task);
  removeFromArray(important, task);
  removeFromArray(completedTasks, task);
}

function removeFromArray(array, task) {
  const index = array.findIndex((t) => t.id === task.id);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// Function to open the info dialog
function openInfoDialog(taskId) {
  // Retrieve the task based on taskId
  const task = allToDo.find((task) => task.id === taskId);
  console.log(task);

  if (task) {
    // Generate unique IDs for the dialog and its child elements
    const dialogId = `infoDialog-${taskId}`;
    const titleDisplayId = `titleDisplay-${taskId}`;
    const dateDisplayId = `dateDisplay-${taskId}`;
    const descriptionDisplayId = `descriptionDisplay-${taskId}`;
    const priorityDisplayId = `priorityDisplay-${taskId}`;
    const projectDisplayId = `projectDisplay-${taskId}`;
    const closeInfoDialogBtnId = `closeInfoDialogBtn-${taskId}`;

    // Access the form elements
    const infoDialog = document.getElementById(dialogId);
    const titleDisplay = document.getElementById(titleDisplayId);
    const dateDisplay = document.getElementById(dateDisplayId);
    const descriptionDisplay = document.getElementById(descriptionDisplayId);
    const priorityDisplay = document.getElementById(priorityDisplayId);
    const projectDisplay = document.getElementById(projectDisplayId);
    const closeInfoDialogBtn = document.getElementById(closeInfoDialogBtnId);

    // Display task details in the info dialog
    titleDisplay.textContent = task.name;
    dateDisplay.textContent = task.date;
    descriptionDisplay.textContent = task.description;
    priorityDisplay.textContent = capitalizeFirstLetter(task.priority);
    projectDisplay.textContent = task.project;

    // Open the info dialog
    infoDialog.showModal();

    // Add an event listener for closing the info dialog
    closeInfoDialogBtn.addEventListener("click", () => {
      infoDialog.close();
    });
  }
}

// Function to open the edit dialog
function openEditDialog(taskId) {
  // Retrieve the task based on taskId
  const task = allToDo.find((task) => task.id === taskId);

  if (task) {
    // Access the form elements
    const form = document.getElementById("exampleDialog");
    const taskIdInput = form.querySelector("#taskId");
    const titleInput = form.querySelector("#title");
    const dateInput = form.querySelector("#date");
    const descriptionTextarea = form.querySelector("#description");
    const prioritySelect = form.querySelector("#priority");
    const projectSelect = form.querySelector("#project");

    // Set the task ID in the hidden input field
    taskIdInput.value = taskId;

    // Pre-fill form fields with task details
    titleInput.value = task.name;
    dateInput.value = task.date;
    descriptionTextarea.value = task.description;
    prioritySelect.value = task.priority;
    projectSelect.value = task.project;

    // Open the dialog
    form.showModal();

    // Add an event listener for the form submission
    // form.addEventListener("submit", function (event) {
    //   event.preventDefault();
    //   console.log("te");
    //   // Handle the form submission and update the task details
    //   handleFormSubmission(taskId);
    // });

    // Add an event listener for the "Close" button
    const closeBtn = form.querySelector("#closeDialogBtn");
    closeBtn.addEventListener("click", function () {
      form.close();
    });

    // Manually trigger the form submission function for editing
    const submitAndClose = form.querySelector("#submitAndClose");
    console.log(submitAndClose);
    submitAndClose.addEventListener("click", () => {
      form.dispatchEvent(new Event("submit"));
      // submitForm(new Event("submit"), taskId);
      if (completedForm) form.close();
    });
  }
}

// Function to handle form submissions (both new tasks and edits)
export function handleFormSubmission(taskId) {
  // Retrieve the task based on taskId
  console.log("e");
  console.log(allToDo);
  const task = allToDo.find((task) => task.id === +taskId);
  console.log(task);

  if (task) {
    // Access the form elements
    const form = document.getElementById("exampleDialog");
    const titleInput = form.querySelector("#title");
    const dateInput = form.querySelector("#date");
    const descriptionTextarea = form.querySelector("#description");
    const prioritySelect = form.querySelector("#priority");
    const projectSelect = form.querySelector("#project");

    // Update task details
    task.updateTask(
      titleInput.value,
      dateInput.value,
      descriptionTextarea.value,
      prioritySelect.value,
      projectSelect.value
    );
    console.log(allToDo);

    // Update the task in all relevant arrays
    updateTaskInArrays(task);

    // Re-render tasks based on the selected state
    selectedState(sectionTitle.textContent);
  }
}

// Function to update tasks in arrays
function updateTaskInArrays(updatedTask) {
  // Find the index of the old task in each array and replace it with the updated task
  updateArray(allToDo, updatedTask);
  updateArray(today, updatedTask);
  updateArray(week, updatedTask);
  updateArray(important, updatedTask);
  updateArray(completedTasks, updatedTask);

  saveToLocalStorage();
}

// Function to update an array with a new task instance
function updateArray(array, oldTask) {
  const index = array.findIndex((task) => task.id === oldTask.id);
  if (index !== -1) {
    // Remove the old task from the array
    array.splice(index, 1);
  }
}

export function saveToLocalStorage() {
  localStorage.setItem("allToDo", JSON.stringify(allToDo));
  localStorage.setItem("today", JSON.stringify(today));
  localStorage.setItem("week", JSON.stringify(week));
  localStorage.setItem("important", JSON.stringify(important));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  localStorage.setItem("projects", JSON.stringify(allProjects));
}

export function loadFromLocalStorage() {
  // Retrieve data from local storage
  let allToDoArray = JSON.parse(localStorage.getItem("allToDo")) || [];
  let todayArray = JSON.parse(localStorage.getItem("today")) || [];
  let weekArray = JSON.parse(localStorage.getItem("week")) || [];
  let importantArray = JSON.parse(localStorage.getItem("important")) || [];
  let completedTasksArray =
    JSON.parse(localStorage.getItem("completedTasks")) || [];
  let allProjectsArray = JSON.parse(localStorage.getItem("projects")) || [];
  // Convert plain objects to instances of your class
  allToDo.length = 0;
  today.length = 0;
  week.length = 0;
  important.length = 0;
  completedTasks.length = 0;
  allProjects.length = 0;

  allToDoArray.map(
    (obj) =>
      new ToDoCl(
        obj.name,
        obj.date,
        obj.description,
        obj.priority,
        obj.project,
        obj.completed
      )
  );
  allProjectsArray.map((obj) => new ProjectCl(obj.name));
  projectRender();
  homepage();
  editProject();
  deleteProject();
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
