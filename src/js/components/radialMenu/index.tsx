import * as React from 'react';

export interface Props {
  cx : number;
  cy : number;
  children : React.ReactNode[]
}

export default ({
  cx,
  cy,
  children
} : Props) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {...children}
    </g>
  );
}