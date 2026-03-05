const billInput = document.getElementById('bill');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('people');
const tipButtons = document.querySelectorAll('.tip-btn');
const peopleErrorMsg = document.getElementById('people-error-msg');
const tipAmountDisplay = document.getElementById('tip-amount');
const totalAmountDisplay = document.getElementById('total-amount');
const resetBtn = document.getElementById('reset-btn');

let billValue = 0.0;
let tipValue = 0.0;
let peopleValue = 0;


billInput.addEventListener('input', handleBillInput);
customTipInput.addEventListener('input', handleCustomTipInput);
peopleInput.addEventListener('input', handlePeopleInput);
tipButtons.forEach(btn => {
  btn.addEventListener('click', handleTipButtonClick);
});
resetBtn.addEventListener('click', resetCalculator);


function handleBillInput(e) {
  billValue = parseFloat(e.target.value);
  if (isNaN(billValue)) billValue = 0.0;
  calculate();
}

function handleCustomTipInput(e) {
  // Remove active styling from buttons
  tipButtons.forEach(btn => {
    btn.classList.remove('bg-strong-cyan', 'text-very-dark-cyan');
    btn.classList.add('bg-very-dark-cyan', 'text-white');
  });

  tipValue = parseFloat(e.target.value);
  if (isNaN(tipValue)) tipValue = 0.0;

  calculate();
}

function handleTipButtonClick(e) {
  // Clear custom input
  customTipInput.value = '';

  // Set active class styling
  tipButtons.forEach(btn => {
    btn.classList.remove('bg-strong-cyan', 'text-very-dark-cyan');
    btn.classList.add('bg-very-dark-cyan', 'text-white');
  });
  e.target.classList.remove('bg-very-dark-cyan', 'text-white');
  e.target.classList.add('bg-strong-cyan', 'text-very-dark-cyan');

  tipValue = parseFloat(e.target.dataset.tip);

  calculate();
}

function handlePeopleInput(e) {
  peopleValue = parseInt(e.target.value);
  if (isNaN(peopleValue)) peopleValue = 0;

  if (peopleValue <= 0 && e.target.value !== '') {
    peopleErrorMsg.classList.remove('hidden');
    peopleInput.classList.remove('border-transparent');
    peopleInput.classList.add('border-error');
  } else {
    peopleErrorMsg.classList.add('hidden');
    peopleInput.classList.add('border-transparent');
    peopleInput.classList.remove('border-error');
  }

  calculate();
}

// Logic
function calculate() {
  if (billValue > 0 || tipValue > 0 || peopleValue > 0 || customTipInput.value !== '' || billInput.value !== '') {
    resetBtn.disabled = false;
  } else {
    resetBtn.disabled = true;
  }

  if (peopleValue > 0) {
    const tipAmount = (billValue * (tipValue / 100)) / peopleValue;
    const totalAmount = (billValue + (billValue * (tipValue / 100))) / peopleValue;

    tipAmountDisplay.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
  } else {
    tipAmountDisplay.textContent = '$0.00';
    totalAmountDisplay.textContent = '$0.00';
  }
}

function resetCalculator() {
  billInput.value = '';
  customTipInput.value = '';
  peopleInput.value = '';

  tipButtons.forEach(btn => {
    btn.classList.remove('bg-strong-cyan', 'text-very-dark-cyan');
    btn.classList.add('bg-very-dark-cyan', 'text-white');
  });

  peopleErrorMsg.classList.add('hidden');
  peopleInput.classList.add('border-transparent');
  peopleInput.classList.remove('border-error');

  billValue = 0.0;
  tipValue = 0.0;
  peopleValue = 0;

  tipAmountDisplay.textContent = '$0.00';
  totalAmountDisplay.textContent = '$0.00';

  resetBtn.disabled = true;
}
