import Joke from './Joke';

export function updateLocalStorage(jokeObj) {
  const { id } = jokeObj;
  if (window.localStorage.getItem(id)) {
    window.localStorage.removeItem(id);
    return;
  }
  window.localStorage.setItem(id, JSON.stringify(jokeObj));
}

export function checkIfInLocalStorage(key) {
  return key in window.localStorage;
}
export function getLocalStorage() {
  if (window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function renderLocalStorage() {
  const storage = getLocalStorage();
  if (storage) {
    const favouritesList = document.querySelector('.favourites-list');
    Object.values(storage).forEach((obj) => {
      const joke = new Joke(JSON.parse(obj));
      favouritesList.append(joke.render());
    });
  }
}
