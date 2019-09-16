import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType, Forest, getTypeAt } from 'ekkiog-editing';

import { ContextMenuShowState } from '../reduce/contextMenu';
import RadialMenu from './radialMenu';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  MenuItem,
  floodClearMenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';
import PieRing from './radialMenu/PieRing';
import pure from './pure';

export interface Props {
  readonly forest: Forest;
  readonly contextMenu: ContextMenuShowState;
  readonly radius: number;
  readonly width: number;
  readonly dispatch: Dispatch<Action>;
  readonly x: number;
  readonly y: number;
}

export default class ContextMenu extends React.Component<Props, any>{

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.contextMenu !== this.props.contextMenu
      || nextProps.forest !== this.props.forest
      || nextProps.x !== this.props.x
      || nextProps.y !== this.props.y
      || nextProps.radius !== this.props.radius
      || nextProps.width !== this.props.width;
  }

  render() {
    return (
      <g transform={`translate(${this.props.x} ${this.props.y})`}>
        <RadialMenu cx={0} cy={0}>
          <ContextMenuRing
            radius={this.props.radius}
            width={this.props.width}
            contextMenu={this.props.contextMenu}
            forest={this.props.forest}
            dispatch={this.props.dispatch}
          />
          <PieRing
            key={2}
            radius={this.props.radius}
            width={this.props.width}
            fromTurnFraction={1 / 8}
            toTurnFraction={3 / 8}
            show={true}
            menuItems={[acceptMenuItem(this.props.dispatch)]}
          />
        </RadialMenu>
      </g>
    );
  }
}

interface ContextMenuRingProps {
  readonly radius: number,
  readonly width: number,
  readonly contextMenu: ContextMenuShowState,
  readonly forest: Forest,
  readonly dispatch: Dispatch
}

const ContextMenuRing = pure((p, n) => p.contextMenu != n.contextMenu, (props: ContextMenuRingProps) => {
  const { tx, ty } = props.contextMenu;
  const tile = getTypeAt(props.forest.enneaTree, Math.floor(tx), Math.floor(ty));
  const items = [
    ...tileMenuItems(tile, Math.floor(tx), Math.floor(ty), props.dispatch)
  ];
  return <PieRing
    key={1}
    radius={props.radius}
    width={props.width}
    fromTurnFraction={(6 - items.length) / 8}
    toTurnFraction={(6 + items.length) / 8}
    show={true}
    menuItems={items}
  />
});

function* tileMenuItems(tile: TileType, tx: number, ty: number, dispatch: Dispatch<Action>) {
  if (tile == 'wire' || tile == 'empty') {
    yield toUnderpassMenuItem(dispatch, tx, ty);
    yield floodClearMenuItem(dispatch, tx, ty);
  }
  if (tile == 'underpass' || tile == 'empty') {
    yield toWireMenuItem(dispatch, tx, ty);
    yield floodClearMenuItem(dispatch, tx, ty);
  }
  if (tile == 'gate' || tile == 'component' || tile == 'light' || tile == 'button') {
    yield moveMenuItem(dispatch, tx, ty);
    yield removeMenuItem(dispatch, tx, ty);
  }
}
