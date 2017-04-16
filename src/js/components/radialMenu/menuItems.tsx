import * as React from 'react';

import { Dispatch } from 'redux';

import {
  setSelectedTool,
  hideContextMenu,
  hideContextMenuAfter,
  removeTileAt,
  toUnderpass,
  toWire,
  moveGate
} from '../../actions';

import {
  Tool
} from '../../editing/types';

import IconWire from '../icons/IconWire';
import IconButton from '../icons/IconButton';
import IconGate from '../icons/IconGate';
import IconUnderpass from '../icons/IconUnderpass';
import IconLight from '../icons/IconLight';
import IconMove from '../icons/IconMove';
import IconRemove from '../icons/IconRemove';
import IconAccept from '../icons/IconAccept';

export function wireMenuItem(selectedTool : Tool, dispatch : Dispatch<any>){
  return toolMenuItem('wire', <IconWire />, selectedTool, dispatch);
}

export function buttonMenuItem(selectedTool : Tool, dispatch : Dispatch<any>){
  return toolMenuItem('button', <IconButton />, selectedTool, dispatch);
}

export function gateMenuItem(selectedTool : Tool, dispatch : Dispatch<any>){
  return toolMenuItem('gate', <IconGate />, selectedTool, dispatch);
}

export function underpassMenuItem(selectedTool : Tool, dispatch : Dispatch<any>){
  return toolMenuItem('underpass', <IconUnderpass />, selectedTool, dispatch);
}

export function lightMenuItem(selectedTool : Tool, dispatch : Dispatch<any>){
  return toolMenuItem('light', <IconLight />, selectedTool, dispatch);
}

export function moveMenuItem(dispatch : Dispatch<any>, tx : number, ty : number){
  return menuItem('move', <IconMove />, () => dispatch(moveGate(tx, ty)));
}

export function removeMenuItem(dispatch : Dispatch<any>, tx : number, ty : number){
  return menuItem('remove', <IconRemove />, () => dispatch(hideContextMenuAfter(removeTileAt(tx, ty))));
}

export function toUnderpassMenuItem(dispatch : Dispatch<any>, tx : number, ty : number){
  return menuItem('toUnderpass', <IconUnderpass />, () => dispatch(hideContextMenuAfter(toUnderpass(tx, ty))));
}
export function toWireMenuItem(dispatch : Dispatch<any>, tx : number, ty : number){
  return menuItem('toWire', <IconWire />, () => dispatch(hideContextMenuAfter(toWire(tx, ty))));
}

export function acceptMenuItem(dispatch : Dispatch<any>){
  return menuItem('accept', <IconAccept />, () => dispatch(hideContextMenu()));
}

export function toolMenuItem(tool : Tool, icon : JSX.Element, selectedTool : Tool, dispatch : Dispatch<any>){
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