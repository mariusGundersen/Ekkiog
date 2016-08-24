import React from 'react';

import {
  setSelectedTool,
  hideContextMenu,
  removeTileAt,
  toUnderpass,
  toWire,
  moveGate
} from '../../actions.js';

import IconWire from '../icons/IconWire.jsx';
import IconButton from '../icons/IconButton.jsx';
import IconGate from '../icons/IconGate.jsx';
import IconUnderpass from '../icons/IconUnderpass.jsx';
import IconMove from '../icons/IconMove.jsx';
import IconRemove from '../icons/IconRemove.jsx';
import IconAccept from '../icons/IconAccept.jsx';

export function wireMenuItem(selectedTool, dispatch){
  return toolMenuItem('wire', <IconWire />, selectedTool, dispatch);
}

export function buttonMenuItem(selectedTool, dispatch){
  return toolMenuItem('button', <IconButton />, selectedTool, dispatch);
}

export function gateMenuItem(selectedTool, dispatch){
  return toolMenuItem('gate', <IconGate />, selectedTool, dispatch);
}

export function underpassMenuItem(selectedTool, dispatch){
  return toolMenuItem('underpass', <IconUnderpass />, selectedTool, dispatch);
}

export function moveMenuItem(dispatch, tx, ty){
  return menuItem('move', <IconMove />, () => dispatch(moveGate(tx, ty)));
}

export function removeMenuItem(dispatch, tx, ty){
  return menuItem('remove', <IconRemove />, () => dispatch(removeTileAt(tx, ty)));
}

export function toUnderpassMenuItem(dispatch, tx, ty){
  return menuItem('toUnderpass', <IconUnderpass />, () => dispatch(toUnderpass(tx, ty)));
}
export function toWireMenuItem(dispatch, tx, ty){
  return menuItem('toWire', <IconWire />, () => dispatch(toWire(tx, ty)));
}

export function acceptMenuItem(dispatch){
  return menuItem('accept', <IconAccept />, () => dispatch(hideContextMenu()));
}

export function toolMenuItem(tool, icon, selectedTool, dispatch){
  return menuItem(tool, icon, () => dispatch(setSelectedTool(tool)), selectedTool === tool);
}

export function menuItem(key, icon, action, selected=false){
  return {
    itemKey: key,
    icon,
    selected,
    onClick: action
  };
}