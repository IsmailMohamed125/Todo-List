"use strict";


let idCounter = 0;

function generateUniqueId() {
  idCounter += 1;
  return idCounter;
}
const { isWithinInterval } = require("date-fns");
const { sub } = require("date-fns");
const { add } = require("date-fns");

export class ToDoCl {
  constructor(name, date, description, priority, project, completed) {
    this.id = generateUniqueId(); // Assuming you have a function to generate unique IDs
    this.name = name;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.project = project;
    this.completed = completed === true ? completed : false;

    this.todos();
    this.importantToDo();
    this.todayToDo();
    this.weekToDo();
    this.completedTodo();
  }

  completedTodo() {
    if (this.completed === true) completedTasks.push(this);
  }

  importantToDo() {
    if (this.priority === "high") important.push(this);
  }

  todos() {
    allToDo.push(this);
  }

  todayToDo() {
    const subtract = sub(new Date(), {
      days: 1,
    });
    const tod = isWithinInterval(this.date, {
      start: subtract,
      end: new Date(),
    });
    if (tod) today.push(this);
  }

  weekToDo() {
    const subtract = sub(new Date(), {
      days: 1,
    });
    const added = add(new Date(), {
      days: 7,
    });
    const wek = isWithinInterval(this.date, {
      start: subtract,
      end: added,
    });
    if (wek) week.push(this);
  }

  updateCompletionStatus(completed) {
    this.completed = completed;

    // Update completion status in other arrays
    const taskIndex = allToDo.findIndex((task) => task.id === this.id);
    if (taskIndex !== -1) {
      allToDo[taskIndex].completed = completed;
    }

    const importantIndex = important.findIndex((task) => task.id === this.id);
    if (importantIndex !== -1) {
      important[importantIndex].completed = completed;
    }

    const todayIndex = today.findIndex((task) => task.id === this.id);
    if (todayIndex !== -1) {
      today[todayIndex].completed = completed;
    }

    const weekIndex = week.findIndex((task) => task.id === this.id);
    if (weekIndex !== -1) {
      week[weekIndex].completed = completed;
    }
  }

  updateTask(name, date, description, priority, project) {
    this.name = name;
    this.date = date;
    this.description = description;
    this.priority = priority;
    this.project = project;
    this.updateArrays();
  }

  updateArrays() {
    // Remove the task from arrays if it exists
    // removeFromArray(allToDo, this);
    // removeFromArray(today, this);
    // removeFromArray(week, this);
    // removeFromArray(important, this);
    console.log(this);
    // Add the task to arrays based on its properties
    this.importantToDo();
    this.todayToDo();
    this.weekToDo();
    this.todos();
    this.completedTodo();
  }
}

export let important = [];
export let allToDo = [];
export let today = [];
export let week = [];
export let completedTasks = [];
