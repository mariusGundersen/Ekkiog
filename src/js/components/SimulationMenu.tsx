import * as React from 'react';
import MdPlayArrow from 'react-icons/md/play-arrow';
import MdPause from 'react-icons/md/pause';
import MdSkipNext from 'react-icons/md/skip-next';
import { MdLooksOne } from 'react-icons/md';
import MdSlow from 'react-icons/md/skip-next';
import MdMedium from 'react-icons/md/play-arrow';
import MdFast from 'react-icons/md/fast-forward';

import pure from './pure';

import style from './simulationMenu.scss';

export interface Props {
  readonly tickInterval : number;
  readonly setTickInterval : (tickInterval : number) => void;
}

export default pure(
  (prev, next) => prev.tickInterval != next.tickInterval,
  (props : Props) => (
  <div
    className={style.simulationMenu}>
      <div className={style.flexFill} />
      <button className={props.tickInterval == Infinity ? style.selected : ''} onClick={() => props.setTickInterval(Infinity)}><MdPause /></button>
      <button className={props.tickInterval == 2**11 ? style.selected : ''} onClick={() => props.setTickInterval(2**11)}><MdSlow /></button>
      <button className={props.tickInterval == 2**8 ? style.selected : ''} onClick={() => props.setTickInterval(2**8)}><MdMedium /></button>
      <button className={props.tickInterval == 2**1 ? style.selected : ''} onClick={() => props.setTickInterval(2**1)}><MdFast /></button>
  </div>
));