import React from 'react';

import {
  setSelectedTool,
  hideContextMenu,
  removeTileAt
} from '../../actions.js';

import IconWire from '../icons/IconWire.jsx';
import IconButton from '../icons/IconButton.jsx';
import IconGate from '../icons/IconGate.jsx';
import IconUnderpass from '../icons/IconUnderpass.jsx';
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

export function removeMenuItem(dispatch, x, y){
  return menuItem('remove', <IconRemove />, () => dispatch(removeTileAt(x, y)), false);
}

export function acceptMenuItem(dispatch){
  return menuItem('accept', <IconAccept />, () => dispatch(hideContextMenu()), false);
}

function toolMenuItem(tool, icon, selectedTool, dispatch){
  return menuItem(tool, icon, () => dispatch(setSelectedTool(tool)), selectedTool === tool);
}

function menuItem(key, icon, action, selected){
  return {
    itemKey: key,
    icon,
    selected,
    onClick: action
  };
}