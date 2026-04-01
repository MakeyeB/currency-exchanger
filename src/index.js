import CurrencyService from './currency-service.js';
import './css/styles.css';

// Business Logic

function getExchangeRates() {
  let promise = CurrencyService.getConversionRates();
  promise.then(loadMainFile, function(errorArray) {
    if (errorArray[1] && errorArray[1]["error-type"]) {
      printOutput(`An error has occurred! Try reloading the page. If this issue persists, check the documentation page listed below.\nError Code: ${errorArray[0].status}\nError Type: ${errorArray[1]["error-type"]}\nFor more info, check https://www.exchangerate-api.com/docs/standard-requests`);
    } else {
      printOutput(`An error has occurred! This issue is likely due to an invalid API URL or an outage, if this issue persists, make sure the API URL is correct and try again later.\nError Code: ${errorArray[0].status}\n`);
    }
  });
}

function displayExchangeRate(newCurrencyType, conversionAmt, conversionRates) {
  if (!conversionAmt || typeof(conversionAmt) !== "number" || conversionAmt < 0) {
    printOutput("Input a valid amount in USD.");
    return;
  }
  const chosenExchangeRate = conversionRates[newCurrencyType];
  if (chosenExchangeRate) {
    printOutput(`${(Math.round(conversionAmt * 100) / 100).toString()} USD is ${(Math.round(conversionAmt * chosenExchangeRate * 100) / 100).toString()} in ${newCurrencyType}.`);
  } else {
    printOutput(`Invalid currency provided.`);
  }
}

// UI Logic

function printOutput(outputMsg) {
  document.getElementById('output').innerText = outputMsg;
}

function loadMainFile(currencyConversions) {
  if (!currencyConversions || !currencyConversions.USD) {
    printOutput("Something went wrong! Please try again later.");
    return;
  }
  printOutput("");
  document.querySelector("div").append(document.getElementById("output"));
  const currencyList = document.querySelector("select");
  Object.keys(currencyConversions).forEach(function(val) {
    const newOption = document.createElement("option");
    newOption.value = val;
    newOption.innerText = val;
    currencyList.append(newOption);
  });
  document.querySelector("div").classList.remove("hidden");
  document.querySelector("form").addEventListener("submit", function() {
    event.preventDefault();
    displayExchangeRate(document.querySelector("#currency").value, parseFloat(document.querySelector("#amount").value), currencyConversions);
  });
}

window.addEventListener("load", function() {
  printOutput("Loading, please wait...");
  getExchangeRates();
});