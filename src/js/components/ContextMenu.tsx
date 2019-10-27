import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType, Forest, getTypeAt } from '../editing';

import { ContextMenuShowState } from '../reduce/contextMenu';
import RadialMenu from './radialMenu';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  floodClearMenuItem,
  rotateMenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';
import PieRing from './radialMenu/PieRing';
import pure from './pure';
import IconLight from './icons/IconLight';
import IconButton from './icons/IconButton';

export interface Props {
  readonly forest: Forest;
  readonly contextMenu: ContextMenuShowState;
  readonly radius: number;
  readonly width: number;
  readonly dispatch: Dispatch<Action>;
  readonly x: number;
  readonly y: number;
}

export default pure<Props>(['contextMenu', 'forest', 'x', 'y', 'radius', 'width'], props => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <RadialMenu cx={0} cy={0}>
      <PieRing
        key={0}
        radius={props.radius}
        width={props.width}
        fromTurnFraction={1 / 8}
        toTurnFraction={3 / 8}
        show={true}
        menuItems={[acceptMenuItem(props.dispatch)]}
      />
      <ContextMenuRing
        radius={props.radius}
        width={props.width}
        contextMenu={props.contextMenu}
        forest={props.forest}
        dispatch={props.dispatch}
      />
    </RadialMenu>
  </g>
));

interface ContextMenuRingProps {
  readonly radius: number,
  readonly width: number,
  readonly contextMenu: ContextMenuShowState,
  readonly forest: Forest,
  readonly dispatch: Dispatch
}

const ContextMenuRing = pure(['contextMenu'], (props: ContextMenuRingProps) => {
  const { tx, ty } = props.contextMenu;
  const tile = getTypeAt(props.forest.enneaTree, Math.floor(tx), Math.floor(ty));
  const items = [
    ...tileMenuItems(tile, Math.floor(tx), Math.floor(ty), props.dispatch)
  ];

  const rotateItems = [...rotateMenuItems(tile, Math.floor(tx), Math.floor(ty), props.dispatch)];

  return <>
    <PieRing
      key={1}
      radius={props.radius}
      width={props.width}
      fromTurnFraction={(6 - items.length) / 8}
      toTurnFraction={(6 + items.length) / 8}
      show={true}
      menuItems={items}
    />
    (rotateItems.length == 0 ? null :
    <PieRing
      key={2}
      radius={props.radius + props.width + 10}
      width={props.width}
      fromTurnFraction={0.125}
      toTurnFraction={1.125}
      spanTurnFraction={0.125}
      show={true}
      menuItems={rotateItems}
    />)
  </>
});

function* tileMenuItems(tile: TileType, tx: number, ty: number, dispatch: Dispatch<Action>) {
  if (tile == 'wire' || tile == 'empty') {
    yield toUnderpassMenuItem(dispatch, tx, ty);
  }

  if (tile == 'underpass' || tile == 'empty') {
    yield toWireMenuItem(dispatch, tx, ty);
  }

  if (tile == 'wire' || tile == 'underpass') {
    yield floodClearMenuItem(dispatch, tx, ty);
  }

  if (tile == 'gate' || tile == 'component') {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }

  if (tile == 'light' || tile == 'button') {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }
}

function* rotateMenuItems(tile: TileType, tx: number, ty: number, dispatch: Dispatch<Action>) {
  if (tile == 'light') {
    yield rotateMenuItem(dispatch, tx, ty, 'upwards', <IconLight rotate={270} />);
    yield rotateMenuItem(dispatch, tx, ty, 'rightwards', <IconLight rotate={0} />);
    yield rotateMenuItem(dispatch, tx, ty, 'downwards', <IconLight rotate={90} />);
    yield rotateMenuItem(dispatch, tx, ty, 'leftwards', <IconLight rotate={180} />);
  }

  if (tile == 'button') {
    yield rotateMenuItem(dispatch, tx, ty, 'downwards', <IconButton rotate={90} />);
    yield rotateMenuItem(dispatch, tx, ty, 'leftwards', <IconButton rotate={180} />);
    yield rotateMenuItem(dispatch, tx, ty, 'upwards', <IconButton rotate={270} />);
    yield rotateMenuItem(dispatch, tx, ty, 'rightwards', <IconButton rotate={0} />);
  }
}
