import * as React from 'react';

export interface Props {
  rotate?: number
}

export default ({ rotate = 0 }: Props) => (
  <g>
    <g transform={`rotate(${rotate})`}>
      <rect strokeWidth="2"
        stroke="#3d5166"
        fill="#2e3e4e"
        x="-12" y="-12"
        width="24" height="24"
        rx="5" ry="5" />
      <path d="m12,0 l8,0" stroke="#f58e8e" strokeWidth="2" fill="none" />
    </g>
    <path d="m-7,12 l14,0 a5,5 0 0,0 5,-5 l0,-14 " stroke="#1f2933" strokeWidth="2" fill="none" />
  </g>
);
