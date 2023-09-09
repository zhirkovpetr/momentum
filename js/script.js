const time = document.querySelector('.time');
const date = document.querySelector('.date');

function showTime() {
  const dateTime = new Date();
  time.textContent = dateTime.toLocaleTimeString();
  showDate()
  setTimeout(showTime, 1000);
}

showTime();

function showDate() {
  let dateDate = new Date();
  const options = {weekday: 'long', day: 'numeric', month: 'long'};
  date.textContent = dateDate.toLocaleDateString('en-US', options);
}
