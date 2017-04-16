import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import RadialMenu from './RadialMenu';

import IconWire from './icons/IconWire';
import IconUnderpass from './icons/IconUnderpass';
import IconButton from './icons/IconButton';
import IconGate from './icons/IconGate';
import IconLight from './icons/IconLight';
import IconReturn from './icons/IconReturn';
import IconAccept from './icons/IconAccept';
import IconRemove from './icons/IconRemove';

import {
  wireMenuItem,
  buttonMenuItem,
  gateMenuItem,
  underpassMenuItem,
  lightMenuItem,
  menuItem
} from './radialMenu/menuItems';

import { toggleEditorMenu, setToolDirection } from '../actions';

import { Tool } from '../editing/types';

export interface Props {
  cx : number,
  cy : number,
  radius : number,
  gap : number,
  width : number,
  editor : any,
  editorMenu : any,
  dispatch : Dispatch<any>
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
        showMenu={editorMenu.open}
        center={createCenter(radius, editor, editorMenu, dispatch)}
        menuTree={getMenuTree(radius+gap, width, editor, editorMenu, dispatch)} />
    );
  };
}

function getMenuTree(radius : number, width : number, editor : any, editorMenu : any, dispatch : Dispatch<any>){
  return createMenuTree(
    editor,
    editorMenu,
    dispatch
  ).map((ring, index) => ({
    show: editorMenu.open,
    radius: radius + (width+20)*index,
    width,
    fromTurnFraction: 1/2,
    toTurnFraction: 3/4,
    ringKey: index,
    ...ring
  }));
}

function createMenuTree(editor : any, editorMenu : any, dispatch : Dispatch<any>){
  switch(editorMenu.menuType){
    case 'tools':
      return [...createToolsMenuTree(editor, dispatch)];
    case 'okCancel':
      return createOkCancelMenuTree(editorMenu, dispatch);
    default:
      return [];
  }
}

function* createToolsMenuTree(editor : any, dispatch : Dispatch<any>){
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
        menuItem('down', <IconButton rotate={90} />, () => dispatch(setToolDirection('down')), editor.toolDirection == 'down'),
        menuItem('left', <IconButton rotate={180} />, () => dispatch(setToolDirection('left')), editor.toolDirection == 'left'),
        menuItem('up', <IconButton rotate={270} />, () => dispatch(setToolDirection('up')), editor.toolDirection == 'up'),
        menuItem('right', <IconButton rotate={0} />, () => dispatch(setToolDirection('right')), editor.toolDirection == 'right')
      ]
    };
  }else if(editor.selectedTool === 'light'){
    yield {
      menuItems: [
        menuItem('down', <IconLight rotate={90} />, () => dispatch(setToolDirection('down')), editor.toolDirection == 'down'),
        menuItem('left', <IconLight rotate={180} />, () => dispatch(setToolDirection('left')), editor.toolDirection == 'left'),
        menuItem('up', <IconLight rotate={270} />, () => dispatch(setToolDirection('up')), editor.toolDirection == 'up'),
        menuItem('right', <IconLight rotate={0} />, () => dispatch(setToolDirection('right')), editor.toolDirection == 'right')
      ]
    };
  }
}

function createOkCancelMenuTree(editorMenu : any, dispatch : Dispatch<any>){
  return [
    {
      menuItems: [
        menuItem('ok', <IconAccept />, () => editorMenu.okAction(), false, editorMenu.isValid),
        menuItem('cancel', <IconRemove />, () => editorMenu.cancelAction())
      ]
    }
  ];
}

function createCenter(radius : number, editor : any, editorMenu : any, dispatch : Dispatch<any>){
  switch(editorMenu.menuType){
    case 'tools':
      return createToolsCenter(radius, editor.selectedTool, editorMenu.open, dispatch);
    default:
      return undefined;
  }
}

function createToolsCenter(radius : number, selectedTool : Tool, open : boolean, dispatch : Dispatch<any>){
  return {
    radius: radius,
    cx: open ? radius : -radius*1.5,
    cy: open ? radius : -radius*1.5,
    onClick: () => dispatch(toggleEditorMenu()),
    icon:
      selectedTool == 'wire' ? <IconWire /> :
      selectedTool == 'button' ? <IconButton /> :
      selectedTool == 'gate' ? <IconGate /> :
      selectedTool == 'underpass' ? <IconUnderpass /> :
      selectedTool == 'light' ? <IconLight /> : <g />
  };
}