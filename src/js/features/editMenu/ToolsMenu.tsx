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
  readonly testScenario: boolean;
  insertButton(): void;
  insertGate(): void;
  insertLight(): void;
  findComponent(): void;
  readonly undoCount: number;
  readonly redoCount: number;
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
    {props.testScenario ? undefined : <SvgButton onClick={props.insertButton}>
      <IconButton />
    </SvgButton>}
    <SvgButton onClick={props.insertGate}>
      <IconGate />
    </SvgButton>
    {props.testScenario ? undefined : <SvgButton onClick={props.insertLight}>
      <IconLight />
    </SvgButton>}
    <SvgButton onClick={props.findComponent}>
      <IconPackage />
    </SvgButton>
  </div>);
}

function SvgButton(props: { onClick(): void, children?: JSX.Element }) {
  return (
    <button className={style.editButton} onClick={props.onClick}>
      <span className={theme.icon48}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          {props.children}
        </svg>
      </span>
    </button>
  );
}