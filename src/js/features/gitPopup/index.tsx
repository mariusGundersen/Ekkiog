import * as React from 'react';
import GitProgress from './GitProgress';
import { GitPopupState } from './reduce';
import Popup from '../../components/Popup';

export interface Props {
  readonly show : string | false
  readonly state : GitPopupState
  hidePopup(e : React.MouseEvent<HTMLDivElement>) : void
}

export default function GitPopup(props : Props){
  return (
    <Popup
      show={props.show === 'GitProgress'}
      onCoverClicked={e => props.state.status === 'busy' ? null : props.hidePopup(e)}>
        <GitProgress {...props.state} />
    </Popup>
  );
}