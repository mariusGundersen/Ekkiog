import * as React from 'react';

export interface Props {
  cx: number;
  cy: number;
  children: JSX.Element | JSX.Element[]
}

export default ({
  cx,
  cy,
  children
}: Props) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {children}
    </g>
  );
}
