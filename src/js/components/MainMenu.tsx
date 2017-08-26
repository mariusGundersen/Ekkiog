import * as React from 'react';

import pure from './pure';

import style from './mainMenu.scss';

import { user } from '../storage';

export interface Props {

}

export default pure((a, b) => true,
  (props : Props) => (
  <div
    className={style.mainMenu}>
    <UserLink user={user} />
    <div className={style.version}>
      Version: {__BuildDate__}
    </div>
  </div>
));

function UserLink(props : {user : OauthData | null}){
  if(props.user == null)
    return <a className={style.item} href="/connect/github">Login with Github</a>
  else
    return <span className={style.item}><img className={style.photo} src={props.user.photo} /><span> {props.user.name}</span></span>
}