"use strict";

export class ProjectCl {
  constructor(name) {
    this.name = name;
    this.proj();
  }
  proj() {
    const foundObject = allProjects.find((obj) => obj.name === this.name);
    if (!foundObject) allProjects.push(this);
  }
}

export let allProjects = [];
