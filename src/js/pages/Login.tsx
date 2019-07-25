import * as React from 'react';

import Popup from '../components/Popup';
import SelectRepo from '../features/selectRepo';
import * as storage from '../storage';
import reax from 'reaxjs';

export interface Props {
  readonly user: OauthData
}

export default reax(
  {
    onCoverClicked: (_: any) => true,
    setRepo: (repo: string) => repo,
    onComplete: (_: any) => true,
  },
  ({ setRepo, onComplete }, _, initialProps: Props) => {

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
  ({ events, props }) => (
    <>
      <Popup show={true} onCoverClicked={events.onCoverClicked}>
        <SelectRepo
          setRepo={events.setRepo}
          onComplete={events.onComplete}
          user={props.user} />
      </Popup>
    </>
  )
);
