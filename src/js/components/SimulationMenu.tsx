import * as React from 'react';
import MdPlayArrow from 'react-icons/md/play-arrow';
import MdPause from 'react-icons/md/pause';
import MdSkipNext from 'react-icons/md/skip-next';
import MdSlow from 'react-icons/md/skip-next';
import MdMedium from 'react-icons/md/play-arrow';
import MdFast from 'react-icons/md/fast-forward';
import MdUndo from 'react-icons/md/undo';
import MdRedo from 'react-icons/md/redo';
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