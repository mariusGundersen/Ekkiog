import React from 'react';
import {connect} from 'react-redux';

import Loading from './radialMenu/Loading.jsx';
import RadialMenu from './RadialMenu.jsx';

import IconWire from './icons/IconWire.jsx';
import IconUnderpass from './icons/IconUnderpass.jsx';
import IconButton from './icons/IconButton.jsx';
import IconGate from './icons/IconGate.jsx';
import IconReturn from './icons/IconReturn.jsx';

import {
  acceptMenuItem,
  removeMenuItem,
  toUnderpassMenuItem,
  toWireMenuItem,
  moveMenuItem
} from './radialMenu/menuItems.js';

export default class ContextMenu extends React.Component{

  shouldComponentUpdate(nextProps, nextState){
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
          center={null}
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

function createRing(radius, width, items){
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

function *tileMenuItems(tile, tx, ty, dispatch){
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