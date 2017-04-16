import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import Loading from './radialMenu/Loading';
import RadialMenu, { PieCenterProps ,PieRingProps } from './RadialMenu';

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

export interface Props {
  loading : boolean;
  x : number;
  y : number;
  radius : number;
  width : number;
  show : boolean;
  tx : number;
  ty : number;
  tile : string;
  dispatch : Dispatch<any>
}

interface State {

}

export default class ContextMenu extends React.Component<Props, State>{

  shouldComponentUpdate(nextProps : Props, nextState : State){
    if(nextProps.loading){
      return nextProps.x !== this.props.x
        || nextProps.y !== this.props.y
        || nextProps.loading !== this.props.loading
        || nextProps.radius !== this.props.radius
        || nextProps.width !== this.props.width;
    }

    if(nextProps.show){
      return nextProps.x !== this.props.x
        || nextProps.y !== this.props.y
        || nextProps.tx !== this.props.tx
        || nextProps.ty !== this.props.ty
        || nextProps.tile !== this.props.tile
        || nextProps.show !== this.props.show
        || nextProps.radius !== this.props.radius
        || nextProps.width !== this.props.width;
    }

    return nextProps.loading !== this.props.loading
      || nextProps.show !== this.props.show;
  }

  render(){
    const {
      x,
      y,
      tx,
      ty,
      tile,
      loading,
      show,
      radius,
      width,
      dispatch
    } = this.props;

    if(loading){
      return (
        <g transform={`translate(${x} ${y})`}>
          <Loading radius={radius} width={width+2} />
        </g>
      );
    }

    if(show){
      return (
        <g transform={`translate(${x} ${y})`}>
          <RadialMenu
          cx={0}
          cy={0}
          showMenu={true}
          center={undefined}
          menuTree={[
            createRing(radius, width, [
              ...tileMenuItems(tile, Math.floor(tx), Math.floor(ty), dispatch)
            ]),
            {
              ringKey: 2,
              radius: radius,
              width: width,
              fromTurnFraction: 1/8,
              toTurnFraction: 3/8,
              show: true,
              menuItems: [
                acceptMenuItem(dispatch)
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

function *tileMenuItems(tile : string, tx : number, ty : number, dispatch : Dispatch<any>){
  if(tile == 'wire' || tile == 'empty'){
    yield toUnderpassMenuItem(dispatch, tx, ty);
  }
  if(tile == 'underpass' || tile == 'empty'){
    yield toWireMenuItem(dispatch, tx, ty);
  }
  //if(tile == 'gate'){
  //  yield moveMenuItem(dispatch, tx, ty);
  //}
  if(tile != 'empty'){
    yield removeMenuItem(dispatch, tx, ty);
  }
}