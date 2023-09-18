import playList from './playList.js';

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
const weatherWindSpeed = document.querySelector('.wind');
const weatherHumidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playBtn = document.querySelector('.play');
const btnNext = document.querySelector('.play-next');
const btnPrev = document.querySelector('.play-prev');
const audio = new Audio();
let randomNum = getRandomNum();
let isPlay = false;
let i = 0;
let playNum = 0;
const playListContainer = document.querySelector('.play-list');
//const allPlayListLI = document.querySelectorAll('.play-item');
//const imageSrcInput = document.querySelectorAll('.image-src-input');
const weather= document.querySelector('.weather');
const player= document.querySelector('.player');
const state = {
  language: "en",
  photoSource: {source: 'github', tag: ''},
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist']
}


window.addEventListener("DOMContentLoaded", getWeather)
window.addEventListener("DOMContentLoaded", getName)
window.addEventListener("DOMContentLoaded", showTime)
window.addEventListener("DOMContentLoaded", getQuotes)
window.addEventListener("DOMContentLoaded", setBg)


slideNext.addEventListener('click', getSlideNext)
slidePrev.addEventListener('click', getSlidePrev)
city.addEventListener('change', changeCityHandler);
window.addEventListener('beforeunload', setName)
changeQuote.addEventListener('click', getQuotesnext);

/*-----------------------------Time----------------------------*/
function showTime() {
  const date = new Date();
  time.textContent = date.toLocaleTimeString(state.language === "en" ? 'en-US' : 'ru-Ru');
  showDate()
  showGreeting(state.language)
  setTimeout(showTime, 1000);
}


function showDate() {
  const date = new Date();
  const options = {weekday: 'long', day: 'numeric', month: 'long'};
  data.textContent = date.toLocaleDateString(state.language === "en" ? 'en-US' : 'ru-Ru', options);
}

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();

  if (hours < 6) {
    return state.language === "en" ? 'night' : "ночи"
  } else if (hours < 12) {
    return state.language === "en" ? 'morning' : "утра"
  } else if (hours < 18) {
    return state.language === "en" ? 'afternoon' : "дня"
  } else if (hours < 24) {
    return state.language === "en" ? 'evening' : "вечера"
  }
}

let greetingTranslation = {
  en: "Good",
  ru: "Хорошего"
}

function showGreeting(language) {
  const timeOfDay = getTimeOfDay();
  greeting.textContent = `${timeOfDay === 'ночи' ? state.language === "ru" && "Хорошей" : greetingTranslation[language]}  ${timeOfDay}`;
}

/*-----------------------------Name----------------------------*/
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
export function translateName() {
  name.placeholder = defaultData.namePlaceholder[state.language];
}

/*---------------------------------------------------------------*/

/*-----------------------------Image----------------------------*/

async function getLinkToImage(source, tag) {
  if (source === "unsplash") {
    const res = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=1vT6OWQA7ERb719rz7EqvBfhkLYTsh6QzXO54nJQulg`);
    const data = await res.json();
    return data.urls.regular;
  } else if (source === "flickr") {
    const res = await fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c2a7c5fc26b1cde466a73b794a5531ef&tags=nature&extras=url_h&format=json&nojsoncallback=1');
    const data = await res.json();
    let bgNum = getRandomNum(0, data.photos.photo.length)
    return data.photos.photo[bgNum].url_h;
  }
}

async function setBg() {
  const date = new Date();
  let timeOfDay = getTimeOfDay(date);
  getRandomNum()
  let bgNum = String(getRandomNum(1, 20)).padStart(2, '0')
  const img = new Image();
  const photoSource = state.photoSource.source;
  const userTag = state.photoSource.tag;
  const tag = userTag ? userTag : timeOfDay;
  if (photoSource === 'github') {
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${tag}/${bgNum}.jpg`;
  } else {
    img.src = await getLinkToImage(photoSource, tag);
  }
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
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

/*-----------------------------Weather----------------------------*/
const value = city.value;
city.value = value ? value : defaultData.defaultCity[state.language];

async function getWeather() {
  const value = city.value;
  city.value = value ? value : defaultData.defaultCity[state.language];
  const currentLang = state.language;
  const currentCity = city.value ? city.value : defaultData.defaultCity[currentLang];

  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&lang=${currentLang}&appid=e612e6250fdb37b14c30611dad255a26&units=metric`);
  const data = await res.json();
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  weatherWindSpeed.textContent = `${defaultData.windSpeed[currentLang]}: ${data.wind.speed} ${defaultData.windSpeedUnits[currentLang]}`;
  weatherHumidity.textContent = `${defaultData.humidity[currentLang]}: ${data.main.humidity}%`;
}
function changeCityHandler() {
  const value = city.value;
  city.value = value ? value : defaultData.defaultCity[state.language];
  getWeather();
}
/*-----------------------------Quotes----------------------------*/

async function getQuotes() {
  const res = await fetch('assets/data.json');
  const data = await res.json();
  quote.textContent = data[i].text[state.language]
  author.textContent = data[i].author[state.language]
}

function getQuotesnext() {
  i = i < 2 ? i + 1 : 0
  getQuotes()
}

/*translate quotes*/

export async function translateQuotes() {
  const data = await getQuotes();
  // console.log(data);

  const quotes = quote.textContent;
  const currentLang = state.language;
  const changeLang = currentLang === "en" ? "ru" : "en";

  const index = data.findIndex((item) => item.text[changeLang] === quotes);

  if (index !== -1) {
    quote.textContent = data[index].text[currentLang];
    author.textContent = data[index].author[currentLang];
  }
}
/*---------------------------------------------------------------*/

/*----------------------------Audio Player----------------------------*/

function togglePlay() {
  isPlay ? pauseAudio() : playAudio();
}

function playAudio() {
  const allPlayListLI = document.querySelectorAll('.play-item');
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  audio.play();
  isPlay = true;
  playBtn.classList.remove('play');
  playBtn.classList.add('pause');
  allPlayListLI.forEach((li) => {
    li.classList.remove('item-active');
  });
  allPlayListLI[playNum].classList.add('item-active');
}

function createPlayList() {
  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add(`play-item`)
    li.textContent = playList[i].title[state.language]
    playListContainer.append(li)
  }
}

createPlayList()

function pauseAudio() {
  audio.pause();
  isPlay = false
  playBtn.classList.remove('pause');
  playBtn.classList.add('play');
}


playBtn.addEventListener('click', togglePlay);

function playPrev() {
  if (playNum === 0) {
    playNum = playList.length - 1;
  } else {
    playNum--;
  }
  playAudio()
}

btnPrev.addEventListener('click', playPrev)

function playNext() {
  playNum = playNum < playList.length - 1 ? playNum + 1 : 0
  playAudio()
}

btnNext.addEventListener('click', playNext)

/*translate*/
export function translatePlayer() {
  const allPlayListLI = document.querySelectorAll('.play-item');
  allPlayListLI.forEach((li, i) => {
    li.textContent = playList[i].title[state.language];
  });
}

/*--------------------------------------------------------------------*/

export function setLang() {
  showDate();
  translateQuotes();
  translatePlayer();
  translateName();
  const value = city.value;
  if (value === 'Minsk' || value === 'Минск') {
    city.value = defaultData.defaultCity[state.language];
  }
  getWeather();
}

function changeLang() {
  state.language = this.value;
  setLang();
}

function changeBlocksVisibility(name) {
  if(name === 'time'){
    time.classList.toggle('invisible');
  } else if (name === 'data'){
    data.classList.toggle('invisible');
  }else if (name === 'greeting'){
    greeting.classList.toggle('invisible');
  }else if (name === 'quotes'){
    quote.classList.toggle('invisible');
  }else if (name === 'weather'){
    weather.classList.toggle('invisible');
  }else if (name === 'audio'){
    player.classList.toggle('invisible');
  } else {
    console.log(`Sorry, no this input ${name}.`);
  }
}

export const blockInputs = document.querySelectorAll('input[type="checkbox"]');

function changeBlocksVisibilityAndInitState() {
  changeBlocksVisibility(this.name);

  state.blocks = Array.from(blockInputs).reduce((array, input) => {
    if (input.checked) {
      array.push(input.name);
    }
    return array;
  }, []);
}

function changeTag() {
  state.photoSource.tag = this.value;
  setBg();
}

function changeImageSource() {
  const source = this.value;
  state.photoSource.source = source;

  const tagInput = document.querySelector(`.${source}`);
  if (tagInput) {
    state.photoSource.tag = tagInput.value;
  }
  setBg();
}

export const langInputs = document.querySelectorAll('input[name="languages"]');
export const imageSourceInputs = document.querySelectorAll(
  'input[name="image-src"]',
);

const unsplashInput = document.querySelector('.unsplash');
const flickrInput = document.querySelector('.flickr');

langInputs.forEach((input) => input.addEventListener('change', changeLang));
imageSourceInputs.forEach((input) =>
  input.addEventListener('change', changeImageSource),
);
blockInputs.forEach((input) =>
  input.addEventListener('change', changeBlocksVisibilityAndInitState),
);
unsplashInput.addEventListener('change', changeTag);
flickrInput.addEventListener('change', changeTag);

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
