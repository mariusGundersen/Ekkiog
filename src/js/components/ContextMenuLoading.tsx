import { ContextMenuState, ContextMenuLoadingState } from '../reduce/contextMenu';
import * as React from 'react';
import Loading from './radialMenu/Loading';

export interface Props {
  readonly contextMenu : ContextMenuLoadingState
  readonly radius : number
  readonly width : number
}

export default function ContextMenuLoading(props : Props){
  const { x, y } = props.contextMenu;
  return (
    <g transform={`translate(${x/window.devicePixelRatio} ${y/devicePixelRatio})`}>
      <Loading radius={props.radius} width={props.width+2} />
    </g>
  );
}