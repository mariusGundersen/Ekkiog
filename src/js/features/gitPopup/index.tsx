import * as React from 'react';
import GitProgress from './GitProgress';
import { GitPopupState } from './reduce';
import Popup from '../../components/Popup';

export interface Props {
  readonly show : string | false
  readonly state : GitPopupState
  hidePopup() : void
}

export default function GitPopup(props : Props){
  return (
    <Popup
      show={props.show === 'GitProgress'}
      onCoverClicked={() => props.state.status === 'busy' ? null : props.hidePopup()}>
        <GitProgress {...props.state} />
    </Popup>
  );
}