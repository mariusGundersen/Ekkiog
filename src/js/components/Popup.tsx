import * as React from 'react';
import Transition from 'react-transition-group/Transition';

import style from './popup.scss';
import { SyntheticEvent } from 'react';

export interface Props {
  readonly show : boolean
  readonly children : JSX.Element | false
  onCoverClicked() : void
}

export default function Popup(props : Props){
  return (
    <Transition
      in={props.show}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}>
      <div className={style.popupCover} onClick={e => e.currentTarget === e.target && props.onCoverClicked()}>
        <div className={style.popup}>
          {props.children}
        </div>
      </div>
    </Transition>
  );
}