import * as React from 'react';
import GitProgress from './GitProgress';
import { GitPopupState } from './reduce';
import Popup from '../../components/Popup';

export interface Props {
  readonly show : boolean
  readonly state : GitPopupState
  hidePopup(e : React.MouseEvent<HTMLDivElement>) : void
}

export default class GitPopup extends React.PureComponent<Props> {
  hidePopup = (e : React.MouseEvent<HTMLDivElement>) => {
     if(this.props.state.status === 'failure'){
       this.props.hidePopup(e);
     }
  }

  render(){
    return (
      <Popup
        show={this.props.show}
        onCoverClicked={this.hidePopup}>
          <GitProgress {...this.props.state} hidePopup={this.hidePopup} />
      </Popup>
    );
  }
}