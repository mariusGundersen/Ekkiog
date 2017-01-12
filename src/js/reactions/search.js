import Rx from 'rxjs/Rx.js';

export default function search(storage){
  return {
    observables: ({onSearchTermChanged}) => ({
      searchResults: typeAhead(onSearchTermChanged, storage)
    }),
    actions: {
      onSearchTermChanged: event => event.target.value
    }
  }
  return
}

function typeAhead(onSearchTermChanged, storage){
  return onSearchTermChanged
  .debounceTime(20)
  .switchMap(term => {
    return storage.getComponentNames()
    .filter(name => name.indexOf(term) >= 0)
    .map(buffer());
  });
}

function buffer(){
  const buffer = [];
  return v => {
    buffer.push(v);
    return buffer;
  };
}

function source(){
  let subscribable;

}