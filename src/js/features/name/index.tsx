import * as React from 'react';
import reax from 'reaxjs';

import OkIcon from 'react-icons/fa/check';

import theme from '../../components/theme.scss';
import classes from '../../components/classes';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { map } from 'rxjs/operators';

export interface Props {
  readonly initial : string
  cancel(e : any) : void
  done(name : string) : void
}

export default reax({
  setName : (name : string) => name,
  done: (e : any) => true
}, ({setName, done}, props, initialProps : Props) => {
  done.pipe(
    withLatestFrom(setName),
    map(([_, name]) => name)
  ).subscribe(name => initialProps.done(name));

  return {};
}, ({values, events, props}) => (
  <div className={classes(theme.popup, theme.itemList)}>
    <div className={theme.item}>
        <span className={theme.header}>Set label</span>
    </div>
    <div className={theme.item}>
      <input
        defaultValue={props.initial}
        type="text"
        size={2}
        autoFocus
        onChange={limitInput(events.setName)} />
    </div>
    <div className={classes(theme.item, theme.centered)} >
      <button className={theme.nestedButton} onClick={events.done}>
        <span className={theme.icon}><OkIcon /></span>
        <span className={theme.label}>Go!</span>
      </button>
    </div>
  </div>
));

function limitInput(handle : (value : string) => void){
  return (event : React.SyntheticEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
      .toUpperCase()
      .replace(/[^A-Z0-9- ]/g, '-');
    event.currentTarget.value = value;
    handle(value);
  };
}
