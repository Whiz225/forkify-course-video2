
import icons from 'url:../../img/icons.svg'; // Parcel 1
import { View } from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupNextButton(curPage);
    // Page 1, and there are NO other
    if (curPage === 1) return '';
    if (curPage === numPages)
      // Last page
      return this._generateMarkupPrevButton(curPage);

    // Other page
    if (curPage < numPages)
      return `${this._generateMarkupPrevButton(
        curPage
      )}${this._generateMarkupNextButton(curPage)}`;
  }

  _generateMarkupPrevButton(curPage) {
    return `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
  }

  _generateMarkupNextButton(curPage) {
    return ` <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
}

export default new PaginationView();

