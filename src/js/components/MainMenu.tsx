import * as React from 'react';

import pure from './pure';

import style from './mainMenu.scss';
import theme from './theme.scss';
import MdPerson from 'react-icons/md/person';

import { user } from '../storage';

export interface Props {

}

export default pure((a, b) => true,
  (props : Props) => (
  <div
    className={`${theme.itemList} ${style.mainMenu}`}>
    <UserLink user={user} />
    <div className={style.version}>{__BuildDate__}</div>
  </div>
));

function UserLink(props : {user : OauthData | null}){
  if(props.user == null)
    return (
      <a className={theme.item} href="/connect/github">
        <span className={theme.icon}><MdPerson /></span>
        <span className={theme.label}>Login with Github</span>
      </a>
    );
  else
    return <span className={theme.item}><img className={style.photo} src={props.user.photo} /><span> {props.user.name}</span></span>
}