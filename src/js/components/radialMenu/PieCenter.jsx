import React from 'react';

export default ({
  radius,
  onClick,
  icon
}) => (
  <g onClick={onClick} className="clickable">
    <circle cx="0" cy="0" r={radius} fill="#2a2d30" stroke="#446364" strokeWidth="2"/>
    {icon}
  </g>
);