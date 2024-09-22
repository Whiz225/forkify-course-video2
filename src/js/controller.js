import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import addRecipeView from './views/addRecipeView.js';

// import icons from '../img/icons.svg'; // Parcel 1
//import icons from 'url:../img/icons.svg'; // Parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//028a4ef3-6bc2-42e9-943b-d4e640cfe91e

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // 1. Loading recipe
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(modal.getSearchResultsPage());

    //debugger;
    // 1) Updating bookmarks
    bookmarkView.update(modal.state.bookmarks);

    // 2) Loading recipe
    await modal.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await modal.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(modal.state.search.results);
    resultsView.render(modal.getSearchResultsPage());

    // 4) Render initial pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err.message);
    resultsView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  resultsView.render(modal.getSearchResultsPage(gotoPage));
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  modal.updateServings(newServings);

  // recipeView.render(modal.state.recipe);
  recipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(modal.state.recipe);

  // 3) Render bookmarks
  bookmarkView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    // Upload the new recipe
    await modal.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Succsess message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(modal.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('WELCOME');
};
init();
