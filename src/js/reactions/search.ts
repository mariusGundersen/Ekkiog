import * as Rx from 'rxjs/Rx.js';
import { ChangeEvent } from 'react';

import { Storage } from '../storage/database';

export default function search(storage : Storage){
  return {
    observables: ({onSearchTermChanged} : {onSearchTermChanged : Rx.Observable<string>}) => ({
      searchResults: typeAhead(onSearchTermChanged, storage)
    }),
    actions: {
      onSearchTermChanged: (event : ChangeEvent<HTMLInputElement> ) => event.target.value
    }
  }
}

function typeAhead(onSearchTermChanged : Rx.Observable<string>, storage : Storage){
  return onSearchTermChanged
  .debounceTime(20)
  .switchMap(term => {
    return storage.getComponentNames()
    .filter(name => name.indexOf(term) >= 0)
    .map(buffer());
  });
}

function buffer() {
  const buffer : string[] = [];
  return (v : string) => {
    buffer.push(v);
    return buffer;
  };
}
