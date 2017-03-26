import React from 'react';

export default ({rotate=0}) => (
  <g transform={`rotate(${rotate})`}>
    <circle cx="0" cy="0" r="10" fill="#fed37f" />
    <path d="m-15,0 l0,-3 l8,-4 l0,14 l-8,-4 z" stroke="#666" fill="#aaa" />
  </g>
);