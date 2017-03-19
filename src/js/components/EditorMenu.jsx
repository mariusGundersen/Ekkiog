import React from 'react';
import {connect} from 'react-redux';

import RadialMenu from './RadialMenu.jsx';

import IconWire from './icons/IconWire.jsx';
import IconUnderpass from './icons/IconUnderpass.jsx';
import IconButton from './icons/IconButton.jsx';
import IconGate from './icons/IconGate.jsx';
import IconLight from './icons/IconLight.jsx';
import IconReturn from './icons/IconReturn.jsx';
import IconAccept from './icons/IconAccept.jsx';
import IconRemove from './icons/IconRemove.jsx';

import {
  wireMenuItem,
  buttonMenuItem,
  gateMenuItem,
  underpassMenuItem,
  lightMenuItem,
  menuItem
} from './radialMenu/menuItems.js';

import {toggleEditorMenu} from '../actions.js';

const EditorMenu = connect(
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
      showMenu={store.editorMenu.open}
      center={getCenter(radius, store, dispatch)}
      menuTree={getMenuTree(radius+gap, width, store, dispatch)} />
  );
});

export default EditorMenu;

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
    show: store.editorMenu.open,
    radius,
    width,
    fromTurnFraction: 3/8,
    toTurnFraction: 7/8,
    ringKey: index,
    ...ring
  }));
}

function createMenuTree(store, dispatch){
  switch(store.editorMenu.menuType){
    case 'tools':
      return createToolsMenuTree(store, dispatch);
    case 'okCancel':
      return createOkCancelMenuTree(store, dispatch);
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
        underpassMenuItem(editor.selectedTool, dispatch),
        lightMenuItem(editor.selectedTool, dispatch)
      ]
    }
  ];
}

function createOkCancelMenuTree({editorMenu}, dispatch){
  return [
    {
      menuItems: [
        menuItem('ok', <IconAccept />, () => editorMenu.okAction(), false, editorMenu.isValid),
        menuItem('cancel', <IconRemove />, () => editorMenu.cancelAction())
      ]
    }
  ];
}

function createCenter(store, dispatch){
  switch(store.editorMenu.menuType){
    case 'tools':
      return createToolsCenter(store, dispatch);
    default:
      return null;
  }
}

function createToolsCenter({editor, editorMenu}, dispatch){
  return {
    onClick: () => dispatch(toggleEditorMenu()),
    icon: editorMenu.open ? <IconReturn /> :
      editor.selectedTool == 'wire' ? <IconWire /> :
      editor.selectedTool == 'button' ? <IconButton /> :
      editor.selectedTool == 'gate' ? <IconGate /> :
      editor.selectedTool == 'underpass' ? <IconUnderpass /> :
      editor.selectedTool == 'light' ? <IconLight /> : ''
  };
}