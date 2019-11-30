import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType } from '../editing';

import RadialMenu from './radialMenu';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  floodClearMenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';
import PieRing from './radialMenu/PieRing';
import pure from './pure';
import { RADIUS } from './Menu';

export interface Props {
  readonly tileType: TileType;
  readonly permanent?: boolean;
  readonly dispatch: Dispatch<Action>;
  readonly x: number;
  readonly y: number;
  readonly tx: number;
  readonly ty: number;
}

export default pure<Props>(['x', 'y'], props => (
  <g transform={`translate(${props.x} ${props.y})`}>
    <RadialMenu cx={0} cy={0}>
      <PieRing
        key={0}
        radius={RADIUS}
        width={RADIUS}
        fromTurnFraction={1 / 8}
        toTurnFraction={3 / 8}
        show={true}
        menuItems={[acceptMenuItem(props.dispatch)]}
      />
      <ContextMenuRing
        tileType={props.tileType}
        permanent={props.permanent || false}
        dispatch={props.dispatch}
        tx={props.tx}
        ty={props.ty}
      />
    </RadialMenu>
  </g>
));

interface ContextMenuRingProps {
  readonly tileType: TileType,
  readonly permanent: boolean,
  readonly tx: number,
  readonly ty: number,
  readonly dispatch: Dispatch
}

const ContextMenuRing = pure(['tx', 'ty', 'tileType'], (props: ContextMenuRingProps) => {
  const items = [...tileMenuItems(props.tileType, props.permanent, props.tx, props.ty, props.dispatch)];

  return (
    <PieRing
      key={1}
      radius={RADIUS}
      width={RADIUS}
      fromTurnFraction={(6 - items.length) / 8}
      toTurnFraction={(6 + items.length) / 8}
      show={true}
      menuItems={items}
    />
  );
});

function* tileMenuItems(tile: TileType, permanent: boolean, tx: number, ty: number, dispatch: Dispatch<Action>) {
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

  if ((tile == 'light' || tile == 'button') && !permanent) {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }
}
