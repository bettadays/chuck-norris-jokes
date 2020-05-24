import 'babel-polyfill';

import create from './js/utils/create';
import { assignHandlers } from './js/handlers';
import * as constants from './js/constants/constants';


async function renderCategoriesList(uri) {
  const response = await fetch(uri);
  if (response.ok) {
    const categoriesData = await response.json();
    const categoriesContainer = document.querySelector('.categories');
    categoriesData.forEach((category, index) => {
      const categoryEl = create('div', ['category'], null, `${category}`);
      let categoryContainerEl = '';
      if (index === 0) {
        categoryContainerEl = create('div', ['category-container', 'center', 'category-container_selected'], null, categoryEl);
      } else {
        categoryContainerEl = create('div', ['category-container', 'center'], null, categoryEl);
      }
      categoriesContainer.append(categoryContainerEl);
    });
  }
}

renderCategoriesList(constants.REQUEST_ALL_CATEGORIES_URI);

assignHandlers();
