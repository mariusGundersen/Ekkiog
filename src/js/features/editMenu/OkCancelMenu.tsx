import * as React from 'react';
import style from './editMenu.scss';
import IconAccept from '../../components/icons/IconAccept';
import IconCancel from '../../components/icons/IconCancel';
import pure from '../../components/pure';
import theme from '../../components/theme.scss';

export interface OkCancelMenuProps {
  isValid: boolean;
  ok(): void;
  cancel(): void;
};

export default pure(['isValid'], (props: OkCancelMenuProps) => (
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
