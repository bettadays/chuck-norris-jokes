import Joke from './Joke';
import create from './utils/create';


export async function sendRequest(uri) {
  const jokesContainer = document.querySelector('.jokes');
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
        const message = create('div', ['message'], null, 'Nothing found, try again');
        jokesContainer.prepend(message);
      }
    }
  } catch (err) {
    const errorMessage = create('div', ['message'], null, err);
    jokesContainer.prepend(errorMessage);
  }
}
