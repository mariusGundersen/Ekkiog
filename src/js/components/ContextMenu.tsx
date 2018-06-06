import * as React from 'react';
import { Dispatch } from 'redux';
import { TileType } from 'ekkiog-editing';

import { ContextMenuShowState } from '../reduce/contextMenu';
import { ViewState } from '../reduce/view';
import RadialMenu, { PieRingProps } from './radialMenu';


import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  MenuItem
} from './radialMenu/menuItems';
import { Action } from '../actions';

export type Props = {
  readonly contextMenu : ContextMenuShowState;
  readonly view : ViewState;
  readonly radius : number;
  readonly width : number;
  readonly dispatch : Dispatch<Action>
}

export default class ContextMenu extends React.Component<Props, any>{

  shouldComponentUpdate(nextProps : Props){
    return nextProps.contextMenu.tx !== this.props.contextMenu.tx
        || nextProps.contextMenu.ty !== this.props.contextMenu.ty
        || nextProps.contextMenu.tile !== this.props.contextMenu.tile
        || nextProps.contextMenu.show !== this.props.contextMenu.show
        || nextProps.view.tileToViewport !== this.props.view.tileToViewport
        || nextProps.radius !== this.props.radius
        || nextProps.width !== this.props.width;
  }

  render(){
    const { tile, tx, ty } = this.props.contextMenu;
    const [x, y] = this.props.view.tileToViewport(tx, ty);
    return (
      <g transform={`translate(${x/window.devicePixelRatio} ${y/window.devicePixelRatio})`}>
        <RadialMenu
        cx={0}
        cy={0}
        showMenu={true}
        center={undefined}
        menuTree={[
          createRing(this.props.radius, this.props.width, [
            ...tileMenuItems(tile, Math.floor(tx), Math.floor(ty), this.props.dispatch)
          ]),
          {
            ringKey: 2,
            radius: this.props.radius,
            width: this.props.width,
            fromTurnFraction: 1/8,
            toTurnFraction: 3/8,
            show: true,
            menuItems: [
              acceptMenuItem(this.props.dispatch)
            ]
          }
        ]} />
      </g>
    );
  }
}

function createRing(radius : number, width : number, items : MenuItem[]) : PieRingProps {
  return {
    ringKey: 1,
    radius: radius,
    width: width,
    fromTurnFraction: (6-items.length)/8,
    toTurnFraction: (6+items.length)/8,
    show: true,
    menuItems: items
  };
}

function *tileMenuItems(tile : TileType, tx : number, ty : number, dispatch : Dispatch<Action>){
  if(tile == 'wire' || tile == 'empty'){
    yield toUnderpassMenuItem(dispatch, tx, ty);
  }
  if(tile == 'underpass' || tile == 'empty'){
    yield toWireMenuItem(dispatch, tx, ty);
  }
  if(tile == 'gate' || tile == 'component' || tile == 'light' || tile == 'button'){
    yield moveMenuItem(dispatch, tx, ty);
  }
  if(tile != 'empty'){
    yield removeMenuItem(dispatch, tx, ty);
  }
}