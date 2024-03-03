"use strict";

import { ToDoCl } from "./todo.js";
import { ProjectCl, allProjects } from "./project.js";
import {
  handleFormSubmission,
  saveToLocalStorage,
  homepage,
  dropSection,
  projectList,
  projectRender,
  editProject,
  deleteProject,
} from "./ui.js";

import { drop, renderProject } from "./renderHTML.js";

export let completedForm;
const formProject = document.querySelector(".project-form");
const formTask = document.querySelector(".task-form");
export let completedProject;

export function submitForm(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  completedForm = false;

  document.getElementById("titleError").innerText = "";
  document.getElementById("dateError").innerText = "";
  document.getElementById("descriptionError").innerText = "";
  document.getElementById("projectError").innerText = "";

  let titleElement = document.getElementById("title");
  let dateElement = document.getElementById("date");
  let descriptionElement = document.getElementById("description");
  let projectElement = document.getElementById("project");
  let idElement = document.getElementById("taskId");
  // console.log(idElement);

  // Check if elements exist before accessing their properties
  let title = titleElement ? titleElement.value.trim() : "";
  let date = dateElement ? dateElement.value.trim() : "";
  let description = descriptionElement ? descriptionElement.value.trim() : "";
  let project = projectElement ? projectElement.value : "";
  let id = idElement ? idElement.value : "";
  // console.log(id);
  // Validate Title
  if (title === "") {
    document.getElementById("titleError").innerText = "Title is required";
    return;
  }

  // Validate Date
  if (date === "") {
    document.getElementById("dateError").innerText = "Date is required";
    return;
  }

  // Validate Description
  if (description === "") {
    document.getElementById("descriptionError").innerText =
      "Description is required";
    return;
  }

  // Validate Priority
  if (project === "") {
    document.getElementById("projectError").innerText = "Project is required";
    return;
  }

  completedForm = true;
  const taskId = id;
  // formTask.dataset.taskId;
  console.log(taskId);

  if (taskId) {
    // Editing an existing task
    // console.log("reach");
    handleFormSubmission(taskId);
  } else {
    // Creating a new task
    // console.log("a");
    const formData = new FormData(formTask);
    const formObj = Object.fromEntries(formData);
    const data = Object.values(formObj);
    const todo = new ToDoCl(...data);
    saveToLocalStorage();
  }

  // Reset the form
  idElement.value = "";
  console.log("Form submitted");
  formTask.reset();
  homepage();
}

export function submitForm1(event) {
  console.log("Form submitted");
  event.preventDefault(); // Prevent the default form submission behavior
  completedProject = false;

  document.getElementById("projectNameError").innerText = "";
  let titleElement = document.getElementById("project-title");
  let title = titleElement ? titleElement.value.trim() : "";

  if (title === "") {
    document.getElementById("projectNameError").innerText = "Title is required";
    return;
  }

  completedProject = true;

  // Your form submission logic here
  const formData1 = new FormData(formProject);
  const formObj1 = Object.fromEntries(formData1);
  const data1 = Object.values(formObj1);
  const newProject = new ProjectCl(...data1);
  saveToLocalStorage();
  dropSection.innerHTML = "";
  projectList.innerHTML = "";
  projectRender();
  deleteProject();
  homepage();
  editProject();

  formProject.reset();
}

export function submitForm2(event) {
  // console.log(event.target);
  console.log("Form 2 submitted");
  event.preventDefault();
  dropSection.innerHTML = "";
  projectList.innerHTML = "";
  allProjects.forEach((project) => {
    dropSection.insertAdjacentHTML("beforeend", drop(project));
    projectList.insertAdjacentHTML("beforeend", renderProject(project));
  });
  saveToLocalStorage();
  deleteProject();
  homepage();
  editProject();
}
