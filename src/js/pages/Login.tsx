import * as React from 'react';

import Popup from '../components/Popup';
import SelectRepo from '../components/popups/SelectRepo';
import GitProgressPopup from '../features/gitPopup';
import * as storage from '../storage';
import reax from 'reaxjs';
import { map, startWith, switchMap, share, throttleTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import Terminal from '@es-git/terminal';
import { Observable } from 'rxjs/Observable';
import { GitPopupState } from '../features/gitPopup/reduce';

export interface Props {
  readonly user : OauthData
}

export default reax({
  onCoverClicked: (x : any) => true,
  setRepo: (repo : string) => repo,
  onComplete: (x : any) => true,
},
({setRepo, onComplete}, props, initialProps : Props) => {

  setRepo.subscribe(repo => storage.setUser({
    ...initialProps.user,
    repo
  }));

  onComplete.subscribe(() => {
    document.location.href = '/';
  });

  return {
  };
},
({events, values, props}) => (
  <>
    <Popup show={true} onCoverClicked={events.onCoverClicked}>
      <SelectRepo
        setRepo={events.setRepo}
        onComplete={events.onComplete}
        user={props.user} />
    </Popup>
  </>
));

const busy = (message : string) => ({
  message,
  status: 'busy' as 'busy'
});

const success = (message : string) => ({
  message,
  status: 'success' as 'success'
});
