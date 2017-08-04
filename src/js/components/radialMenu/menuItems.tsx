import * as React from 'react';

import { Dispatch } from 'redux';
import { Tool } from 'ekkiog-editing';

import {
  setSelectedTool,
  hideContextMenu,
  hideContextMenuAfter,
  removeTileAt,
  toUnderpass,
  toWire,
  moveItemAt,
  saveAfter
} from '../../actions';
import { State } from '../../reduce';

import IconWire from '../icons/IconWire';
import IconButton from '../icons/IconButton';
import IconGate from '../icons/IconGate';
import IconUnderpass from '../icons/IconUnderpass';
import IconLight from '../icons/IconLight';
import IconRemove from '../icons/IconRemove';
import IconAccept from '../icons/IconAccept';
import IconMove from '../icons/IconMove';

export function wireMenuItem(selectedTool : Tool, dispatch : Dispatch<State>){
  return toolMenuItem('wire', <IconWire />, selectedTool, dispatch);
}

export function buttonMenuItem(selectedTool : Tool, dispatch : Dispatch<State>){
  return toolMenuItem('button', <IconButton />, selectedTool, dispatch);
}

export function gateMenuItem(selectedTool : Tool, dispatch : Dispatch<State>){
  return toolMenuItem('gate', <IconGate />, selectedTool, dispatch);
}

export function underpassMenuItem(selectedTool : Tool, dispatch : Dispatch<State>){
  return toolMenuItem('underpass', <IconUnderpass />, selectedTool, dispatch);
}

export function lightMenuItem(selectedTool : Tool, dispatch : Dispatch<State>){
  return toolMenuItem('light', <IconLight />, selectedTool, dispatch);
}

export function removeMenuItem(dispatch : Dispatch<State>, tx : number, ty : number){
  return menuItem('remove', <IconRemove />, () => dispatch(hideContextMenuAfter(saveAfter(removeTileAt(tx, ty), 'Removed item'))));
}

export function toUnderpassMenuItem(dispatch : Dispatch<State>, tx : number, ty : number){
  return menuItem('toUnderpass', <IconUnderpass />, () => dispatch(hideContextMenuAfter(saveAfter(toUnderpass(tx, ty), 'Converted wire to underpass'))));
}
export function toWireMenuItem(dispatch : Dispatch<State>, tx : number, ty : number){
  return menuItem('toWire', <IconWire />, () => dispatch(hideContextMenuAfter(saveAfter(toWire(tx, ty), 'Converted underpass to wire'))));
}

export function acceptMenuItem(dispatch : Dispatch<State>){
  return menuItem('accept', <IconAccept />, () => dispatch(hideContextMenu()));
}

export function moveMenuItem(dispatch : Dispatch<State>, tx : number, ty : number){
  return menuItem('move', <IconMove />, () => dispatch(hideContextMenuAfter(moveItemAt(tx, ty))));
}

export function toolMenuItem(tool : Tool, icon : JSX.Element, selectedTool : Tool, dispatch : Dispatch<State>){
  return menuItem(tool, icon, () => dispatch(setSelectedTool(tool)), selectedTool === tool);
}

export function menuItem(key : string, icon : JSX.Element, action : () => void, selected=false, visible=true) : MenuItem{
  return {
    itemKey: key,
    icon,
    selected,
    onClick: action,
    visible
  };
}

export interface MenuItem {
  itemKey : string;
  icon : JSX.Element;
  selected : boolean;
  onClick() : void;
  visible : boolean;
}