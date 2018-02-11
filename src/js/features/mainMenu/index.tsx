import * as React from 'react';
import UploadIcon from 'react-icons/fa/cloud-upload';
import GithubIcon from 'react-icons/fa/github';
import BusyIcon from 'react-icons/fa/spinner';
import UserIcon from 'react-icons/fa/user';
import TimeAgo from 'react-timeago';
import { CSSTransition } from 'react-transition-group';

import pure from '../../components/pure';
import theme from '../../components/theme.scss';
import { getUser } from '../../storage';
import DangerZone from './DangerZone';
import style from './mainMenu.scss';
import Statistics from './Statistics';
import Sync from '../sync';

export interface Props {
  readonly show : boolean
}

export default pure((a, b) => a.show !== b.show,
  (props : Props) => (
  <CSSTransition
    in={props.show}
    timeout={300}
    classNames={style as any}
    mountOnEnter={true}
    unmountOnExit={true}>
    <div className={`${theme.itemList} ${style.mainMenu}`}>
      {ifLoggedIn(user => <LoggedInMenu user={user} />, () => <AnonymousMenu />)}
    </div>
  </CSSTransition>
));

function ifLoggedIn(loggedIn : (user : OauthData) => JSX.Element, notLoggedIn : () => JSX.Element){
  const user = getUser();
  if(user) return loggedIn(user);
  return notLoggedIn();
}

const AnonymousMenu = () => <>
  <div className={style.userPhoto}>
    <UserIcon />
  </div>
  <Statistics />
  <LoginButton />
  <div className={style.flexSpacer} />
  <DangerZone />
  <Version />
</>;

const LoggedInMenu = (props : {user : OauthData}) => <>
  <img className={style.userPhoto} src={props.user.photo} />
  <div className={style.userName}>{props.user.name}</div>
  <a className={style.userLink} target="_blank" href={`https://${props.user.server}/${props.user.username}/${props.user.repo}`}>
    {props.user.server}/{props.user.username}/{props.user.repo}
  </a>
  <Statistics />
  <Sync />
  <DangerZone loggedIn />
  <Version />
</>;

const LoginButton = () => (
  <a className={theme.item} href="/connect/github">
    <span className={theme.icon}><GithubIcon /></span>
    <span className={theme.label}>Login with GitHub</span>
  </a>
);

const Push = (props: {isBusy : boolean, push : (x : any) => void}) => (
  <button className={theme.item} onClick={props.push} disabled={props.isBusy}>
    <span className={props.isBusy ? theme.spinningIcon : theme.icon}>
      {props.isBusy
        ? <BusyIcon />
        : <UploadIcon />}
    </span>
    <span className={theme.label}>Push</span>
  </button>
);

const Version = () => <div className={style.version}>Version built <TimeAgo date={__BuildDate__} /></div>;
