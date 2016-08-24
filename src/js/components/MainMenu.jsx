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

const MainMenu = connect(
  (store) => ({
    store
  })
)(({
  cx,
  cy,
  radius,
  gap,
  width,
  store,
  dispatch
}) => {
  return (
    <RadialMenu
      cx={cx}
      cy={cy}
      showMenu={store.mainMenu.open}
      center={getCenter(radius, store, dispatch)}
      menuTree={getMenuTree(radius+gap, width, store, dispatch)} />
  );
});

export default MainMenu;

function getCenter(radius, store, dispatch){
  const center = createCenter(store, dispatch);
  return center && {
    radius,
    ...center
  };
}

function getMenuTree(radius, width, store, dispatch){
  return createMenuTree(
    store,
    dispatch
  ).map((ring, index) => ({
    show: store.mainMenu.open,
    radius,
    width,
    fromTurnFraction: 3/8,
    toTurnFraction: 7/8,
    ringKey: index,
    ...ring
  }));
}

function createMenuTree(store, dispatch){
  switch(store.mainMenu.menuType){
    case 'tools':
      return createToolsMenuTree(store, dispatch);
    default:
      return [];
  }
}

function createToolsMenuTree({editor}, dispatch){
  return [
    {
      menuItems: [
        wireMenuItem(editor.selectedTool, dispatch),
        buttonMenuItem(editor.selectedTool, dispatch),
        gateMenuItem(editor.selectedTool, dispatch),
        underpassMenuItem(editor.selectedTool, dispatch)
      ]
    }
  ];
}

function createCenter(store, dispatch){
  switch(store.mainMenu.menuType){
    case 'tools':
      return createToolsCenter(store, dispatch);
    default:
      return null;
  }
}

function createToolsCenter({editor, mainMenu}, dispatch){
  return {
    onClick: () => dispatch(toggleMainMenu()),
    icon: mainMenu.open ? <IconReturn /> :
      editor.selectedTool == 'wire' ? <IconWire /> :
      editor.selectedTool == 'button' ? <IconButton /> :
      editor.selectedTool == 'gate' ? <IconGate /> :
      editor.selectedTool == 'underpass' ? <IconUnderpass /> : ''
  };
}