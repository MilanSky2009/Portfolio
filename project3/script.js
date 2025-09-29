const clearButton = document.getElementById('clear');
const display = document.getElementById('display');
let currentInput = "";

clearButton.addEventListener('click', () => {
  currentInput = '';
  display.value = '';
});