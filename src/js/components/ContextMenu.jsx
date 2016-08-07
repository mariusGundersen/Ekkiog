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
  toWireMenuItem
} from './radialMenu/menuItems.js';

const ContextMenu = connect()(({
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
}) => (
  <g transform={`translate(${x} ${y})`}>
    {loading ? <Loading radius={radius} width={width+2} /> : null}
    {show ? <RadialMenu
      cx={0}
      cy={0}
      showMenu={true}
      center={null}
      menuTree={[
        createRing(radius, width, [
          ...tileMenuItems(tile, tx, ty, dispatch)
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
      ]} /> : null}
  </g>
));

export default ContextMenu;

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
  if(tile == 'wire'){
    yield toUnderpassMenuItem(dispatch, tx, ty);
  }
  if(tile == 'underpass'){
    yield toWireMenuItem(dispatch, tx, ty);
  }
  if(tile != 'empty'){
    yield removeMenuItem(dispatch, tx, ty);
  }
}