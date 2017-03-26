import React from 'react';

import style from '../main.css'

export default ({
  radius,
  onClick,
  icon,
  cx=0,
  cy=0
}) => (
  <g onClick={onClick} className={`${style.clickable} ${style.transTrans}`} transform={`translate(${cx}, ${cy})`}>
    <circle cx="0" cy="0" r={radius} fill="#2a2d30" stroke="#446364" strokeWidth="2" className={style.pieCenter} />
    {icon}
  </g>
);