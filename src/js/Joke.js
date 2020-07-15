import create from './utils/create';
import * as localStorage from './localStorage';
import * as constants from './constants/constants';


export default class Joke {
  constructor({
    categories,
    id,
    updated_at,
    url,
    value,
  }, isFavourite = 'false') {
    this.id = id;
    this.joke = value;
    this.time = updated_at;
    this.url = url;
    this.category = categories[0] || '';
    this.isFavourite = isFavourite;
  }

  calculateHours() {
    const now = Date.now();
    const updatedAt = new Date(this.time);
    const millisecondsInSecond = 1000;
    const secondsInHour = 3600;
    this.time = Math.round((now - updatedAt) / (millisecondsInSecond * secondsInHour));
  }

  render() {
    this.calculateHours();
    let categoryMarkup = '';

    if (this.category) {
      categoryMarkup = create('div', ['category-container', 'category-container_on-card', 'center'], null,
        create('div', ['category'], null, `${this.category}`));
    }

    let heartElement = '';
    if (localStorage.checkIfInLocalStorage(this.id)) {
      heartElement = create('img', ['joke-card__heart'], { src: constants.FILLED_HEART_ICON_PATH });
    } else {
      heartElement = create('img', ['joke-card__heart'], { src: constants.HEART_ICON_PATH });
    }

    const markup = create('div', ['joke-card'], null, [heartElement,
      create('div', ['joke-card__msg-icon-container', 'center'], null,
        create('img', ['joke-card__msg-icon'], { src: './src/assets/img/message.svg' })),
      create('div', ['joke-card__info'], null, [
        create('div', ['joke-card__id'], null, `ID: <a class="joke-card__number" href=${this.url} target="_blank" >${this.id}</a>`),
        create('div', ['joke-card__joke'], null, `${this.joke}`),
        create('div', ['joke-card__additional-info'], null, [
          create('div', ['joke-card__time'], null, `Last update: ${this.time} hours ago`), categoryMarkup,
        ]),
      ]),
    ], null, { id: `${this.id}` });


    return markup;
  }
}
