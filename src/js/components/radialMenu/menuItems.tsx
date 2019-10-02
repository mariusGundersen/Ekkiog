import * as React from 'react';

import { Dispatch } from 'redux';
import { Tool, Direction } from '../../editing';

import {
  setSelectedTool,
  hideContextMenu,
  hideContextMenuAfter,
  removeTileAt,
  toUnderpass,
  toWire,
  moveItemAt,
  saveAfter,
  resetEditorMenu,
  Action,
  floodClearAt,
  rotateTileAt
} from '../../actions';

import IconWire from '../icons/IconWire';
import IconButton from '../icons/IconButton';
import IconGate from '../icons/IconGate';
import IconUnderpass from '../icons/IconUnderpass';
import IconLight from '../icons/IconLight';
import IconRemove from '../icons/IconRemove';
import IconAccept from '../icons/IconAccept';
import IconMove from '../icons/IconMove';
import { ThunkDispatch } from 'redux-thunk';
import { State } from '../../reduce';

export function wireMenuItem(selectedTool: Tool, dispatch: Dispatch<Action>) {
  return toolMenuItem('wire', <IconWire />, selectedTool, dispatch);
}

export function buttonMenuItem(selectedTool: Tool, dispatch: Dispatch<Action>) {
  return toolMenuItem('button', <IconButton />, selectedTool, dispatch);
}

export function gateMenuItem(selectedTool: Tool, dispatch: Dispatch<Action>) {
  return toolMenuItem('gate', <IconGate />, selectedTool, dispatch);
}

export function underpassMenuItem(selectedTool: Tool, dispatch: Dispatch<Action>) {
  return toolMenuItem('underpass', <IconUnderpass />, selectedTool, dispatch);
}

export function lightMenuItem(selectedTool: Tool, dispatch: Dispatch<Action>) {
  return toolMenuItem('light', <IconLight />, selectedTool, dispatch);
}

export function removeMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number) {
  return menuItem('remove', <IconRemove />, () => dispatch(hideContextMenuAfter(saveAfter(removeTileAt(tx, ty), 'Removed item'))));
}

export function rotateMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number, direction: Direction, icon: JSX.Element) {
  return menuItem('rotate-' + direction, icon, () => dispatch(hideContextMenuAfter(saveAfter(rotateTileAt(tx, ty, direction), 'Rotated item'))));
}

export function floodClearMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number) {
  return menuItem('floodClear', <IconRemove />, () => dispatch(hideContextMenuAfter(saveAfter(floodClearAt(tx, ty), 'Removed wire'))));
}

export function toUnderpassMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number) {
  return menuItem('toUnderpass', <IconUnderpass />, () => dispatch(hideContextMenuAfter(saveAfter(toUnderpass(tx, ty), 'Converted wire to underpass'))));
}
export function toWireMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number) {
  return menuItem('toWire', <IconWire />, () => dispatch(hideContextMenuAfter(saveAfter(toWire(tx, ty), 'Converted underpass to wire'))));
}

export function acceptMenuItem(dispatch: Dispatch<Action>) {
  return menuItem('accept', <IconAccept />, () => {
    dispatch(resetEditorMenu());
    dispatch(hideContextMenu());
  });
}

export function moveMenuItem(dispatch: ThunkDispatch<State, any, Action>, tx: number, ty: number) {
  return menuItem('move', <IconMove />, () => dispatch(hideContextMenuAfter(moveItemAt(tx, ty))));
}

export function toolMenuItem(tool: Tool, icon: JSX.Element, selectedTool: Tool, dispatch: Dispatch<Action>) {
  return menuItem(tool, icon, () => dispatch(setSelectedTool(tool)), selectedTool === tool);
}

export function menuItem(key: string, icon: JSX.Element, action: () => void, selected = false, visible = true): MenuItem {
  return {
    itemKey: key,
    icon,
    selected,
    onClick: action,
    visible
  };
}

export interface MenuItem {
  itemKey: string;
  icon: JSX.Element;
  selected: boolean;
  onClick(): void;
  visible: boolean;
}
