import * as React from 'react';

import Popup from '../components/Popup';
import SelectRepo from '../components/popups/SelectRepo';
import * as storage from '../storage';

export interface Props {
  readonly user : OauthData
}

export default class Login extends React.Component<Props> {
  onCoverClicked = () => {}

  onPick = (repo : string) => {
    storage.setUser({
      ...this.props.user,
      repo
    });
    document.location.href = '/';
  }

  render(){
    return <Popup show={true} onCoverClicked={this.onCoverClicked}>
      <SelectRepo
        onClick={this.onPick}
        user={this.props.user} />
    </Popup>
  }
}
