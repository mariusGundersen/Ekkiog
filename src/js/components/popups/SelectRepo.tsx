import * as React from 'react';
import reax from 'reaxjs';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
  map,
  startWith,
  scan
} from 'rxjs/operators';

import FaBusy from 'react-icons/fa/spinner';
import FaAdd from 'react-icons/fa/plus-circle';
import FaCheck from 'react-icons/fa/check-circle';
import FaRight from 'react-icons/fa/angle-right';
import FaDown from 'react-icons/fa/angle-down';

import { getRepos, createRepo } from '../../storage/clients';

import theme from '../theme.scss';
import style from './selectRepo.scss';

const DEFAULT_REPO_NAME = 'ekkiog-workspace';

export interface Props {
  readonly user : OauthData
  onClick(repo : string) : void
}

export default reax({
  toggleList: (e: any) => true,
  createNewRepo: (e: any) => true
},
({toggleList, createNewRepo}, props, initialProps : Props) => {

  createNewRepo.subscribe(x => createRepo(DEFAULT_REPO_NAME, initialProps.user.access_token).then(name => initialProps.onClick(name)));

  const isCreating = createNewRepo.pipe(startWith(false));

  const repos = fromPromise(getRepos(initialProps.user.access_token));

  const isBusy = repos.pipe(
    map(x => false),
    startWith(true)
  );

  const hasEkkiogWorkspace = repos.pipe(
    map(repos => repos.indexOf(DEFAULT_REPO_NAME) >= 0)
  );

  const showOthers = toggleList.pipe(
    scan((acc, val) => !acc, false)
  );

  return {
    repos,
    isBusy,
    hasEkkiogWorkspace,
    showOthers,
    isCreating
  };
},
({events, props, values}) => <>
  <div className={style.photoContainer}>
    <h2>Pick Repository</h2>
    <img className={style.photo} src={props.user.photo} />
    <h3>{props.user.name}</h3>
    <h5>{props.user.server}</h5>
    <p>
      Pick a git repo to store your components in.
    </p>
  </div>

  {values.isBusy ?
    <div className={style.isBusy}>
      <span className={theme.spinningIcon}>
        <FaBusy />
      </span>
    </div>
  :
    <div className={theme.itemList}>
      {values.hasEkkiogWorkspace ?
        <button className={theme.item} key="use" onClick={() => props.onClick(DEFAULT_REPO_NAME)}>
          <span className={theme.icon}><FaCheck /></span>
          <span className={theme.label}>{DEFAULT_REPO_NAME}</span>
        </button>
      :
        <button className={theme.item} key="create" onClick={events.createNewRepo}>
          <span className={values.isCreating ? theme.spinningIcon : theme.icon}>{values.isCreating ? <FaBusy /> : <FaAdd />}</span>
          <span className={theme.labelVertical}>
            <span>Create a new repo</span>
            <span className={theme.sub}>{DEFAULT_REPO_NAME}</span>
          </span>
        </button>
      }
      <button className={theme.item} key="toggle" onClick={events.toggleList}>
        <span className={theme.icon}>{values.showOthers ? <FaDown /> : <FaRight />}</span>
        <span className={theme.label}>{values.hasEkkiogWorkspace ? "Pick another repo" : "Pick an existing repo"}</span>
      </button>
      {values.showOthers && values.repos.map((name, i) => (
        <button className={theme.item} key={i} onClick={() => props.onClick(name)}>
          <span className={theme.icon}><FaCheck /></span>
          <span className={theme.label}>{name}</span>
        </button>
      ))}
    </div>
  }
</>);