import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { TileType } from 'ekkiog-editing';

import { State } from '../reduce';
import { ContextMenuState } from '../reducers/contextMenu';
import { ViewState } from '../reducers/view';
import Loading from './radialMenu/Loading';
import RadialMenu, { PieCenterProps, PieRingProps } from './radialMenu';

import IconWire from './icons/IconWire';
import IconUnderpass from './icons/IconUnderpass';
import IconButton from './icons/IconButton';
import IconGate from './icons/IconGate';
import IconReturn from './icons/IconReturn';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem,
  MenuItem
} from './radialMenu/menuItems';

export type Props = {
  readonly contextMenu : ContextMenuState;
  readonly view : ViewState;
  readonly radius : number;
  readonly width : number;
  readonly dispatch : Dispatch<State>
}

export default class ContextMenu extends React.Component<Props, any>{

  shouldComponentUpdate(nextProps : Props){
    if(nextProps.contextMenu.loading && this.props.contextMenu.loading){
      return nextProps.contextMenu.x !== this.props.contextMenu.x
        || nextProps.contextMenu.y !== this.props.contextMenu.y
        || nextProps.contextMenu.loading !== this.props.contextMenu.loading
        || nextProps.radius !== this.props.radius
        || nextProps.width !== this.props.width;
    }

    if(nextProps.contextMenu.show && this.props.contextMenu.show){
      return nextProps.contextMenu.tx !== this.props.contextMenu.tx
        || nextProps.contextMenu.ty !== this.props.contextMenu.ty
        || nextProps.contextMenu.tile !== this.props.contextMenu.tile
        || nextProps.contextMenu.show !== this.props.contextMenu.show
        || nextProps.view.tileToViewport !== this.props.view.tileToViewport
        || nextProps.radius !== this.props.radius
        || nextProps.width !== this.props.width;
    }

    return nextProps.contextMenu.loading !== this.props.contextMenu.loading
      || nextProps.contextMenu.show !== this.props.contextMenu.show;
  }

  render(){
    if(this.props.contextMenu.loading){
      const { x, y } = this.props.contextMenu;
      return (
        <g transform={`translate(${x/window.devicePixelRatio} ${y/window.devicePixelRatio})`}>
          <Loading radius={this.props.radius} width={this.props.width+2} />
        </g>
      );
    }

    if(this.props.contextMenu.show){
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

    return null;
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

function *tileMenuItems(tile : TileType, tx : number, ty : number, dispatch : Dispatch<State>){
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