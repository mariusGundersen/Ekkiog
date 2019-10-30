import * as React from 'react';
import style from './editMenu.scss';
import theme from '../../components/theme.scss';
import IconButton from '../../components/icons/IconButton';
import IconGate from '../../components/icons/IconGate';
import IconLight from '../../components/icons/IconLight';
import { EditorMenuState } from '../../reduce/editorMenu';
import { Dispatch } from 'redux';
import { Action, insertItem, okCancel } from '../../actions';
import IconAccept from '../../components/icons/IconAccept';
import IconCancel from '../../components/icons/IconCancel';
import pure from '../../components/pure';
import IconPackage from '../../components/icons/IconPackage';

export interface Props {
  findComponent(e: any): void
  editorMenu: EditorMenuState
  dispatch: Dispatch<Action>
}

export default pure(['editorMenu'], (props: Props) => {
  switch (props.editorMenu.menuType) {
    case 'tools':
      return (
        <div className={style.editMenu}>
          <ToolsMenu
            insertButton={() => props.dispatch(insertItem('button'))}
            insertGate={() => props.dispatch(insertItem('gate'))}
            insertLight={() => props.dispatch(insertItem('light'))}
            findComponent={() => props.findComponent(undefined)}
          />
        </div>
      );
    case 'okCancel':
      return (
        <div className={style.editMenu}>
          <OkCancelMenu
            isValid={props.editorMenu.isValid}
            ok={() => props.dispatch(okCancel(true))}
            cancel={() => props.dispatch(okCancel(false))}
          />
        </div>
      );
    default:
      return <></>;
  }
});

interface ToolsMenuProps {
  insertButton(): void;
  insertGate(): void;
  insertLight(): void;
  findComponent(): void;
};

const ToolsMenu = (props: ToolsMenuProps) => (
  <div className={style.toolsMenu}>
    <button className={style.editButton} onClick={props.insertButton}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconButton />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.insertGate}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconGate />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.insertLight}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconLight />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.findComponent}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconPackage />
        </svg>
      </span>
    </button>
  </div>
);

interface OkCancelMenuProps {
  isValid: boolean;
  ok(): void;
  cancel(): void;
};

const OkCancelMenu = pure(['isValid'], (props: OkCancelMenuProps) => (
  <div className={style.okCancelMenu}>
    <button className={style.editButton} onClick={props.ok} disabled={!props.isValid}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconAccept />
        </svg>
      </span>
    </button>
    <button className={style.editButton} onClick={props.cancel}>
      <span className={theme.icon}>
        <svg viewBox="-24 -24 48 48" width="1em" height="1em">
          <IconCancel />
        </svg>
      </span>
    </button>
  </div>
));
