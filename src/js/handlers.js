import * as constants from './constants/constants';
import * as localStorage from './localStorage';
import sendRequest from './request';
import create from './utils/create';


export default function assignHandlers() {
  const jokes = document.querySelector('.jokes');
  const favourites = document.querySelector('.favourites');
  const form = document.querySelector('.form');
  const categories = document.querySelector('.categories');
  const searchField = document.querySelector('.input-field');

  const favouritesBtn = document.querySelector('.favourites-control');
  const favouritesList = document.querySelector('.favourites-list');
  const logo = document.querySelector('.logo');
  const wrapper = document.querySelector('.wrapper');
  const cover = document.querySelector('.cover');

  let selectedCategory = '';


  const elements = [
    favourites,
    favouritesBtn,
    favouritesList,
    logo,
    wrapper,
    cover,
  ];

  let isOpened = false;


  favouritesBtn.addEventListener('click', () => {
    if (!isOpened) {
      elements.forEach((el) => {
        el.classList.toggle('fav-is-opened');
      });
      isOpened = !isOpened;
    } else {
      elements.forEach((el) => {
        el.classList.toggle('fav-is-opened');
      });
      isOpened = !isOpened;
    }
  });

  function createObjectforLocalStorage(e) {
    const cardNode = e.target.closest('.joke-card');
    const { id } = cardNode.dataset;
    const value = cardNode.querySelector('.joke-card__joke').innerHTML;
    const updated_at = parseInt(cardNode.querySelector('.joke-card__time').innerHTML.match(/\d+/)[0], 0);
    const cat = cardNode.querySelector('.category') ? [cardNode.querySelector('.category').innerHTML] : [];
    const url = cardNode.querySelector('.joke-card__number').href;

    const jokeObj = {};
    jokeObj.categories = cat;
    jokeObj.id = id;
    jokeObj.updated_at = updated_at;
    jokeObj.url = url;
    jokeObj.value = value;
    localStorage.updateLocalStorage(jokeObj);
  }

  favouritesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('joke-card__heart')) {
      const cardNode = e.target.closest('.joke-card');
      const identificator = cardNode.dataset.id;
      cardNode.remove();
      const jokeListAnalogue = document.querySelector(`.jokes>.joke-card[data-id=${identificator}]> .joke-card__heart`);
      if (jokeListAnalogue) {
        jokeListAnalogue.src = constants.HEART_ICON_PATH;
      }

      createObjectforLocalStorage(e);
    }
  });


  jokes.addEventListener('click', (e) => {
    if (e.target.classList.contains('joke-card__heart')) {
      const cardNode = e.target.closest('.joke-card');


      if (e.target.src.includes('heart.svg')) {
        e.target.src = constants.FILLED_HEART_ICON_PATH;
      } else {
        e.target.src = constants.HEART_ICON_PATH;
      }

      const cardNodeClone = cardNode.cloneNode(true);
      const identificator = cardNode.dataset.id;
      if (favourites.querySelector(`.joke-card[data-id='${identificator}']`)) {
        favourites.querySelector(`.joke-card[data-id='${identificator}']`).remove();
      } else {
        favouritesList.append(cardNodeClone);
      }

      if (e.target.closest('.favourites')) {
        document.querySelector(`.jokes .joke-card[data-id=${identificator}] joke-card__heart`).calssList.toggle('.joke-card__heart_favourite');
      }

      createObjectforLocalStorage(e);
    }
  });


  const changeClass = (removeFrom, addTo, className) => {
    removeFrom.forEach((item) => {
      item.classList.remove(className);
    });
    if (addTo) {
      addTo.classList.add(className);
    }
  };


  form.addEventListener('change', (e) => {
    selectedCategory = '';
    if (e.target.type === 'radio') {
      switch (e.target.id) {
        case 'random':
          changeClass([categories, searchField], null, 'visible');
          break;
        case 'from-categories':
          changeClass([searchField], categories, 'visible');
          break;
        case 'search':
          changeClass([categories], searchField, 'visible');
          break;
        default:
          break;
      }
    }
  });


  categories.addEventListener('click', (e) => {
    const allCategories = document.querySelectorAll('.category-container');

    if (e.target.classList.contains('category')) {
      changeClass(allCategories, null, 'category-container_selected');
      selectedCategory = e.target.innerHTML;
      e.target.closest('.category-container').classList.add('category-container_selected');
    } else if (e.target.classList.contains('category-container')) {
      changeClass(allCategories, null, 'category-container_selected');
      selectedCategory = e.target.children[0].innerHTML;
      e.target.classList.add('category-container_selected');
    }
  });

  function checkValidity(input) {
    if (!/(\w+){3,}/.test(input)) {
      const invalid = create('div', ['message'], null, constants.QUERY_LENGTH_MSG);
      form.insertBefore(invalid, searchField);
      setTimeout(() => {
        invalid.remove();
      }, 2000);


      return false;
    }
    return true;
  }


  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const radioBtns = document.querySelectorAll('.radio-btn');
    const searchInput = document.querySelector('.input-field').value;


    let userChoice = '';
    let requestLink = '';
    radioBtns.forEach((button) => {
      if (button.checked === true) {
        userChoice = button.value;

        switch (userChoice) {
          case 'random':
            requestLink = constants.REQUEST_RANDOM_URI;
            break;
          case 'from-categories':
            requestLink = `${constants.REQUEST_RANDOM_FROM_CAT_URI}${selectedCategory}`;
            break;
          case 'search':
            if (checkValidity(searchInput)) {
              requestLink = `${constants.REQUEST_SEARCH_URI}${searchInput}`;
            } else {
              requestLink = '';
            }

            break;
          default:
            break;
        }
      }
    });

    if (requestLink) {
      sendRequest(requestLink);
    }
  });
}
