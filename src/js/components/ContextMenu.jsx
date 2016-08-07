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
  removeMenuItem
} from './radialMenu/menuItems.js';

const ContextMenu = connect()(({
  x,
  y,
  tx,
  ty,
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
        {
          ringKey: 1,
          radius: radius,
          width: width,
          fromTurnFraction: 5/8,
          toTurnFraction: 7/8,
          show: true,
          menuItems: [
            removeMenuItem(dispatch, tx, ty)
          ]
        },
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
