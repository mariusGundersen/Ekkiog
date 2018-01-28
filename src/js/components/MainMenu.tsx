import * as React from 'react';

import pure from './pure';
import { CSSTransition } from 'react-transition-group';

import style from './mainMenu.scss';
import theme from './theme.scss';
import FaGithub from 'react-icons/fa/github';
import FaUpload from 'react-icons/fa/cloud-upload';
import FaBusy from 'react-icons/fa/spinner';

import { user } from '../storage';

export interface Props {
  readonly show : boolean
  readonly isPushing : boolean
  push(x : any) : void
  showProfile(x : any) : void
}

export default pure((a, b) => a.show !== b.show,
  (props : Props) => (
  <CSSTransition
    in={props.show}
    timeout={300}
    classNames={style as any}
    mountOnEnter={true}
    unmountOnExit={true}>
    <div
      key="menu"
      className={`${theme.itemList} ${style.mainMenu}`}>
      {user === null
      ? <Login />
      : [
        <Profile key='profile' user={user as OauthData} showProfile={props.showProfile} />,
        <Push key='push' isBusy={props.isPushing} push={props.push} />
      ]}
      <div className={style.version}>{__BuildDate__}</div>
    </div>
  </CSSTransition>
));

const Login = () => (
  <a className={theme.item} href="/connect/github">
    <span className={theme.icon}><FaGithub /></span>
    <span className={theme.label}>Login with Github</span>
  </a>
);

const Profile = (props : {user : OauthData, showProfile : (x : any) => void}) => (
  <button className={theme.item} onClick={props.showProfile}>
    <span className={theme.icon}>
      <img className={style.photo} src={props.user.photo} />
    </span>
    <span className={theme.labelVertical}>
      <span>{props.user.name}</span>
      <span className={style.userDetails}>{props.user.server}/{props.user.username}/{props.user.repo}</span>
    </span>
  </button>
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