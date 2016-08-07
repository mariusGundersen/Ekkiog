import React from 'react';
import {connect} from 'react-redux';

import RadialMenu from './RadialMenu.jsx';
import IconWire from './IconWire.jsx';
import IconUnderpass from './IconUnderpass.jsx';
import IconButton from './IconButton.jsx';
import IconGate from './IconGate.jsx';
import IconReturn from './IconReturn.jsx';

import {setSelectedTool, toggleMainMenu} from '../actions.js';

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
          selectedTool == 'gate' ? <IconGate /> : ''
      }}
      menuTree={[
        {
          radius: radius+gap,
          width: width,
          fromTurnFraction: 3/8,
          toTurnFraction: 7/8,
          show: showMenu,
          menuItems: [
            {
              tool: 'wire',
              selected: selectedTool === 'wire',
              onClick: () => dispatch(setSelectedTool('wire')),
              icon: <IconWire />
            },
            {
              tool: 'button',
              selected: selectedTool === 'button',
              onClick: () => dispatch(setSelectedTool('button')),
              icon: <IconButton />
            },
            {
              tool: 'gate',
              selected: selectedTool === 'gate',
              onClick: () => dispatch(setSelectedTool('gate')),
              icon: <IconGate />
            }
          ]
        }
      ]} />
  );
});

export default MainMenu;