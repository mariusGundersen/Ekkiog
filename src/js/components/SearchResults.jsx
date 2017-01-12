import React from 'react';
import Rx from 'rxjs/Rx.js';

import connect from 'reaxjs';
import SearchResultsView from './SearchResultsView.jsx';

const SearchResults = connect({
  searchTerm: event => event.currentTarget.value,
  toggleShow: event => 1
}, ({searchTerm, toggleShow}, props, initialProps) => ({
  showSearch: showSearch(toggleShow),
  searchResults: searchResults(searchTerm, initialProps.database)
}), ({searchResults, showSearch, actions, ...props}) => (
  <SearchResultsView
    show={showSearch}
    onToggle={actions.toggleShow}
    searchResults={searchResults}
    onChange={actions.searchTerm}
    {...props} />
));

export default SearchResults;

function showSearch(toggleShow){
  return toggleShow
    .scan((prev, _) => !prev, false)
    .startWith(false);
}

function searchResults(searchTerm, database){
  return searchTerm
    .map(term => term.toLowerCase())
    .switchMap(term =>
      term
      ? database.getComponentNames()
        .filter(name => name.toLowerCase().indexOf(term) >= 0)
        .scan((acc, val) => [...acc, val], [])
        .startWith([])
      : Rx.Observable.of([]))
    .startWith([]);
}