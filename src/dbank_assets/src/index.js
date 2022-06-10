import { dbank } from "../../declarations/dbank";

window.addEventListener("load", loadBalance);

// adapt the loadBalance function to take in async input from the checkBalance function
async function loadBalance() {
  update();
}

// listen when user submit the form (whether to deposit or withdraw from account)
document.querySelector("form").addEventListener("submit", checkSubmit);

// async function for checkSubmit
async function checkSubmit(event) {
  // prevent the auto clearing of the form on submit
  event.preventDefault();
  console.log("Finalise Transaction button is clicked. Form is submitted");

  // query for the event submit button with id submit-btn
  const button = event.target.querySelector("#submit-btn");

  // get the keyed in values for withdrawal and deposit input fields
  // need to convert inputAmount and withdrawAmount to float as the topUp function take in float64
  // use parseFloat to convert
  // ensure the input fields are actually numbers
  const inputAmount = parseFloat(
    Number(document.getElementById("input-amount").value)
  );

  const withdrawAmount = parseFloat(
    Number(document.getElementById("withdrawal-amount").value)
  );

  button.setAttribute("disabled", true);

  // the conditionals prevent NaN value being added to the blockchain due to the other field being empty
  // conditional to check for deposit
  if (inputAmount) {
    await dbank.topUp(inputAmount);
    // clearing input after the transaction goes through in the block chain
    document.getElementById("input-amount").value = "";
  }

  // conditional to check for withdrawal
  if (withdrawAmount) {
    await dbank.withdraw(withdrawAmount);
    // clearing output after the transaction goes through in the block chain
    // reset after it is updated
    document.getElementById("withdrawal-amount").value = "";
  }

  // compound the value after deposit or withdrawal
  await dbank.compound();

  // call update function
  update();

  button.removeAttribute("disabled");
}

// async function to handle to repeat update value
async function update() {
  // checkBalance after submit function

  // make the balance interactive not hardcoded
  // await so that the currentAmount will not default to
  // the $[object Promise] when the query results not back yet
  // math.round to round to nearest integer multiply initial currentAmount by 100
  // then divide by 100 to get 2dp
  const currentAmount = await dbank.checkBalance();
  document.getElementById("value").innerText =
    Math.round(currentAmount * 100) / 100;
}
