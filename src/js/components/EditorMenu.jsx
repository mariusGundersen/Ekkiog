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

import {toggleEditorMenu, setToolDirection} from '../actions';

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
        center={createCenter(radius, editor, editorMenu, dispatch)}
        menuTree={getMenuTree(radius+gap, width, editor, editorMenu, dispatch)} />
    );
  };
}

function getMenuTree(radius, width, editor, editorMenu, dispatch){
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

function createMenuTree(editor, editorMenu, dispatch){
  switch(editorMenu.menuType){
    case 'tools':
      return [...createToolsMenuTree(editor, dispatch)];
    case 'okCancel':
      return createOkCancelMenuTree(editorMenu, dispatch);
    default:
      return [];
  }
}

function* createToolsMenuTree(editor, dispatch){
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

function createCenter(radius, editor, editorMenu, dispatch){
  switch(editorMenu.menuType){
    case 'tools':
      return createToolsCenter(radius, editor, editorMenu, dispatch);
    default:
      return null;
  }
}

function createToolsCenter(radius, editor, editorMenu, dispatch){
  return {
    radius: radius,
    cx: editorMenu.open ? radius : -radius*1.5,
    cy: editorMenu.open ? radius : -radius*1.5,
    onClick: () => dispatch(toggleEditorMenu()),
    icon:
      editor.selectedTool == 'wire' ? <IconWire /> :
      editor.selectedTool == 'button' ? <IconButton /> :
      editor.selectedTool == 'gate' ? <IconGate /> :
      editor.selectedTool == 'underpass' ? <IconUnderpass /> :
      editor.selectedTool == 'light' ? <IconLight /> : ''
  };
}