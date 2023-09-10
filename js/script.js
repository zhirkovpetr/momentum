const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');

function showTime() {
  const dateTime = new Date();
  time.textContent = dateTime.toLocaleTimeString();
  showDate()
  showGreeting()
  setTimeout(showTime, 1000);
}

showTime();

function showDate() {
  let dateDate = new Date();
  const options = {weekday: 'long', day: 'numeric', month: 'long'};
  date.textContent = dateDate.toLocaleDateString('en-US', options);
}

function showGreeting() {
  const date = new Date();
  const hours = date.getHours();


  if(hours < 6){
    greeting.textContent= 'Good evening'
  } else if(hours < 12){
    greeting.textContent= 'Good morning'
  }else if(hours < 18){
    greeting.textContent= 'Good day'
  }else if(hours < 24){
    greeting.textContent= 'Good evening'
  }
}

/*сохранение введенного имени */
function setLocalStorage() {
  localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
}
window.addEventListener('load', getLocalStorage)
