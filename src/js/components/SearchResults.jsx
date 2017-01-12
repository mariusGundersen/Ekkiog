import React from 'react';
import Rx from 'rxjs/Rx.js';

import connect from './connect.jsx';
import SearchResultsView from './SearchResultsView.jsx';

const SearchResults = connect({
  searchTerm: event => event.currentTarget.value,
  toggleShow: event => 1
}, ({searchTerm, toggleShow}, props) => ({
  showSearch: showSearch(toggleShow),
  searchResults: props.first().switchMap(props => searchResults(searchTerm, props.database))
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
  console.log(database);
  return searchTerm
    .switchMap(term => database.getComponentNames(term)
      .scan((acc, val) => (acc.push(val), acc), [])
      .startWith([]))
    .startWith([]);
}