import React from 'react';

import style from '../main.css'

export default ({
  radius,
  onClick,
  icon
}) => (
  <g onClick={onClick} className={style.clickable}>
    <circle cx="0" cy="0" r={radius} fill="#2a2d30" stroke="#446364" strokeWidth="2"/>
    {icon}
  </g>
);