import * as React from 'react';
import MdPause from 'react-icons/fa/pause';
import MdSlow from 'react-icons/fa/step-forward';
import MdMedium from 'react-icons/fa/play';
import MdFast from 'react-icons/fa/fast-forward';
import MdUndo from 'react-icons/fa/rotate-left';
import MdRedo from 'react-icons/fa/repeat';
import { CSSTransition } from 'react-transition-group';

import pure from './pure';

import style from './simulationMenu.scss';

export interface Props {
  readonly show : boolean
  readonly tickInterval : number
  readonly undoCount : number
  readonly redoCount : number
  setTickInterval(tickInterval : number) : void
  undo(x : any) : void
  redo(x : any) : void
}

export default pure(
  (prev, next) => prev.show !== next.show
               || prev.tickInterval !== next.tickInterval
               || prev.undoCount !== next.undoCount
               || prev.redoCount !== next.redoCount,
  (props : Props) => (
  <div className={style.container} >
    <CSSTransition
      in={props.show}
      classNames={style as any}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}>
      <div
        key="menu"
        className={style.simulationMenu}>
          <button className={props.undoCount === 0 ? style.disabled : ''} onClick={props.undo}><MdUndo /></button>
          <button className={props.redoCount === 0 ? style.disabled : ''} onClick={props.redo}><MdRedo /></button>
          <div className={style.flexFill} />
          <button className={props.tickInterval == Infinity ? style.selected : ''} onClick={() => props.setTickInterval(Infinity)}><MdPause /></button>
          <button className={props.tickInterval == 2**11 ? style.selected : ''} onClick={() => props.setTickInterval(2**11)}><MdSlow /></button>
          <button className={props.tickInterval == 2**8 ? style.selected : ''} onClick={() => props.setTickInterval(2**8)}><MdMedium /></button>
          <button className={props.tickInterval == 2**1 ? style.selected : ''} onClick={() => props.setTickInterval(2**1)}><MdFast /></button>
      </div>
    </CSSTransition>
  </div>
));