import * as React from 'react';

import { CSSTransition } from 'react-transition-group';
import TimeAgo from 'react-timeago';
import reax from 'reaxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { startWith, map } from 'rxjs/operators';

import style from './mainMenu.scss';
import theme from './theme.scss';

import GithubIcon from 'react-icons/fa/github';
import LogoutIcon from 'react-icons/fa/sign-out';
import UploadIcon from 'react-icons/fa/cloud-upload';
import BusyIcon from 'react-icons/fa/spinner';

import UserIcon from 'react-icons/fa/user';

import pure from './pure';
import { getUser, setUser, getOwnedComponents } from '../storage';

export interface Props {
  readonly show : boolean
  readonly isPushing : boolean
  push(x : any) : void
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
  <Version />
</>;

const LoggedInMenu = (props : {user : OauthData}) => <>
  <img className={style.userPhoto} src={props.user.photo} />
  <div className={style.userName}>{props.user.name}</div>
  <a className={style.userLink} target="_blank" href={`https://${props.user.server}/${props.user.username}/${props.user.repo}`}>
    {props.user.server}/{props.user.username}/{props.user.repo}
  </a>
  <Statistics />
  <div className={style.flexSpacer} />
  <LogoutButton />
  <Version />
</>;

const LoginButton = () => (
  <a className={theme.item} href="/connect/github">
    <span className={theme.icon}><GithubIcon /></span>
    <span className={theme.label}>Login with GitHub</span>
  </a>
);

const LogoutButton = () => (
  <button className={theme.item} onClick={() => {setUser(null as any); document.location.reload()}}>
    <span className={theme.icon}><LogoutIcon /></span>
    <span className={theme.label}>Logout from GitHub</span>
  </button>
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

const Statistics = reax({},
({}, props, initialProps : {}) => {

  const usage = fromPromise(getEstimate()).pipe(
    startWith({usage: 0})
  );
  const count = fromPromise(getOwnedComponents()).pipe(
    map(d => d.length),
    startWith(0)
  );

  return {
    usage,
    count
  };
},
({events, props, values}) => (
  <div className={style.statistics}>
    <strong>{values.count}</strong> components, <strong>{formatBytes(values.usage.usage)}</strong>
  </div>
));

async function getEstimate() : Promise<{quota : number, usage : number}>{
  return await (navigator as any).storage.estimate();
}

function formatBytes(bytes : number){
  if(bytes < 1024){
    return `${bytes} bytes`;
  }else if(bytes < 1024*1024){
    return `${(bytes/1024).toFixed(2)} KiB`;
  }else if(bytes < 1024*1024*1024){
    return `${(bytes/1024/1024).toFixed(2)} MiB`;
  }else{
    return `${(bytes/1024/1024/1024).toFixed(2)} GiB`;
  }
}