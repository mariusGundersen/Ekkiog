import * as React from 'react';

import style from './navbar.scss';

export interface Props {
  readonly isActive : boolean,
  readonly tick : number,
  readonly tickInterval : number,
  readonly onClick : (event : React.SyntheticEvent<HTMLButtonElement>) => void
};

export default (props : Props) => (
  <button
    className={style.navbarButton}
    onClick={props.onClick}
    data-active={props.isActive}>
    <MdApps
      tick={props.tick}
      paused={!Number.isFinite(props.tickInterval)} />
  </button>
);

const size = 8;
const MdApps = (props : {tick : number, paused : boolean}) => (
  <svg fill="currentColor" height="1em" width="1em" style={{verticalAlign: 'middle'}} preserveAspectRatio="xMidYMid meet" viewBox="0 0 40 40">
    <rect x=" 5" y=" 5" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 0)%8 / 4) }} />
    <rect x=" 5" y="16" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 1)%8 / 4) }} />
    <rect x=" 5" y="27" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 2)%8 / 4) }} />
    <rect x="16" y="27" width={size} height={size} style={{opacity: props.paused ? 0.05 : Math.max(0.05, 1-(props.tick + 3)%8 / 4) }} />
    <rect x="27" y="27" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 4)%8 / 4) }} />
    <rect x="27" y="16" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 5)%8 / 4) }} />
    <rect x="27" y=" 5" width={size} height={size} style={{opacity: props.paused ? 1.00 : Math.max(0.05, 1-(props.tick + 6)%8 / 4) }} />
    <rect x="16" y=" 5" width={size} height={size} style={{opacity: props.paused ? 0.05 : Math.max(0.05, 1-(props.tick + 7)%8 / 4) }} />
  </svg>
);