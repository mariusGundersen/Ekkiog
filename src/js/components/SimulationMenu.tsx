import * as React from 'react';
import MdPlayArrow from 'react-icons/md/play-arrow';
import MdPause from 'react-icons/md/pause';
import MdSkipNext from 'react-icons/md/skip-next';
import * as Slider from 'rc-slider';

import pure from './pure';

import 'rc-slider/assets/index.css';
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
      {Number.isFinite(props.tickInterval)
      ? <Slider
        className={style.slider}
        min={1}
        max={11}
        step={1}
        value={Math.floor(Math.log(props.tickInterval)/Math.LN2)}
        onChange={x => props.setTickInterval(2**x)} />
      : <div className={style.slider} />}
      <button onClick={() => props.setTickInterval(Number.isFinite(props.tickInterval) ? Infinity : 512)}>
        {Number.isFinite(props.tickInterval)
        ? <MdPause />
        : <MdPlayArrow />}
      </button>
  </div>
));