import Joke from './Joke';
import create from './utils/create';
import * as constants from './constants/constants';


export default async function sendRequest(uri) {
  const jokesContainer = document.querySelector('.jokes');
  const loader = create('div', ['message'], null, constants.LOADER_MSG);
  let messageHolder = document.querySelector('.message');
  if (messageHolder) {
    messageHolder.replaceWith(loader);
  } else {
    jokesContainer.prepend(loader);
  }

  try {
    const response = await fetch(uri);

    if (response.ok) {
      const jokesData = await response.json();
      if (jokesData.value) {
        jokesContainer.innerHTML = '';
        const jokeCard = new Joke(jokesData);
        jokesContainer.append(jokeCard.render());

      } else if (jokesData.total) {
        jokesContainer.innerHTML = '';
        jokesData.result.forEach((joke) => {
          const jokeCard = new Joke(joke);
          jokesContainer.append(jokeCard.render());
        });

      } else if (jokesData.total === 0) {
        const message = create('div', ['message'], null, constants.NO_RESULTS_MSG);
        jokesContainer.innerHTML = '';
        messageHolder = document.querySelector('.message');
        if (messageHolder) {
          messageHolder.replaceWith(message);
        } else {
          jokesContainer.prepend(message);
        }
      }
    }

  } catch (err) {
    const errorMessage = create('div', ['message'], null, err);
    const connectionLostMessage = create('div', ['message'], null, constants.NO_INTERNET_MSG);
    messageHolder = document.querySelector('.message');

    if (!window.navigator.onLine) {
      if (messageHolder) {
        messageHolder.replaceWith(connectionLostMessage);
      } else {
        jokesContainer.prepend(connectionLostMessage);
      }

    } else if (messageHolder) {
      messageHolder.replaceWith(errorMessage);
    } else {
      jokesContainer.prepend(errorMessage);
    }
  }
}
