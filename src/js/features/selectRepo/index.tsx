import * as React from 'react';
import reax from 'reaxjs';
import { Observable, from as fromPromise, merge } from 'rxjs';
import {
  map,
  startWith,
  scan,
  throttleTime,
  share,
  mapTo
} from 'rxjs/operators';

import BusyIcon from 'react-icons/fa/spinner';
import AddIcon from 'react-icons/fa/plus-circle';
import CheckIcon from 'react-icons/fa/check-circle';
import ChevronIcon from 'react-icons/fa/angle-right';

import { getRepos, createRepo } from '../../storage/clients';
import * as storage from '../../storage';

import theme from '../../components/theme.scss';
import style from './selectRepo.scss';
import Terminal from '@es-git/terminal';

const DEFAULT_REPO_NAME = 'ekkiog-workspace';

export interface Props {
  readonly user : OauthData
  setRepo(repo : string) : void
  onComplete(x?: any) : void
}

export default reax({
  toggleList: (e : any) => true,
  createNewRepo: (e : any) => true,
  selectRepo: (name : string) => name
},
({toggleList, createNewRepo, selectRepo}, props, initialProps : Props) => {

  const repos = fromPromise(getRepos(initialProps.user.access_token));

  const creatingRepo = fromPromise(createNewRepo.toPromise().then(() => createRepo(DEFAULT_REPO_NAME, initialProps.user.access_token)));

  const progress = new Observable<string>(s => {
    merge(
      creatingRepo.pipe(map(createEvent(false))),
      selectRepo.pipe(map(createEvent(true)))
    ).subscribe(async ({repo, clone}) => {
      initialProps.setRepo(repo);

      if(clone) {
        var terminal = new Terminal();
        await storage.clone(`${initialProps.user.server}/${initialProps.user.username}/${repo}`, m => s.next(terminal.log(m)));
        s.next(terminal.content);
        s.complete();
      }

      initialProps.onComplete();
    });
    return () => {};
  }).pipe(
    throttleTime(200),
    share()
  );

  const isBusy = merge(
    repos.pipe(mapTo(false)),
    createNewRepo,
    selectRepo.pipe(mapTo(true))
  ).pipe(
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
    progress
  };
},
({events, props, values}) => <div className={style.popup}>
  <div className={style.photoContainer}>
    <h2>Pick Repository</h2>
    <img className={style.photo} src={props.user.photo} />
    <h3>{props.user.name}</h3>
    <h5>{props.user.server}/{props.user.username}</h5>
    <p>
      Pick a git repo to store your components in.
    </p>
  </div>

  {values.isBusy ?
    <div className={style.isBusy}>
      <div className={theme.spinningIcon}>
        <BusyIcon />
      </div>
      <pre>{values.progress}</pre>
    </div>
  :
    <div className={theme.itemList}>
      {values.hasEkkiogWorkspace ?
        <button className={theme.item} key="use" onClick={() => events.selectRepo(DEFAULT_REPO_NAME)}>
          <span className={theme.icon}><CheckIcon /></span>
          <span className={theme.label}>{DEFAULT_REPO_NAME}</span>
        </button>
      :
        <button className={theme.item} key="create" onClick={events.createNewRepo}>
          <span className={theme.icon}><AddIcon /></span>
          <span className={theme.labelVertical}>
            <span>Create a new repo</span>
            <span className={theme.sub}>{DEFAULT_REPO_NAME}</span>
          </span>
        </button>
      }
      <button className={theme.item} key="toggle" onClick={events.toggleList}>
        <span className={values.showOthers ? theme.iconDown : theme.icon}><ChevronIcon /></span>
        <span className={theme.label}>{values.hasEkkiogWorkspace ? "Pick another repo" : "Pick an existing repo"}</span>
      </button>
      {values.showOthers && values.repos.map((repo, i) => (
        <button className={theme.subItem} key={i} onClick={() => events.selectRepo(repo)}>
          <span className={theme.icon}><CheckIcon /></span>
          <span className={theme.label}>{repo}</span>
        </button>
      ))}
    </div>
  }
</div>);

function createEvent(clone : boolean){
  return (repo : string) => ({
    clone,
    repo
  });
}