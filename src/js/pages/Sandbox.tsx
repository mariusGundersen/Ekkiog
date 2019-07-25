import * as React from 'react';

import * as storage from '../storage';
import Share from '../features/share';

export default class Sandobx extends React.Component {
  render() {
    return <Share name="WELCOME" user={storage.getUser() as OauthData} hidePopup={() => { }} startSync={() => { }} />;
  }
}