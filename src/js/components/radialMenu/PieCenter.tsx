import * as React from 'react';

import style from '../main.css'

export interface Props {
  radius : number;
  onClick() : void;
  icon : JSX.Element;
  cx? : number;
  cy? : number;
}

export default ({
  radius,
  onClick,
  icon,
  cx=0,
  cy=0
} : Props) => (
  <g onClick={onClick} className={`${style.clickable} ${style.transTrans}`} transform={`translate(${cx}, ${cy})`}>
    <circle cx="0" cy="0" r={radius} fill="#2a2d30" stroke="#446364" strokeWidth="2" className={style.pieCenter} />
    {icon}
  </g>
);