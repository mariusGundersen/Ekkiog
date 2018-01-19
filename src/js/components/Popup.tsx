import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import style from './popup.scss';

export interface Props {
  readonly show : boolean
  readonly children : JSX.Element
  onCoverClicked(e : React.MouseEvent<HTMLDivElement>) : void
}

export default function Popup(props : Props){
  return (
    <CSSTransition
      in={props.show}
      classNames={style}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}>
      <div className={style.popupCover} onClick={e => e.currentTarget === e.target && props.onCoverClicked(e)}>
        <div className={style.popup}>
          {props.children}
        </div>
      </div>
    </CSSTransition>
  );
}