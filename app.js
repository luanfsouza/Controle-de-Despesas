let text = document.querySelector("#text");
let number = document.querySelector("#amount");
let adicionar = document.querySelector("#adicionar");

const transactionUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");

const form = document.querySelector("#form");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];
console.log(localStorageTransactions);
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  upDataLocalStorage();
  init();
  updateBalanceValues();
  console.log(transactions);
};

const addTransactionIntoDom = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const cssClass = transaction.amount < 0 ? "minus" : "plus";
  const li = document.createElement("li");
  li.classList.add(cssClass);
  li.innerHTML = `
    ${transaction.name} 
    <span>${operator} R$ ${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn" onClick="removeTransaction(${
    transaction.id
  })">x</button>
    `;
  transactionUl.append(li);
};
const getTotal = (amountDummy) =>
  amountDummy.reduce((accumulator, item) => accumulator + item, 0).toFixed(2);
const getIncome = (amountDummy) =>
  amountDummy
    .filter((amount) => amount > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);
const getExpenses = (amountDummy) =>
  Math.abs(
    amountDummy
      .filter((amount) => amount < 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2)
  );
const updateBalanceValues = () => {
  let amountDummy = transactions.map(({ amount }) => amount);
  balanceDisplay.textContent = `R$ ${getTotal(amountDummy)}`;
  incomeDisplay.textContent = `R$ ${getIncome(amountDummy)}`;
  expenseDisplay.textContent = `R$ ${getExpenses(amountDummy)}`;
};
updateBalanceValues();

const init = () => {
  transactionUl.innerHTML = "";
  transactions.forEach((ele) => {
    addTransactionIntoDom(ele);
  });
};
init();

const upDataLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionNumber) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionNumber),
  });
};

const clearInputs = () => {
  text.value = "";
  number.value = "";
};

const handleFormSubimit = (event) => {
  event.preventDefault();
  const transactionName = text.value.trim();
  const transactionNumber = number.value.trim();
  const isSomeInputEmpty = transactionName === "" || transactionNumber === "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha tanto o nome quanto o valor da transação");
    return;
  }

  addToTransactionsArray(transactionName, transactionNumber);
  init();
  updateBalanceValues();
  upDataLocalStorage();
  clearInputs();
};

form.addEventListener("submit", handleFormSubimit);
