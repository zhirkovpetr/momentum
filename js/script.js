import playList from './playList.js';

window.addEventListener("DOMContentLoaded", () => {
  const time = document.querySelector('.time');
  const data = document.querySelector('.date');
  const greeting = document.querySelector('.greeting');
  const name = document.querySelector('.name');
  const body = document.querySelector('body');
  const slideNext = document.querySelector('.slide-next');
  const slidePrev = document.querySelector('.slide-prev');
  const weatherIcon = document.querySelector('.weather-icon');
  const temperature = document.querySelector('.temperature');
  const weatherDescription = document.querySelector('.weather-description');
  const city = document.querySelector('.city');
  const quote = document.querySelector('.quote');
  const author = document.querySelector('.author');
  const changeQuote = document.querySelector('.change-quote');
  const weatherWindSpeed = document.querySelector('.wind');
  const weatherHumidity = document.querySelector('.humidity');
  const playBtn = document.querySelector('.play');
  const btnNext = document.querySelector('.play-next');
  const btnPrev = document.querySelector('.play-prev');
  const playListContainer = document.querySelector('.play-list');
  const playItem = document.querySelector('.play-item');
  const audio = new Audio();
  let isPlay = false;
  let i = 0;
  let playNum = 0;
  let randomNum = getRandomNum();

  getWeather();
  getName();
  showTime();
  getQuotes();
  slideNext.addEventListener('click', getSlideNext)
  slidePrev.addEventListener('click', getSlidePrev)
  city.addEventListener('change', getWeather);
  window.addEventListener('beforeunload', setName)
  changeQuote.addEventListener('click', getQuotesnext);

  function showTime() {
    const date = new Date();
    time.textContent = date.toLocaleTimeString();
    showDate()
    showGreeting()
    setTimeout(showTime, 1000);
  }

  function showDate() {
    const date = new Date();
    const options = {weekday: 'long', day: 'numeric', month: 'long'};
    data.textContent = date.toLocaleDateString('en-US', options);
  }

  function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    if (hours < 6) {
      return 'night'
    } else if (hours < 12) {
      return 'morning'
    } else if (hours < 18) {
      return 'afternoon'
    } else if (hours < 24) {
      return 'evening'
    }
  }

  function showGreeting() {
    const timeOfDay = getTimeOfDay();
    greeting.textContent = `Good ${timeOfDay}`;
  }

  /*сохранение введенного имени */
  function setName() {
    try {
      localStorage.setItem('name', name.value);
    } catch (e) {
      console.log(e)
    }
  }


  function getName() {
    try {
      name.value = localStorage.getItem('name') || ''
    } catch (e) {
      console.log(e)
    }
  }

  /*слайдер*/

  /*Ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения*/
  function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = String(getRandomNum(1, 20)).padStart(2, '0')
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    img.onload = () => {
      body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`
    };
  }

  /*Изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана*/
  function getSlideNext() {
    randomNum = randomNum > 20 ? 1 : randomNum + 1
    setBg()
  }


  function getSlidePrev() {
    randomNum = randomNum > -1 ? 20 : randomNum - 1
    setBg()
  }

  /*Погода*/
  async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=ru&appid=e612e6250fdb37b14c30611dad255a26&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherWindSpeed.textContent = `Wind speed: ${data.wind.speed}m/s`
    weatherHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  }



  /*Плавная смена фоновых изображений*/
  function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*    Виджет "цитата дня"*/
  async function getQuotes() {
    const res = await fetch('assets/data.json');
    const data = await res.json();
    quote.textContent = data[i].text
    author.textContent = data[i].author
  }

  function getQuotesnext() {
    i = i < 2 ? i+1 : 0
    getQuotes()
  }

  /*плеер*/

  function togglePlay() {
    isPlay ? pauseAudio() : playAudio();
  }

  function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
    playBtn.classList.remove('play');
    playBtn.classList.add('pause');
  }

  function pauseAudio() {
    audio.pause();
    isPlay = false
    playBtn.classList.remove('pause');
    playBtn.classList.add('play');
  }

  playBtn.addEventListener('click', togglePlay);

  function playPrev() {
    playNum = playNum > 0 ? playNum-- : playNum = playList.length - 1
    playAudio()
  }

  btnPrev.addEventListener('click', playPrev)

  function playNext() {
    playNum = playNum < playList.length - 1 ? playNum + 1 : 0
    playAudio()
  }

  btnNext.addEventListener('click', playNext)

  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add(`play-item`)
    li.textContent = playList[i].title
    playListContainer.append(li)
  }
       /*let classesToAdd = [ 'play-item', 'item-active' ]
       isPlay ? playItem.classList.add(`play-item`) : playItem.classList.add(...classesToAdd)*/

});
