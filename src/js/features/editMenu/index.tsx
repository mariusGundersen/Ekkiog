import * as React from 'react';
import style from './editMenu.scss';
import { EditorMenuState } from '../../reduce/editorMenu';
import { Dispatch } from 'redux';
import { Action, insertItem, okCancel, undo, redo } from '../../actions';
import pure from '../../components/pure';
import ToolsMenu from './ToolsMenu';
import OkCancelMenu from './OkCancelMenu';

export interface Props {
  findComponent(e: any): void
  readonly editorMenu: EditorMenuState
  readonly dispatch: Dispatch<Action>
  readonly undoCount: number
  readonly redoCount: number
}

export default pure(['editorMenu', 'undoCount', 'redoCount'], (props: Props) => {
  switch (props.editorMenu.menuType) {
    case 'tools':
      return (
        <div className={style.editMenu}>
          <ToolsMenu
            insertButton={() => props.dispatch(insertItem('button'))}
            insertGate={() => props.dispatch(insertItem('gate'))}
            insertLight={() => props.dispatch(insertItem('light'))}
            findComponent={() => props.findComponent(undefined)}
            undo={() => props.dispatch(undo())}
            redo={() => props.dispatch(redo())}
            undoCount={props.undoCount}
            redoCount={props.redoCount}
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
