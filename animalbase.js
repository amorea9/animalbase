"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};
// The prototype for all animals:
const Animal = {
  star: false,
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};

function start() {
  console.log("ready");
  //event listener added with a function
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSorting));
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  buildList();
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  //filterList(filter);
  setFilter(filter);
}
function selectSorting(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //find old sort by element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");
  //active sort button
  event.target.classList.add("sortby");

  //toggle the direcion after first click
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}

function setFilter(filter) {
  //set global value
  settings.filterBy = filter;
  //call to buildList
  buildList();
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  //call to buildList
  buildList();
}
function buildList() {
  //call to filertList
  const currentList = filterList(allAnimals);
  //currentList = applyStar(currentList); //??
  //call to sortList
  const sortedList = sortList(currentList);

  //displays lists
  displayList(sortedList);
}
function filterList(filteredList) {
  //   let filteredList = allAnimals;
  //creates a filtered list of cats
  if (settings.filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (settings.filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }
  return filteredList;
}

function isCat(animal) {
  return animal.type == "cat";
}
function isDog(animal) {
  return animal.type == "dog";
}

function sortList(sortedList) {
  //let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(animalA, animalB) {
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}
function applyStar(animal) {}
// function filterAndSort(filteredList, sortDir, sortBy) {
//   const filteredAndSortedList = sortList(filteredList, sortDir, sortBy);
//   displayList(filteredAndSortedList);
//   console.log(filteredAndSortedList);
// }
function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  //First: make sure you can display stars in the HTML (if you use your own code), then modify the displayAnimal function to display the right kind of star.
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

  function clickStar() {
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
