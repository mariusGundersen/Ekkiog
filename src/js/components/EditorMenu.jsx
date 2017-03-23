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

export default class EditorMenu extends React.Component {
  shouldComponentUpdate(nextProps){
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
        center={getCenter(radius, editor, editorMenu, dispatch)}
        menuTree={getMenuTree(radius+gap, width, editor, editorMenu, dispatch)} />
    );
  };
}

function getCenter(radius, editor, editorMenu, dispatch){
  const center = createCenter(editor, editorMenu, dispatch);
  return center && {
    radius,
    ...center
  };
}

function getMenuTree(radius, width, editor, editorMenu, dispatch){
  return createMenuTree(
    editor,
    editorMenu,
    dispatch
  ).map((ring, index) => ({
    show: editorMenu.open,
    radius,
    width,
    fromTurnFraction: 3/8,
    toTurnFraction: 7/8,
    ringKey: index,
    ...ring
  }));
}

function createMenuTree(editor, editorMenu, dispatch){
  switch(editorMenu.menuType){
    case 'tools':
      return createToolsMenuTree(editor, dispatch);
    case 'okCancel':
      return createOkCancelMenuTree(editorMenu, dispatch);
    default:
      return [];
  }
}

function createToolsMenuTree(editor, dispatch){
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

function createOkCancelMenuTree(editorMenu, dispatch){
  return [
    {
      menuItems: [
        menuItem('ok', <IconAccept />, () => editorMenu.okAction(), false, editorMenu.isValid),
        menuItem('cancel', <IconRemove />, () => editorMenu.cancelAction())
      ]
    }
  ];
}

function createCenter(editor, editorMenu, dispatch){
  switch(editorMenu.menuType){
    case 'tools':
      return createToolsCenter(editor, editorMenu, dispatch);
    default:
      return null;
  }
}

function createToolsCenter(editor, editorMenu, dispatch){
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