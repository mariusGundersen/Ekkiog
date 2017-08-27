import * as React from 'react';

import pure from './pure';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import style from './mainMenu.scss';
import theme from './theme.scss';
import FaGithub from 'react-icons/fa/github';
import FaUpload from 'react-icons/fa/cloud-upload';
import FaBusy from 'react-icons/fa/spinner';

import { user } from '../storage';

export interface Props {
  readonly show : boolean
  readonly push : (x : any) => void
  readonly isPushing : boolean
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
      {user === null
      ? <Login />
      : [
        <Profile key='profile' user={user as OauthData} />,
        <Push key='push' isBusy={props.isPushing} push={props.push} />
      ]}
      <div className={style.version}>{__BuildDate__}</div>
    </div>}
  </ReactCSSTransitionGroup>
));

const Login = () => (
  <a className={theme.item} href="/connect/github">
    <span className={theme.icon}><FaGithub /></span>
    <span className={theme.label}>Login with Github</span>
  </a>
);

const Profile = (props : {user : OauthData}) => (
  <span className={theme.item}>
    <span className={theme.icon}>
      <img className={style.photo} src={props.user.photo} />
    </span>
    <span className={theme.labelVertical}>
      <span>{props.user.name}</span>
      <span className={style.userDetails}>{props.user.server}/{props.user.username}/ekkiog-workspace</span>
    </span>
  </span>
);

const Push = (props: {isBusy : boolean, push : (x : any) => void}) => (
  <button className={theme.item} onClick={props.push} disabled={props.isBusy}>
    <span className={props.isBusy ? theme.spinningIcon : theme.icon}>
      {props.isBusy
        ? <FaBusy />
        : <FaUpload />}
    </span>
    <span className={theme.label}>Push</span>
  </button>
);