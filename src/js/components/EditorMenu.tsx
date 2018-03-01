import * as React from 'react';
import { Dispatch } from 'redux';
import { Tool, Direction } from 'ekkiog-editing';

import RadialMenu from './radialMenu';

import IconWire from './icons/IconWire';
import IconUnderpass from './icons/IconUnderpass';
import IconButton from './icons/IconButton';
import IconGate from './icons/IconGate';
import IconLight from './icons/IconLight';
import IconReturn from './icons/IconReturn';
import IconAccept from './icons/IconAccept';
import IconRemove from './icons/IconRemove';
import IconCancel from './icons/IconCancel';

import {
  wireMenuItem,
  buttonMenuItem,
  gateMenuItem,
  underpassMenuItem,
  lightMenuItem,
  menuItem
} from './radialMenu/menuItems';

import { toggleEditorMenu, setToolDirection, okCancel } from '../actions';
import { State } from '../reduce';
import { EditorState } from '../reduce/editor';
import { EditorMenuState, OkCancelMenuState, ToolsMenuState, ContextMenuState } from '../reduce/editorMenu';

export interface Props {
  cx : number,
  cy : number,
  radius : number,
  gap : number,
  width : number,
  editor : EditorState,
  editorMenu : EditorMenuState,
  dispatch : Dispatch<State>
}

export default class EditorMenu extends React.Component<Props, any> {
  shouldComponentUpdate(nextProps : Props){
    return nextProps.cx !== this.props.cx
      || nextProps.cy !== this.props.cy
      || nextProps.radius !== this.props.radius
      || nextProps.gap !== this.props.gap
      || nextProps.width !== this.props.width
      || nextProps.editor !== this.props.editor
      || nextProps.editorMenu !== this.props.editorMenu;
  }

  render(){
    const {
      cx,
      cy,
      radius,
      gap,
      width,
      editor,
      editorMenu,
      dispatch
    } = this.props;
    return (
      <RadialMenu
        cx={cx}
        cy={cy}
        showMenu={editorMenu.menuType != null && editorMenu.open}
        center={createCenter(radius, editor, editorMenu, dispatch)}
        menuTree={getMenuTree(radius+gap, width, editor, editorMenu, dispatch)} />
    );
  };
}

function getMenuTree(radius : number, width : number, editor : EditorState, editorMenu : EditorMenuState, dispatch : Dispatch<State>){
  return createMenuTree(
    editor,
    editorMenu,
    dispatch
  ).map((ring, index) => ({
    show: editorMenu.menuType != null && editorMenu.open,
    radius: radius + (width+20)*index,
    width,
    fromTurnFraction: 1/2,
    toTurnFraction: 3/4,
    ringKey: index,
    ...ring
  }));
}

function createMenuTree(editor : EditorState, editorMenu : EditorMenuState, dispatch : Dispatch<State>){
  switch(editorMenu.menuType){
    case 'tools':
      return [...createToolsMenuTree(editor, dispatch)];
    case 'okCancel':
      return createOkCancelMenuTree(editorMenu, dispatch);
    default:
      return [];
  }
}

function* createToolsMenuTree(editor : EditorState, dispatch : Dispatch<State>){
  yield {
    menuItems: [
      menuItem('return', <IconReturn />, () => dispatch(toggleEditorMenu()))
    ]
  };

  yield {
    menuItems: [
      buttonMenuItem(editor.selectedTool, dispatch),
      lightMenuItem(editor.selectedTool, dispatch),
      gateMenuItem(editor.selectedTool, dispatch),
      underpassMenuItem(editor.selectedTool, dispatch),
      wireMenuItem(editor.selectedTool, dispatch)
    ]
  };

  if(editor.selectedTool === 'button'){
    yield {
      menuItems: [
        menuItem('downwards', <IconButton rotate={90} />, () => dispatch(setToolDirection('downwards')), editor.toolDirection == 'downwards'),
        menuItem('leftwards', <IconButton rotate={180} />, () => dispatch(setToolDirection('leftwards')), editor.toolDirection == 'leftwards'),
        menuItem('upwards', <IconButton rotate={270} />, () => dispatch(setToolDirection('upwards')), editor.toolDirection == 'upwards'),
        menuItem('rightwards', <IconButton rotate={0} />, () => dispatch(setToolDirection('rightwards')), editor.toolDirection == 'rightwards')
      ]
    };
  }else if(editor.selectedTool === 'light'){
    yield {
      menuItems: [
        menuItem('downwards', <IconLight rotate={90} />, () => dispatch(setToolDirection('downwards')), editor.toolDirection == 'downwards'),
        menuItem('leftwards', <IconLight rotate={180} />, () => dispatch(setToolDirection('leftwards')), editor.toolDirection == 'leftwards'),
        menuItem('upwards', <IconLight rotate={270} />, () => dispatch(setToolDirection('upwards')), editor.toolDirection == 'upwards'),
        menuItem('rightwards', <IconLight rotate={0} />, () => dispatch(setToolDirection('rightwards')), editor.toolDirection == 'rightwards')
      ]
    };
  }
}

function createOkCancelMenuTree(editorMenu : OkCancelMenuState, dispatch : Dispatch<State>){
  return [
    {
      menuItems: [
        menuItem('ok', <IconAccept />, () => dispatch(okCancel(true)), false, editorMenu.isValid),
        menuItem('cancel', <IconCancel />, () => dispatch(okCancel(false)))
      ]
    }
  ];
}

function createCenter(radius : number, editor : EditorState, editorMenu : EditorMenuState, dispatch : Dispatch<State>){
  switch(editorMenu.menuType){
    case 'tools':
      return createToolsCenter(radius, editor.selectedTool, editor.toolDirection, editorMenu.open, dispatch);
    default:
      return undefined;
  }
}

function createToolsCenter(radius : number, selectedTool : Tool, direction : Direction, open : boolean, dispatch : Dispatch<State>){
  return {
    radius: radius,
    cx: open ? radius : -radius*1.5,
    cy: open ? radius : -radius*1.5,
    onClick: () => dispatch(toggleEditorMenu()),
    icon:
      selectedTool == 'wire' ? <IconWire /> :
      selectedTool == 'button' ? <IconButton rotate={degree(direction)} /> :
      selectedTool == 'gate' ? <IconGate /> :
      selectedTool == 'underpass' ? <IconUnderpass /> :
      selectedTool == 'light' ? <IconLight rotate={degree(direction)} /> : <g />
  };
}

function degree(direction : Direction){
  switch(direction){
    case 'downwards': return 90;
    case 'leftwards': return 180;
    case 'upwards': return 270;
    case 'rightwards': return 0;
    default: return 0;
  }
}