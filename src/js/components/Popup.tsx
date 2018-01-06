import * as React from 'react';
import Transition from 'react-transition-group/Transition';

import style from './popup.scss';

export interface Props {
  readonly show : boolean
  readonly children : JSX.Element
}

export default function Popup(props : Props){
  return (
    <Transition
      in={props.show}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}>
      <div className={style.popupCover}>
        <div className={style.popup}>
          {props.children}
        </div>
      </div>
    </Transition>
  );
}