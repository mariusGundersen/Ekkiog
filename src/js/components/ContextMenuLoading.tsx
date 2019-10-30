import * as React from 'react';
import Loading from './radialMenu/Loading';
import { RADIUS } from './Menu';
import pure from './pure';

export interface Props {
  readonly x: number
  readonly y: number
}

export default pure(['x', 'y'], (props: Props) => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <Loading radius={RADIUS} width={RADIUS + 2} />
  </g>
));
