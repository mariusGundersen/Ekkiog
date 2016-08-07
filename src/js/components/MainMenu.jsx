import React from 'react';
import {connect} from 'react-redux';

import RadialMenu from './RadialMenu.jsx';

import IconWire from './icons/IconWire.jsx';
import IconUnderpass from './icons/IconUnderpass.jsx';
import IconButton from './icons/IconButton.jsx';
import IconGate from './icons/IconGate.jsx';
import IconReturn from './icons/IconReturn.jsx';

import {
  wireMenuItem,
  buttonMenuItem,
  gateMenuItem,
  underpassMenuItem
} from './radialMenu/menuItems.js';

import {toggleMainMenu} from '../actions.js';

const MainMenu = connect()(({
  cx,
  cy,
  radius,
  gap,
  width,
  showMenu,
  selectedTool,
  dispatch
}) => {
  return (
    <RadialMenu
      cx={cx}
      cy={cy}
      showMenu={showMenu}
      center={{
        radius: radius,
        onClick: () => dispatch(toggleMainMenu()),
        icon: showMenu ? <IconReturn /> :
          selectedTool == 'wire' ? <IconWire /> :
          selectedTool == 'button' ? <IconButton /> :
          selectedTool == 'gate' ? <IconGate /> :
          selectedTool == 'underpass' ? <IconUnderpass /> : ''
      }}
      menuTree={[
        {
          radius: radius+gap,
          width: width,
          fromTurnFraction: 3/8,
          toTurnFraction: 7/8,
          show: showMenu,
          ringKey: 0,
          menuItems: [
            wireMenuItem(selectedTool, dispatch),
            buttonMenuItem(selectedTool, dispatch),
            gateMenuItem(selectedTool, dispatch),
            underpassMenuItem(selectedTool, dispatch)
          ]
        }
      ]} />
  );
});

export default MainMenu;