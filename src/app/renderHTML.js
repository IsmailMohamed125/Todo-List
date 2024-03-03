"use strict";

export function createCheckbox(id, name, project, date, completed) {
  return `
      <div class="checklist">
        <label class="check" for="checkbox-${id}"> </label>
        <input type="checkbox" id="checkbox-${id}" data-task-id="${id}" ${
    completed ? "checked" : ""
  } />
      </div>`;
}

export function drop(data) {
  return `<option name="${data.name}" value="${data.name}">${data.name}</option>`;
}

export function renderProject(data) {
  return `<div class="project-details select">
    <div class="proj-it">
    <div class="project-icon">
    <svg
    class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          >
          <path
          d="M5.41,21L6.12,17H2.12L2.47,15H6.47L7.53,9H3.53L3.88,7H7.88L8.59,3H10.59L9.88,7H15.88L16.59,3H18.59L17.88,7H21.88L21.53,9H17.53L16.47,15H20.47L20.12,17H16.12L15.41,21H13.41L14.12,17H8.12L7.41,21H5.41M9.53,9L8.47,15H14.47L15.53,9H9.53Z"
          />
          </svg>
          </div>
          <div class="project-title">${data.name}</div>
          </div>
          <div class="project-actions">
          <button class="btn-action btn-project-edit">
          <svg
          class="action"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          >
          <path
          d="M10 20H6V4H13V9H18V12.1L20 10.1V8L14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H10V20M20.2 13C20.3 13 20.5 13.1 20.6 13.2L21.9 14.5C22.1 14.7 22.1 15.1 21.9 15.3L20.9 16.3L18.8 14.2L19.8 13.2C19.9 13.1 20 13 20.2 13M20.2 16.9L14.1 23H12V20.9L18.1 14.8L20.2 16.9Z"
          />
          </svg>
          </button>
          <dialog class="edit-p">
    <div class="form-container">
      <form autocomplete="off" class="edit-f">
        <legend class="form-instructions">Edit project</legend>
        <div class="project-info input-group">
          <label for="${date.name}">Project title:</label>
          <input
            type="text"
            id="${data.name}"
            name="procjectTitle"
            value="${data.name}"
          />
          <span class="error projectNameError"></span>
        </div>
        <div class="buttons-container">
          <button type="button" class="editAndClose">
            Add
          </button>
          <button type="button" class="closeDialogBtn2">
            Close
          </button>
        </div>
      </form>
    </div>
  </dialog>
        <button class="btn-action btn-project-delete">
          <svg
          class="action"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          >
          <path
          d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
          />
          </svg>
          </button>
          </div>
          </div>`;
}

export function infoDialogs(item) {
  return `
    <dialog id="infoDialog-${item.id}" class="info-dialog">
      <h2>Task Information</h2>
      <div class="form-container-1">
        <p><strong>Title:</strong> <span id="titleDisplay-${item.id}"></span></p>
        <p><strong>Date:</strong> <span id="dateDisplay-${item.id}"></span></p>
        <p><strong>Description:</strong> <span id="descriptionDisplay-${item.id}"></span></p>
        <p><strong>Priority:</strong> <span id="priorityDisplay-${item.id}"></span></p>
        <p><strong>Project:</strong> <span id="projectDisplay-${item.id}"></span></p>
        <button class="btn-close-info" id="closeInfoDialogBtn-${item.id}">Close</button>
      </div>
    </dialog>`;
}

export function createTodoContent(id, name, date) {
  return `<div class="display-info">
    <div class="display-title">${name}</div>
    <div class="display-date">
      Due Date: <span class="date-info">${date}</span>
    </div>
  </div>
  <div class="task-actions">
  <button class="btn-action btn-info-todo" data-task-id="${id}">
  <div class="action-c">
  <svg
  class="action"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  >
  <path
  d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
  />
  </svg>
  </div>
  </button>
  <button class="btn-action btn-edit-todo" data-task-id="${id}">
  <div class="action-c">
  <svg
  class="action"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  >
  <path
  d="M10 20H6V4H13V9H18V12.1L20 10.1V8L14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H10V20M20.2 13C20.3 13 20.5 13.1 20.6 13.2L21.9 14.5C22.1 14.7 22.1 15.1 21.9 15.3L20.9 16.3L18.8 14.2L19.8 13.2C19.9 13.1 20 13 20.2 13M20.2 16.9L14.1 23H12V20.9L18.1 14.8L20.2 16.9Z"
  />
  </svg>
  </div>
  </button>
  <button class="btn-action btn-delete-todo" data-task-id="${id}">
  <div class="action-c">
  <svg
  class="action"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  >
  <path
  d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
  />
  </svg>
  </div>
  </button>
  </div>`;
}
