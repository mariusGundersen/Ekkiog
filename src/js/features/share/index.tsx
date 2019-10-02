import * as React from 'react';
import OkIcon from 'react-icons/fa/check';
import SyncIcon from 'react-icons/fa/refresh';
import reax from 'reaxjs';

import * as storage from '../../storage';
import { hidePopup } from '../../actions';
import classes from '../../components/classes';
import theme from '../../components/theme.scss';
import style from './style.scss';
import { from as fromPromise } from 'rxjs';
import { map, share } from 'rxjs/operators';

export interface Props {
  readonly name: string
  readonly user: OauthData | null
  hidePopup(e: any): void
  startSync(e: any): void
}

export default reax(
  {
  },
  (events, props, initialProps: Props) => {
    const statusOk = fromPromise(storage.status(initialProps.name))
      .pipe(
        map(r => r.ok.length === 1),
        share()
      );

    return {
      statusOk
    };
  }, (values, events, props) => {
    return <div className={classes(theme.popup, theme.itemList)}>
      <div className={theme.item}>
        <span className={theme.header}>Share {props.name}</span>
      </div>
      <div className={classes(theme.item, theme.centered)}>
        {props.user && <a className={style.link} target="_blank" href={`https://ekkiog.mariusgundersen.net/c/${props.name}/${props.user.server}/${props.user.username}/${props.user.repo}`}>
          Copy this link to share your component with others
      </a>}
      </div>
      {values.statusOk && <>
        <div className={classes(theme.item, theme.centered)} >
          <button className={theme.nestedButton} onClick={props.hidePopup}>
            <span className={theme.icon}><OkIcon /></span>
            <span className={theme.label}>Done</span>
          </button>
        </div>
      </>}
      {values.statusOk === false && <>
        <div className={theme.item}>
          <span className={theme.label}>You have made changes to {props.name} that you haven't uploaded yet. You should synchronize the work you have done here with {props.user && props.user.repo}. </span>
        </div>
        <div className={classes(theme.item, theme.centered)} >
          <button className={theme.nestedButton} onClick={props.startSync}>
            <span className={theme.icon}><SyncIcon /></span>
            <span className={theme.label}>Synchronize</span>
          </button>
        </div>
      </>}
    </div>;
  });
