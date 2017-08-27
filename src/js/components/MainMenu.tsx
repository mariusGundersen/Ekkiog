import * as React from 'react';

import pure from './pure';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import style from './mainMenu.scss';
import theme from './theme.scss';
import FaGithub from 'react-icons/fa/github';

import { user } from '../storage';

export interface Props {
  readonly show : boolean
}

export default pure((a, b) => a.show === b.show,
  (props : Props) => (
  <ReactCSSTransitionGroup
    transitionName={style as any}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={300}
    component="div">
    {props.show && <div
      key="menu"
      className={`${theme.itemList} ${style.mainMenu}`}>
      <UserLink user={user} />
      <div className={style.version}>{__BuildDate__}</div>
    </div>}
  </ReactCSSTransitionGroup>
));

function UserLink(props : {user : OauthData | null}){
  if(props.user == null)
    return (
      <a className={theme.item} href="/connect/github">
        <span className={theme.icon}><FaGithub /></span>
        <span className={theme.label}>Login with Github</span>
      </a>
    );
  else
    return <span className={theme.item}>
      <span className={theme.icon}>
        <img className={style.photo} src={props.user.photo} />
      </span>
      <span className={theme.labelVertical}>
        <span>{props.user.name}</span>
        <span className={style.userDetails}>{props.user.server}/{props.user.username}/ekkiog-workspace</span>
      </span>
    </span>
}