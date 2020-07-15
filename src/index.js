import 'babel-polyfill';


import assignHandlers from './js/handlers';
import renderCategoriesList from './js/categoryList';
import * as constants from './js/constants/constants';
import * as localStorage from './js/localStorage';


localStorage.renderLocalStorage();
renderCategoriesList(constants.REQUEST_ALL_CATEGORIES_URI);
assignHandlers();
