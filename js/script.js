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
const playListContainer = document.querySelector('.play-list');
const buttonSettings = document.querySelector('.button-settings');
const table = document.querySelector('.table');
const audio = new Audio();
let randomNum = 1;
let isPlay = false;
let i = 0;
let playNum = 0;
let state = {
  language: "en",
  photoSource: {source: 'github', tag: ''},
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio']
}

window.addEventListener("DOMContentLoaded", getWeather)
window.addEventListener("DOMContentLoaded", getName)
window.addEventListener("DOMContentLoaded", showTime)
window.addEventListener("DOMContentLoaded", getQuotes)
window.addEventListener("DOMContentLoaded", setBg)
slideNext.addEventListener('click', getSlideNext)
slidePrev.addEventListener('click', getSlidePrev)
city.addEventListener('change', changeCityHandler);
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
  greeting.textContent = `${greetingTranslation[timeOfDay][state.language]}`;
}

/*-----------------------------Name----------------------------*/
function getName() {
  try {
    name.value = localStorage.getItem('name') || ''
  } catch (e) {
    console.log(e)
  }
}

/*---------------------------------------------------------------*/

/*-----------------------------Image----------------------------*/
async function getLinkToImage(source, tag) {
  try{
    if (source === "unsplash") {
      const res = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=1vT6OWQA7ERb719rz7EqvBfhkLYTsh6QzXO54nJQulg`);
      const data = await res.json();
      return data.urls.regular;
    } else if (source === "flickr") {
      const res = await fetch('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=c2a7c5fc26b1cde466a73b794a5531ef&tags=nature&extras=url_h&format=json&nojsoncallback=1');
      const data = await res.json();
      return data.photos.photo[randomNum].url_h;
    }
  }
  catch (e) {
    console.log(e)
  }
}

async function setBg() {
  try {
    const date = new Date();
    let timeOfDay = getTimeOfDay(date);
    let bgNum = String(randomNum).padStart(2, '0')
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
  catch (e) {
    console.log(e)
  }
}

/*Изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана*/
function getSlideNext() {
  randomNum = randomNum === 20 ? randomNum= 1 : randomNum= randomNum + 1
  setBg()
}

function getSlidePrev() {
  randomNum = randomNum === 1 ? randomNum= 20 : randomNum= randomNum - 1
  setBg()
}

/*-----------------------------Weather----------------------------*/
const value = city.value;
city.value = value ? value : defaultData.defaultCity[state.language];

async function getWeather() {
  try {
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
  catch (e) {
    console.log(e)
  }
}

function changeCityHandler() {
  const value = city.value;
  city.value = value ? value : defaultData.defaultCity[state.language];
  getWeather();
}

/*-----------------------------Quotes----------------------------*/
async function getQuotes() {
  try{
    const res = await fetch('assets/data.json');
    const data = await res.json();
    quote.textContent = data[i].text[state.language]
    author.textContent = data[i].author[state.language]
    return data
  }
  catch (e) {
    console.log(e)
  }
}


function getQuotesnext() {
  i = i < 2 ? i + 1 : 0
  getQuotes()
}

/*translate quotes*/

export async function translateQuotes() {
  try{
    const data = await getQuotes();
    const quotes = quote.textContent;
    const currentLang = state.language;
    const changeLang = currentLang === "en" ? "ru" : "en";
    const index = data.findIndex((item) => item.text[changeLang] === quotes);
    if (index !== -1) {
      quote.textContent = data[index].text[currentLang];
      author.textContent = data[index].author[currentLang];
    }
  }
  catch (e) {
    console.log(e)
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

function openSettings() {
  table.classList.toggle('visible')
}

buttonSettings.addEventListener('click', openSettings)


const languageInput = document.querySelectorAll('input[name="languages"]');

const photoSource = document.querySelectorAll(
  'input[name="picture"]',
);
const unsplashInput = document.querySelector('.unsplash');
const flickrInput = document.querySelector('.flickr');

const blocks = document.querySelectorAll('input[type="checkbox"]');

/* ******************** */

function translateData() {
  let currentLang = state.language
  name.placeholder = defaultData.namePlaceholder[currentLang];
  city.placeholder = defaultData.cityPlaceholder[currentLang];
  document.querySelectorAll('.image-src').forEach((input) => (input.placeholder = defaultData.tagPlaceholder[currentLang]));
  document.querySelector('.language').firstChild.textContent = settingsLanguages.language[currentLang];
  document.querySelector('.photoSources').firstChild.textContent = settingsLanguages.photoSources[currentLang];
  document.querySelector('.blocks').firstChild.textContent = settingsLanguages.show[currentLang];
  let showItem = document.querySelectorAll('.show-item')
  showItem.forEach((item, i) => {
    item.firstChild.textContent = settingsLanguages.blocks[i][currentLang]
  });
}

export function setLanguages() {
  showDate();
  translateQuotes();
  translatePlayer();
  translateData();
  const value = city.value;
  if (value === 'Minsk' || value === 'Минск') {
    city.value = defaultData.defaultCity[state.language];
  } else {
    city.value = this.value
  }
  getWeather();
}

function changeLanguages() {
  state.language = this.value;
  setLanguages();
}

function changeBlocksChecked(name) {
  if (name === 'time') {
    time.classList.toggle('invisible');
  } else if (name === 'date') {
    data.classList.toggle('invisible');
  } else if (name === 'greeting') {
    document.querySelector('.greeting-container').classList.toggle('invisible');
  } else if (name === 'quote') {
    quote.classList.toggle('invisible');
    author.classList.toggle('invisible');
    changeQuote.classList.toggle('invisible');
  } else if (name === 'weather') {
    document.querySelector('.weather').classList.toggle('invisible');
  } else if (name === 'audio') {
    document.querySelector('.player').classList.toggle('invisible');
  } else {
    console.log(`You switched the language to ${state.language}.`);
  }
}

function setBlocksChecked(name, visible) {
  if (name === "time") {
    visible ? time.classList.remove('invisible') : time.classList.add('invisible');
  } else if (name === "date") {
    visible ? data.classList.remove('invisible') : data.classList.add('invisible');
  } else if (name === "greeting") {
    visible ? greeting.classList.remove('invisible') : greeting.classList.add('invisible');
  } else if (name === "quote") {
    visible ? quote.classList.remove('invisible') : quote.classList.add('invisible');
    visible ? author.classList.remove('invisible') : author.classList.add('invisible');
    visible ? changeQuote.classList.remove('invisible') : changeQuote.classList.add('invisible');
  } else if (name === "weather") {
    let weather = document.querySelector('.weather');
    visible ? weather.classList.remove('invisible') : weather.classList.add('invisible');
  } else if (name === "audio") {
    let player = document.querySelector('.player');
    visible ? player.classList.remove('invisible') : player.classList.add('invisible');
  } else {
    console.log(`sorry, there is no input ${name}.`);
  }
}

function changeBlocksCheckedAndState() {
  changeBlocksChecked(this.name);
  state.blocks = Array.from(blocks).reduce((array, input) => {
    if (input.checked) {
      array.push(input.name);
    }
    return array;
  }, []);
}

function changeTag() {
  state.photoSource.tag = this.value.trim();
  setBg();
}

function changeImagesSources() {
  const source = this.value;
  state.photoSource.source = source;

  const tagInput = document.querySelector(`.${source}`);
  if (tagInput) {
    state.photoSource.tag = tagInput.value;
  }
  setBg();
}

/* ******************** */

languageInput.forEach((input) => input.addEventListener('change', changeLanguages));
photoSource.forEach((input) =>
  input.addEventListener('change', changeImagesSources),
);
blocks.forEach((input) =>
  input.addEventListener('change', changeBlocksCheckedAndState),
);
unsplashInput.addEventListener('change', changeTag);
flickrInput.addEventListener('change', changeTag);

/* *********local storage*********** */

function setDataToLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('image', body.style.backgroundImage);
  localStorage.setItem('quote', quote.value);
  localStorage.setItem('author', author.value);
  localStorage.setItem('city', city.value ? city.value : defaultData.defaultCity[state.language]);
  localStorage.setItem('settings', JSON.stringify(state));
}

function getDataFromLocalStorage() {
  if (localStorage.getItem('name')) {
    name.value = localStorage.getItem('name');
  }
  if (localStorage.getItem('image')) {
    body.style.backgroundImage= localStorage.getItem('image');
  }
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
    getWeather();
    if (localStorage.getItem('quote')) {
      quote.value = localStorage.getItem('quote');
    }

    if (localStorage.getItem('author')) {
      author.value = localStorage.getItem('author');
    }
    if (localStorage.getItem('settings')) {
      state = JSON.parse(localStorage.getItem('settings'));

      languageInput.forEach((inputLang) => {
        inputLang.checked = false;
        if (inputLang.value === state.language) {
          inputLang.checked = true;
          setLanguages();
        }
      });
    }
  }
  photoSource.forEach((inputPhotoSource) => {
    inputPhotoSource.checked = false;
    if (inputPhotoSource.value === state.photoSource.source) {
      inputPhotoSource.checked = true;
      const tagInput = document.querySelector(`.${state.photoSource.source}`);
      if (tagInput) {
        tagInput.value = state.photoSource.tag;
      }
      setBg();
    }
  });
  blocks.forEach((inputBlock) => {
    inputBlock.checked = false;
    if (state.blocks.includes(inputBlock.name)) {
      inputBlock.checked = 'checked';
      setBlocksChecked(inputBlock.name, true);
    } else {
      setBlocksChecked(inputBlock.name, false);
    }
  });
}

window.addEventListener('beforeunload', setDataToLocalStorage);
window.addEventListener('load', getDataFromLocalStorage);
