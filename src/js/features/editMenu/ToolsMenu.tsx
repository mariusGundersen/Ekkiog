import * as React from 'react';
import style from './editMenu.scss';
import theme from '../../components/theme.scss';
import IconButton from '../../components/icons/IconButton';
import IconGate from '../../components/icons/IconGate';
import IconLight from '../../components/icons/IconLight';
import IconUndo from 'react-icons/fa/rotate-left';
import IconRedo from 'react-icons/fa/repeat';
import IconPackage from '../../components/icons/IconPackage';
import classes from '../../components/classes';

export interface ToolsMenuProps {
  insertButton(): void;
  insertGate(): void;
  insertLight(): void;
  findComponent(): void;
  undoCount: number;
  redoCount: number;
  undo(): void;
  redo(): void;
};

export default function ToolsMenu(props: ToolsMenuProps) {
  return (<div className={style.toolsMenu}>
    <span className={style.buttonGroup}>
      <button className={classes(style.editButton, props.undoCount === 0 ? style.disabled : '')} onClick={props.undo}>
        <span className={theme.icon}>
          <IconUndo />
        </span>
      </button>
      <button className={classes(style.editButton, props.redoCount === 0 ? style.disabled : '')} onClick={props.redo}>
        <span className={theme.icon}>
          <IconRedo />
        </span>
      </button>
    </span>
    <button className={style.editButton} onClick={props.insertButton}>
      <span className={theme.icon48}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconButton />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.insertGate}>
      <span className={theme.icon48}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconGate />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.insertLight}>
      <span className={theme.icon48}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconLight />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.findComponent}>
      <span className={theme.icon48}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconPackage />
        </svg>
      </span>
    </button>
  </div>);
}
