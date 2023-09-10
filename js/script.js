const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');

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

function getTimeOfDay() {
const date = new Date();
const hours = date.getHours();

if (hours < 6) {
    return 'evening'
  } else if (hours < 12) {
    return 'morning'
  }else if (hours < 18) {
    return 'day'
  }else if (hours < 24) {
    return 'evening'
  }
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  greeting.textContent = `Good ${timeOfDay}`;
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


/*слайдер*/
function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
  let timeOfDay= getTimeOfDay();
  let bgNum= getRandomNum(1, 20);
  if(bgNum < 10){
    bgNum.padStart(2,'0')
  }
  body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
}
setBg()
