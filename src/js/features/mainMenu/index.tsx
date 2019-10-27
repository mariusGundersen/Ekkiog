import * as React from 'react';
import GithubIcon from 'react-icons/fa/github';
import UserIcon from 'react-icons/fa/user';
import SyncIcon from 'react-icons/fa/refresh';

import TimeAgo from 'react-timeago';
import theme from '../../components/theme.scss';
import DangerZone from './DangerZone';
import style from './mainMenu.scss';
import Statistics from './Statistics';
import classes from '../../components/classes';

export interface Props {
  readonly user: OauthData | null
  startSync(e: any): void
}

export default (props: Props) => (
  <div className={classes(style.mainMenu, theme.itemList)}>
    {(props.user
      ? <LoggedInMenu user={props.user} startSync={props.startSync} />
      : <AnonymousMenu />)}
  </div>
);

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

const LoggedInMenu = (props: { user: OauthData, startSync: (e: any) => void }) => <>
  <img className={style.userPhoto} src={props.user.photo} />
  <div className={style.userName}>{props.user.name}</div>
  <a className={style.userLink} target="_blank" href={`https://${props.user.server}/${props.user.username}/${props.user.repo}`}>
    {props.user.server}/{props.user.username}/{props.user.repo}
  </a>
  <Statistics />
  <SyncButton startSync={props.startSync} />
  <div className={style.flexSpacer} />
  <DangerZone loggedIn />
  <Version />
</>;

const LoginButton = () => (
  <a className={theme.item} href="/connect/github">
    <span className={theme.icon}><GithubIcon /></span>
    <span className={theme.label}>Login with GitHub</span>
  </a>
);

const SyncButton = (props: { startSync: (e: any) => void }) => (
  <button className={theme.item} onClick={props.startSync}>
    <span className={theme.icon}><SyncIcon /></span>
    <span className={theme.label}>Synchronize</span>
  </button>
);

const Version = () => <div className={style.version}>Version built <TimeAgo date={__BuildDate__} /></div>;
