"use strict";

let allAnimals = [];
const filterButton = document.querySelectorAll(".filter");
// const catButton = filterButton[0];
// const dogButton = filterButton[1];
// const allButton = filterButton[2];
const sortButton = document.querySelectorAll("[data-action=sort]");
let filterOfCats;
let filterOfDogs;
let filterOfAll;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
};
window.addEventListener("DOMContentLoaded", start);
//MODEL

function start() {
  console.log("ready");
  // TODO: Add event-listeners to filter and sort buttons
  // catButton.addEventListener("click", displayCatList);
  // dogButton.addEventListener("click", displayDogList);
  document.querySelectorAll(".filter").forEach((button) => {
    button.addEventListener("click", displayList);
  });
  //fix the above

  document.querySelectorAll("[data-action=sort]").forEach((button) => {
    button.addEventListener("click", sortTheList);
  });
  //can also do event listener with event and target... check that later
  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

//CONTROLLER

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first
  filterOfCats = filterCat(allAnimals);
  filterOfDogs = filterDog(allAnimals);
  filterOfAll = filterAll(allAnimals);

  displayList(filterOfDogs);
  displayList(filterOfAll);
  displayList(filterOfCats);
  displayList(allAnimals);
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

//is functions
function isCat(animal) {
  if (animal.type === "cat") {
    return true;
  }
  return false;
}

function isDog(animal) {
  if (animal.type === "dog") {
    return true;
  }
  return false;
}
function isAllAnimals(animal) {
  return true;
}

//filter only if is function is true
function checkAll(animal) {
  if (isAllAnimals) {
    filterAll(allAnimals);
  }
}
function checkCat(animal) {
  if (isCat) {
    filterCat(allAnimals);
  } else return;
}

function checkDog(animal) {
  if (isDog) {
    filterDog(allAnimals);
  } else return;
}

//filter

function filterCat(allAnimals) {
  return allAnimals.filter(isCat);
}

function filterDog(allAnimals) {
  return allAnimals.filter(isDog);
}
function filterAll(allAnimals) {
  return allAnimals.filter(isAllAnimals);
}

// sorting
function sortTheList(event) {
  const sortButtonClicked = event.target.dataset.sort;
  const filterButtonClicked = event.target.dataset.filter;

  checkTheList(sortButtonClicked, filterButtonClicked);
}

function checkTheList(sortButtonClicked, filterButtonClicked) {
  console.log(filterButtonClicked);
  switch (filterButtonClicked) {
    case "cat":
      filterOfCats = filterCat(allAnimals);
      filterOfCats.forEach(displayAnimal);
      break;
    case "dog":
      break;
    case "*":
      break;
  }
  switch (sortButtonClicked) {
    case "name":
      let sortedByName = allAnimals.sort(sortBy);
      console.log(sortedByName);
      break;
    case "type":
      let sortedByType = allAnimals.sort(sortBy);
      console.log(sortedByType);
      break;
    case "desc":
      let sortedByDesc = allAnimals.sort(sortBy);
      console.log(sortedByDesc);
      break;
    case "age":
      let sortedByAge = allAnimals.sort(sortBy);
      console.log(sortedByAge);
      break;
  }
}
function sortBy(listToSort, direction = "asc", prop) {
  let sortDirection;
  //gives priority to the property here rather than direction

  if (direction === "asc") {
    sortDirection = 1;
  } else {
    sortDirection = -1;
  }
  listToSort = listToSort.sort(compareName);
  function compareName(a, b) {
    if (a[prop] < b[prop]) {
      return -1 * sortDirection;
    } else {
      return 1 * sortDirection;
    }
  }
  return listToSort;
}

// function sortBy(a, b) {
//   if (a.name < b.name || a.type < b.type || a.desc < b.desc) {
//     return -1;
//   } else {
//     return 1;
//   }

//   //age not working
// }

//VIEW

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  filterOfAll.forEach(displayAnimal);
  //animals.forEach(displayAnimal);
}
// function displayCatList() {
//   document.querySelector("#list tbody").innerHTML = "";
//   filterOfCats.forEach(displayAnimal);
// }
function displayDogList() {
  document.querySelector("#list tbody").innerHTML = "";
  filterOfDogs.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
