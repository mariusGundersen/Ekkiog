import React from 'react';
import Rx from 'rxjs/Rx.js';

import connect from 'reaxjs';
import SearchResultsView from './SearchResultsView.jsx';

const SearchResults = connect({
  searchTerm: event => event.currentTarget.value,
  toggleShow: event => 1,
  selectedResult: result => result
}, ({searchTerm, toggleShow, selectedResult}, props, initialProps) => {

  selectedResult
    .withLatestFrom(props)
    .switchMap(([result, props]) => Rx.Observable.from(props.database.loadPackage(result)))
    .withLatestFrom(props)
    .subscribe(([result, props]) => props.onSelect(result));

  return {
    showSearch: showSearch(toggleShow.merge(selectedResult)),
    searchResults: searchResults(searchTerm.merge(selectedResult.mapTo('')), initialProps.database)
  };
}, ({searchResults, showSearch, actions, ...props}) => (
  <SearchResultsView
    {...props}
    show={showSearch}
    onToggle={actions.toggleShow}
    searchResults={searchResults}
    onChange={actions.searchTerm}
    onSelect={actions.selectedResult} />
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
    .startWith([])
    .distinctUntilChanged();
}