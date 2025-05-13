// DOM Elements
const inputBox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');

// Expression and Result
let expression = '';
let result = '';

// Load click sound
const clickSound = new Audio('click.wav'); // make sure to have this file in the same directory

// Button Click Event Handler
function buttonClick(event) {
  const target = event.target;

  if (!target.classList.contains('btn')) return;

  const action = target.dataset.action;
  const value = target.dataset.value;

  // Play click sound
  clickSound.currentTime = 0;
  clickSound.play();

  // Trigger vibration
  if (navigator.vibrate) navigator.vibrate(30);

  // Animate button press
  animateButton(target);

  // Perform calculator actions
  switch (action) {
    case 'number':
      addValue(value);
      break;
    case 'clear':
      clear();
      break;
    case 'backspace':
      backspace();
      break;
    case 'addition':
    case 'subtraction':
    case 'multiplication':
    case 'division':
      if (expression === '' && result !== '') {
        startFromResult(value);
      } else if (expression !== '' && !isLastCharOperator()) {
        addValue(value);
      }
      break;
    case 'submit':
      submit();
      break;
    case 'negate':
      negate();
      break;
    case 'mod':
      percentage();
      break;
    case 'decimal':
      decimal(value);
      break;
  }

  updateDisplay(expression, result);
}

// Add Click Listener
inputBox.addEventListener('click', buttonClick);

// Animation Function
function animateButton(button) {
  button.classList.add('pressed');
  setTimeout(() => {
    button.classList.remove('pressed');
  }, 150);
}

// Core Calculator Functions
function addValue(value) {
  expression += value;
}

function updateDisplay(expression, result) {
  expressionDiv.textContent = expression;
  resultDiv.textContent = result;
}

function clear() {
  expression = '';
  result = '';
}

function backspace() {
  expression = expression.slice(0, -1);
}

function isLastCharOperator() {
  return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
  expression = result + value;
}

function submit() {
  result = evaluateExpression();
  expression = '';
}

function evaluateExpression() {
  try {
    const evalResult = eval(expression);
    return isNaN(evalResult) || !isFinite(evalResult)
      ? ' '
      : evalResult < 1
      ? parseFloat(evalResult.toFixed(10))
      : parseFloat(evalResult.toFixed(2));
  } catch (e) {
    return 'Error';
  }
}

function negate() {
  if (expression === '' && result !== '') {
    result = -result;
  } else if (!expression.startsWith('-') && expression !== '') {
    expression = '-' + expression;
  } else if (expression.startsWith('-')) {
    expression = expression.slice(1);
  }
}

function percentage() {
  if (expression !== '') {
    result = evaluateExpression();
    expression = '';
    if (!isNaN(result) && isFinite(result)) {
      result /= 100;
    } else {
      result = '';
    }
  } else if (result !== '') {
    result = parseFloat(result) / 100;
  }
}

function decimal(value) {
  if (!expression.endsWith('.') && !isNaN(expression.slice(-1))) {
    addValue(value);
  }
}
