import * as React from 'react';

import MainMenu from '../components/MainMenu';

export default class Sandobx extends React.Component {
  render(){
    return <MainMenu isPushing={false} push={() => {}} show={true} />;
  }
}