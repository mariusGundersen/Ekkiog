import * as React from 'react';
import IconPause from 'react-icons/fa/pause';
import IconStepForward from 'react-icons/fa/step-forward';
import IconPlay from 'react-icons/fa/play';
import IconFast from 'react-icons/fa/forward';
import IconUndo from 'react-icons/fa/rotate-left';
import IconRedo from 'react-icons/fa/repeat';
import IconShare from 'react-icons/fa/paper-plane';
import { CSSTransition } from 'react-transition-group';

import pure from './pure';

import style from './simulationMenu.scss';

export interface Props {
  readonly show : boolean
  readonly tickInterval : number
  readonly undoCount : number
  readonly redoCount : number
  readonly canShare : boolean
  setTickInterval(tickInterval : number) : void
  stepForward(e : any) : void
  undo(e : any) : void
  redo(e : any) : void
  share(e : any) : void
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
          <button className={props.undoCount === 0 ? style.disabled : ''} onClick={props.undo}><IconUndo /></button>
          <button className={props.redoCount === 0 ? style.disabled : ''} onClick={props.redo}><IconRedo /></button>
          <div className={style.flexFill} />
          {props.canShare && <button onClick={props.share}><IconShare /></button>}
          <div className={style.divider} />
          {props.tickInterval == Infinity
            ? <>
              <button className={style.selected} onClick={() => props.setTickInterval(2**8)}><IconPause /></button>
              <button onClick={props.stepForward}><IconStepForward /></button>
            </> : <>
              <button onClick={() => props.setTickInterval(Infinity)}><IconPause /></button>
              <button className={style.selected} onClick={() => props.setTickInterval(props.tickInterval == 2**8 ? 2**1 : 2**8)}>{
                props.tickInterval == 2**8 ? <IconPlay /> : <IconFast />
              }</button>
            </>}
      </div>
    </CSSTransition>
  </div>
));
