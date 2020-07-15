import * as constants from './constants/constants';
import * as localStorage from './localStorage';
import sendRequest from './request';


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

  favouritesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('joke-card__heart')) {
      const cardNode = e.target.closest('.joke-card');
      const identificator = cardNode.dataset.id;
      cardNode.remove();
      document.querySelector(`.jokes>.joke-card[data-id=${identificator}]> .joke-card__heart`).src = constants.HEART_ICON_PATH;
    }
  });


  jokes.addEventListener('click', (e) => {
    if (e.target.classList.contains('joke-card__heart')) {
      const cardNode = e.target.closest('.joke-card');
      const { id } = cardNode.dataset;
      const value = cardNode.querySelector('.joke-card__joke').innerHTML;
      const updated_at = cardNode.querySelector('.joke-card__time').innerHTML;
      const cat = cardNode.querySelector('.category') ? [cardNode.querySelector('.category').innerHTML] : [];
      const url = cardNode.querySelector('.joke-card__number').href;

      if (e.target.src.includes('heart.svg')) {
        e.target.src = constants.FILLED_HEART_ICON_PATH;
      } else {
        e.target.src = constants.HEART_ICON_PATH;
      }

      const cardNodeClone = cardNode.cloneNode(true);
      if (favourites.querySelector(`.joke-card[data-id='${id}']`)) {
        favourites.querySelector(`.joke-card[data-id='${id}']`).remove();
      } else {
        favouritesList.append(cardNodeClone);
      }

      if (e.target.closest('.favourites')) {
        document.querySelector(`.jokes .joke-card[data-id=${id}] joke-card__heart`).calssList.toggle('.joke-card__heart_favourite');
      }
      const jokeObj = {};
      jokeObj.categories = cat;
      jokeObj.id = id;
      jokeObj.updated_at = updated_at;
      jokeObj.url = url;
      jokeObj.value = value;

      localStorage.updateLocalStorage(jokeObj);
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
          searchField.autofocus = true;
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
            requestLink = `${constants.REQUEST_SEARCH_URI}${searchInput}`;
            break;
          default:
            break;
        }
      }
    });

    sendRequest(requestLink);
  });


  searchField.addEventListener('input', () => {
    if (searchField.validity.tooShort) {
      searchField.setCustomValidity(constants.QUERY_LENGTH_MSG);
    } else {
      searchField.setCustomValidity('');
    }
  });
}
