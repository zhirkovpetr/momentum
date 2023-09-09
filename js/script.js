const time = document.querySelector('.time');

function showTime() {
  const date = new Date();
  time.textContent = date.toLocaleTimeString();
  setTimeout(showTime, 1000);
}
showTime();
