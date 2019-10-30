import * as React from 'react';

export interface Props {
  rotate?: number
}

export default ({ rotate = 0 }: Props) => (
  <g>
    <g transform={`rotate(${rotate})`}>
      <rect strokeWidth="2"
        stroke="#888"
        fill="#666"
        x="-12" y="-12"
        width="24" height="24"
        rx="5" ry="5" />
    </g>
    <path d="m-7,12 l14,0 a5,5 0 0,0 5,-5 l0,-14 " stroke="#444" strokeWidth="2" fill="none" />
  </g>
);
