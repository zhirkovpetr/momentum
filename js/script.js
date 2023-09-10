window.addEventListener("DOMContentLoaded", () => {
  const time = document.querySelector('.time');
  const data = document.querySelector('.date');
  const greeting = document.querySelector('.greeting');
  const name = document.querySelector('.name');
  const body = document.querySelector('body');
  const slideNext = document.querySelector('.slide-next');
  const slidePrev = document.querySelector('.slide-prev');
  let randomNum = getRandomNum();

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

  /*Плавная смена фоновых изображений*/
  function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});
