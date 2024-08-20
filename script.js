"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// FUNCTIONS //
// Initialization Function
const initApp = function () {
  containerApp.style.opacity = "0";
  setTimeout(() => {
    containerMovements.innerHTML =
      labelBalance.textContent =
      labelSumIn.textContent =
      labelSumOut.textContent =
      labelSumInterest.textContent =
        "";
    labelWelcome.textContent = "Log in to get started";
  }, 1000);
};
initApp();

// Functions for merge sorting
const merge = function (leftArr, rightArr, arr) {
  let i = 0,
    j = 0,
    k = 0;
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] < rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
  }
  while (i < leftArr.length) {
    arr[k++] = leftArr[i++];
  }
  while (j < rightArr.length) {
    arr[k++] = rightArr[j++];
  }
};

const mergeSort = function (arr, store = 0) {
  if (arr.length <= 1) return;
  const middleIndex = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, middleIndex);
  const rightArr = arr.slice(middleIndex);
  mergeSort(leftArr);
  mergeSort(rightArr);
  merge(leftArr, rightArr, arr);
  if (store) return arr;
};
////////////////////////////////////////////////

// Function for displaying movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  // Sorting Movements
  const movements = sort ? mergeSort(acc.movements.slice(), 1) : acc.movements;
  const order = new Map([]);
  if (!acc.movementsDates)
    acc.movementsDates = new Array(acc?.movements.length - 1);
  const dates = acc.movementsDates.slice().map(movDate => {
    const date = new Date(movDate);
    const now = new Date();
    if (date.getFullYear() !== now.getFullYear())
      return `${now.getFullYear() - date.getFullYear()} year-ago`;
    if (date.getMonth() !== now.getMonth())
      return `${now.getMonth() - date.getMonth()} month-ago`;
    if (date.getDate() !== now.getDate())
      return `${now.getDate() - date.getDate()} day-ago`;
    if (date.getHours() !== now.getHours())
      return `${now.getHours() - date.getHours()} hour-ago`;
    if (date.getMinutes() !== now.getMinutes())
      return `${now.getMinutes() - date.getMinutes()} minute-ago`;

    return "Now";
  });
  acc.movements.forEach((mov, i) => order.set(mov, i));
  // Displaying Movements
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      order.get(mov) + 1
    } ${type}</div>
          <div class="movements__date">${
            dates[order.get(mov)] ? dates[order.get(mov)] : "Not Specified"
          }</div>
          <div class="movements__value">${mov}€</div>
`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// Function for displaying account balance
const calculateBalance = acc => {
  // calculating accounts balance
  const balance = (acc.balance = acc.movements.reduce(
    (acc, mov) => acc + mov,
    0
  ));
  // displaying accounts balance
  labelBalance.textContent = `${balance}€`;
};

// Function for displaying summary of account balance
const calculateTotalDeposits = acc => {
  // calculating total deposits
  const deposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // displaying deposits
  labelSumIn.textContent = `${deposits}€`;
  // calculating total withdrawals
  const withdrawals = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${withdrawals}€`;

  const interest = (deposits * acc.interestRate) / 100;
  labelSumInterest.textContent = `${interest}€`;
};

// Function for creating accounts user names.
const createUserNames = accs =>
  accs.forEach(
    user =>
      (user.userName = user.owner
        .split(" ")
        .map(name => name[0])
        .join("")
        .toLowerCase())
  );
createUserNames(accounts);
let time = 10 * 60,
  timer;
// Function for updating UI
const updateUI = function (acc, sort = false) {
  // Display Movements
  displayMovements(acc, sort);
  // Display Balance
  calculateBalance(acc);
  // Display Summary
  calculateTotalDeposits(acc);
  const now = new Date();
  labelDate.textContent = new Intl.DateTimeFormat("en-US").format(now);
};

// Events Handlers //

// Login Event
let currentAccount;
let interval;
let sorted = false;
btnLogin.addEventListener("click", e => {
  // Prevent Form From Submiting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  if (String(currentAccount?.pin) === inputLoginPin.value) {
    // Clear Credentials Message
    document.querySelector(".wrong_credentials").style.opacity = "0";
    // Display Welcome Message and UI
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = "100%";
    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();
    updateUI(currentAccount);
    // Updating Current Account UI
    if (interval) clearInterval(interval);
    interval = setInterval(() => updateUI(currentAccount, sorted), 3000);
    // Time to log out
    time = 10 * 60;
    const tick = function () {
      if (time <= 0) {
        // Clearing Interval
        clearInterval(timer);
        // Displaying Log Out Message
        initApp();
      } else time--;
      labelTimer.textContent = `${String(Math.floor(time / 60)).padStart(
        2,
        0
      )}:${String(time % 60).padStart(2, 0)}`;
      return timer;
    };
    tick();
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  } else {
    // Hiding Current Account Info
    initApp();
    // Clearing Interval
    clearInterval(interval);
    // Displaying Wrong Credentials Message
    document.querySelector(".wrong_credentials").style.opacity = "100%";
  }
});

// Transfering Money
btnTransfer.addEventListener("click", e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (
    currentAccount.balance >= amount &&
    amount > 0 &&
    currentAccount.userName !== inputTransferTo.value
  ) {
    // Update Balance
    currentAccount.movements.push(-amount);
    reciverAccount?.movements.push(amount);
    // Push Date to Current Account
    currentAccount.movementsDates.push(new Date().toISOString());
    if (!reciverAccount.movementsDates)
      reciverAccount.movementsDates = new Array(
        reciverAccount?.movements.length - 1
      );
    // Push Data to Reciver Account
    reciverAccount?.movementsDates.push(new Date().toISOString());
    // Reseting Time
    time = 10 * 60;
    // Updating Current Account UI
    updateUI(currentAccount);
  }
  // Clear Input Fields
  inputTransferTo.value = inputTransferAmount.value = "";
});

// Requesting Loan
btnLoan.addEventListener("click", e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Update Balance
    currentAccount.movements.push(amount);
    // Push Date to Current Account
    currentAccount.movementsDates.push(new Date().toISOString());
    // Reseting Time
    time = 10 * 60;
    // Updating Current Account UI
    updateUI(currentAccount);
  }
  // Clear Input Field
  inputLoanAmount.value = "";
});

// Closing Account //
btnClose.addEventListener("click", e => {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    String(currentAccount.pin) === inputClosePin.value
  ) {
    // Getting Account Index in the array
    const index = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );
    // Removing Account from the array
    accounts.splice(index, 1);
    // Hiding Account Info
    containerApp.style.opacity = "0";
    clearInterval(interval);
    initApp();
    // Displaying Closing Message
    labelWelcome.textContent = "Account Closed Successfully!";
  }
  // Clear Input Fields
  inputCloseUsername.value = inputClosePin.value = "";
});

btnSort.addEventListener("click", e => {
  e.preventDefault();
  // Updating Current Account UI
  updateUI(currentAccount, !sorted);
  // Updating Sort Status
  sorted = !sorted;
});
