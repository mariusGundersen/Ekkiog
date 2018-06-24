import * as React from 'react';
import Loading from './radialMenu/Loading';

export interface Props {
  readonly x: number
  readonly y: number
  readonly radius: number
  readonly width: number
}

export default function ContextMenuLoading(props: Props){
  return (
    <g transform={`translate(${props.x} ${props.y})`}>
      <Loading radius={props.radius} width={props.width+2} />
    </g>
  );
}