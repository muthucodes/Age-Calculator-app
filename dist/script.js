"use strict";

const selectElement = function (element) {
  return document.querySelector(element);
};

const getValue = function (element) {
  return element.value;
};

const form = selectElement(".form");
const inputs = selectElement(".inputs");
const dayInput = selectElement(".input-field-day");
const monthInput = selectElement(".input-field-month");
const yearInput = selectElement(".input-field-year");
const dayLabel = selectElement(".day-label");
const monthLabel = selectElement(".month-label");
const yearLabel = selectElement(".year-label");
const btn = selectElement(".btn");

// To be Displayed
const calculatedDays = selectElement(".calculated-days");
const calculatedMonths = selectElement(".calculated-months");
const calculatedYears = selectElement(".calculated-years");

const removeWarningElements = function () {
  const warnings = document.querySelectorAll("small");
  for (let item of warnings) {
    item.remove();
    // console.log(`${item.innerText} removed`);
  }
};

const printWarning = function (key) {
  const inputGroup = selectElement(`.input-group-${key}`);

  const warningElement = document.createElement("small");
  warningElement.setAttribute("class", "warning");

  warningElement.textContent = `Must be a valid ${key}`;
  inputGroup.appendChild(warningElement);
  // console.log(`${key} warning added`);
};

const printFullWarning = function () {
  const fullWarningElement = document.createElement("small");
  fullWarningElement.setAttribute("class", "full-warning");
  fullWarningElement.textContent = `Such a date does not exist. Please enter a valid date.`;
  inputs.after(fullWarningElement);
};

const validateIndividualInputs = function (formData) {
  for (let [key, value] of formData) {
    // console.log(`${key} : ${value}`);
    if (value) {
      if (key === "year" && value > new Date().getFullYear()) {
        printWarning(key); // Give warnings
      }
      if (key === "month" && (value > 12 || value < 1)) {
        printWarning(key);
      }
      if (key === "day" && (value > 31 || value < 1)) {
        printWarning(key);
      }
    } else {
      printWarning(key);
    }
  }
  /*
  // Must be a valid day
  // Must be a valid month
  // Must be in the past
  // DONE 1. Any field is empty when the form is submitted
  // DONE The day number is not between 1-31
  // DONE The month number is not between 1-12
  // DONE The year is in the future
  // The date is invalid, e.g. 31/04/1991 (there are 30 days in April)
  // console.log(formData);
  */
};

const validateFullDate = function (Day, Month, Year) {
  let day = Number(Day);
  let month = Number(Month);
  let year = Number(Year);

  // Create a list of days of a month
  let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month == 1 || month > 2) {
    if (day > ListofDays[month - 1]) {
      //to check if the date is out of range
      printFullWarning();
    }
  } else if (month == 2) {
    let leapYear = false;
    if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
    if (leapYear == false && day >= 29) printFullWarning();
    else if (leapYear == true && day > 29) {
      console.log("Invalid date format!");
      printFullWarning();
    }
  }
};

const calcAge = function (day, month, year) {
  let today = new Date();
  let birthDate = new Date(`${month}/${day}/${year}`);

  // Calculate years
  let years;
  if (
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() == birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())
  ) {
    years = today.getFullYear() - birthDate.getFullYear();
  } else {
    years = today.getFullYear() - birthDate.getFullYear() - 1;
  }

  // Calculate months
  let months;
  if (today.getDate() >= birthDate.getDate()) {
    months = today.getMonth() - birthDate.getMonth();
  } else if (today.getDate() < birthDate.getDate()) {
    months = today.getMonth() - birthDate.getMonth() - 1;
  }
  // make month positive
  months = months < 0 ? months + 12 : months;

  // Calculate days
  let days;
  // days of months in a year
  let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (today.getDate() >= birthDate.getDate()) {
    days = today.getDate() - birthDate.getDate();
  } else {
    days =
      today.getDate() - birthDate.getDate() + monthDays[birthDate.getMonth()];
  }

  return [years, months, days];
};

const displayAge = function ([years, months, days]) {
  calculatedYears.textContent = years;
  calculatedMonths.textContent = months;
  calculatedDays.textContent = days;
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  // const dateString = `${input-field-day.value}`
  console.log("form submitted");
  removeWarningElements(); // Remove old warnings

  const formData = new FormData(form);
  // console.log(formData);
  const entries = formData.entries();
  const data = Object.fromEntries(entries);
  validateIndividualInputs(formData); // Validate Inputs

  if (document.getElementsByTagName("small").length === 0) {
    console.log("Entering Full Date Validation");
    validateFullDate(data.day, data.month, data.year);
  }

  if (document.getElementsByTagName("small").length === 0) {
    console.log("Ready for calculating age");
    const ageArr = calcAge(data.day, data.month, data.year);
    displayAge(ageArr);
  }
});
