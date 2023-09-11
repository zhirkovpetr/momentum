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
  const weatherWindSpeed = document.querySelector('.weather-wind-speed');
  const weatherHumidity = document.querySelector('.weather-humidity');
  const city = document.querySelector('.city');
  const quote = document.querySelector('.quote');
  const author = document.querySelector('.author');
  const changeQuote = document.querySelector('.change-quote');
  let randomNum = getRandomNum();
  let i = 0;

  getName();
  showTime();
  slideNext.addEventListener('click', getSlideNext)
  slidePrev.addEventListener('click', getSlidePrev)
  window.addEventListener('beforeunload', setName)

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

  getWeather()
  city.addEventListener('change', getWeather);

  /*Плавная смена фоновых изображений*/
  function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*    Виджет "цитата дня"*/
  const quotes = [
    {
      "text": "Пишите код так, как будто сопровождать его будет склонный к насилию психопат, который знает, где вы живете",
      "author": "Стив Макконнелл"
    },
    {
      "text": "Сложность программы растет до тех пор, пока не превысит способности программиста",
      "author": "Артур Блох. Законы Мэрфи"
    },
    {
      "text": "Ходить по воде и разрабатывать программы, следуя ТЗ, очень просто… если они заморожены",
      "author": "И. Берард"
    }
  ]

  async function getQuotes() {
    /*const res = await fetch('assets/data.json');
    const data = await res.json();
    quote.textContent = data[i].text
    author.textContent = data[i].author*/
    const data = quotes[Math.floor(Math.random() * quotes.length)];
    quote.textContent = data.text;
    author.textContent = data.author;
  }

/*  function getQuotesnext() {
    i = i < 2 ? i+1 : 0
    getQuotes()
  }*/

  getQuotes();

  changeQuote.addEventListener('click', getQuotes);
});
