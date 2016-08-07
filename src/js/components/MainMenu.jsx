import React from 'react';
import {connect} from 'react-redux';

import RadialMenu from './RadialMenu.jsx';

import IconWire from './icons/IconWire.jsx';
import IconUnderpass from './icons/IconUnderpass.jsx';
import IconButton from './icons/IconButton.jsx';
import IconGate from './icons/IconGate.jsx';
import IconReturn from './icons/IconReturn.jsx';

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
            },
            {
              tool: 'underpass',
              selected: selectedTool === 'underpass',
              onClick: () => dispatch(setSelectedTool('underpass')),
              icon: <IconUnderpass />
            }
          ]
        }
      ]} />
  );
});

export default MainMenu;