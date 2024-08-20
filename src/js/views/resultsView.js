
import { View } from './view';
import icons from 'url:../../img/icons.svg'; // Parcel 1
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for your query. Please try again! ;)`;
  _message = '';

  _generateMarkup() {
    return this._data
      .map(results => previewView.render(results, false))
      .join('');
  }
}

export default new ResultsView();

