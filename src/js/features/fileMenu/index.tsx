import * as React from 'react';

import style from './fileMenu.scss';
import theme from '../../components/theme.scss';
import classes from '../../components/classes';
import reax from 'reaxjs';
import SearchResults from './SearchResults';
import { Package } from '../../editing';
import { RepoName } from './SearchResultView';
import { startWith } from 'rxjs/operators';

export interface Props {
  readonly isReadOnly: boolean;
  insertPackage(p: Package): void;
  openComponent(result: RepoName): void;
  createComponent(result: string): void;
}

export default reax(
  {
    query: (value: string) => value
  },
  (events, props, initialProps: Props) => {
    return {
      query: events.query.pipe(startWith(''))
    };
  },
  (values, events, props) => (
    <div className={classes(style.fileMenu, theme.itemList)}>
      <div className={style.searchBox}>
        <input
          type="text"
          size={2}
          autoFocus
          onChange={limitInput(events.query)} />
      </div>
      <SearchResults
        query={values.query}
        insertPackage={props.insertPackage}
        openComponent={props.openComponent}
        createComponent={props.createComponent}
        isReadOnly={props.isReadOnly} />
    </div>
  ));


function limitInput(handle: (value: string) => void) {
  return (event: React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '-');
    event.currentTarget.value = value;
    handle(value);
  };
}
