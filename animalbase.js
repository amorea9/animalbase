"use strict";

window.addEventListener("DOMContentLoaded", start);
//THE MODEL
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
  winner: false,
};

function start() {
  console.log("ready");
  //event listener added with a function
  registerButtons();
  loadJSON();
}

function registerButtons() {
  //event listener for filter buttons
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  //event listener for sort buttons
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

//THE CONTROLLER
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
  // event.target.dataset.sortDirection = !"asc";
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
  return animal.type === "cat";
}
function isDog(animal) {
  return animal.type === "dog";
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

//THE VIEW
function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  //set stars
  if (animal.star === true) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=star]").textContent = "☆";
  }
  //set winner
  clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
  //event listener for star
  clone.querySelector("[data-field=star]").addEventListener("click", (event) => {
    animal.star = !animal.star;
    buildList();
  });
  //event listener for winner
  clone.querySelector("[data-field=winner]").addEventListener("click", (event) => {
    if (animal.winner === true) {
      animal.winner = false;
    } else {
      tryToMakeAWinner(animal);
    }
    buildList();
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeAWinner(selectedAnimal) {
  const winners = allAnimals.filter((animal) => animal.winner);
  const numberOfWinners = winners.length;
  const other = winners.filter((animal) => animal.type === selectedAnimal.type).shift();
  //if there is another animal of the same type
  if (other !== undefined) {
    console.log("there can only be one winner of each type");
    removeOther(other);
  } else if (numberOfWinners >= 2) {
    console.log("there can only be two winners");
    removeAorB(winners[0], winners[1]);
  } else {
    makeWinner(selectedAnimal);
  }

  function removeOther(other) {
    //ask the user to ignore or remove the other
    document.querySelector("#remove_other").classList.add("show");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector(".remove_other").addEventListener("click", clickRemoveOther);

    document.querySelector("#remove_other .animal1").textContent = `${other.name}, the ${other.type}`;
    //if ignore, do nothing

    function closeDialog() {
      document.querySelector("#remove_other").classList.remove("show");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector(".remove_other").removeEventListener("click", clickRemoveOther);
    }
    //if remove other, remove
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
    }
  }
  function removeAorB(winnerA, winnerB) {
    //ask user to ignore or remove A or B
    document.querySelector("#remove_aorb").classList.add("show");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector(".remove_A").addEventListener("click", clickRemoveA);
    document.querySelector(".remove_B").addEventListener("click", clickRemoveB);

    //show names of the two animals
    document.querySelector("#remove_aorb .animal1").textContent = `${winnerA.name}, the ${winnerA.type}`;
    document.querySelector("#remove_aorb .animal2").textContent = `${winnerB.name}, the ${winnerB.type}`;
    //if ignore do nothing

    function closeDialog() {
      document.querySelector("#remove_aorb").classList.remove("show");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector(".remove_A").removeEventListener("click", clickRemoveA);
      document.querySelector(".remove_B").removeEventListener("click", clickRemoveB);
    }
    //if remove A
    function clickRemoveA() {
      removeWinner(winnerA);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
      console.log("click A");
    }
    //if remove B
    function clickRemoveB() {
      removeWinner(winnerB);
      makeWinner(selectedAnimal);
      buildList();
      closeDialog();
      console.log("click b");
    }
  }
  function removeWinner(winnerAnimal) {
    winnerAnimal.winner = false;
  }
  function makeWinner(animal) {
    animal.winner = true;
  }
}
