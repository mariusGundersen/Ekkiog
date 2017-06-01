import * as React from 'react';

import pure from './pure';

import style from './mainMenu.scss';

import storage from '../storage';

export interface Props {

}

export default pure((a, b) => true,
  (props : Props) => (
  <div
    className={style.mainMenu}>
    <button onClick={exportDb}>Export</button>
    <div className={style.version}>
      Version: {__BuildDate__}
    </div>
  </div>
));

function exportDb(event : React.SyntheticEvent<HTMLButtonElement>){
  const w = window.open("about:blank");
  storage.export().then(json => w.document.location.href = `data:attachment/file;base64,${btoa(JSON.stringify(json))}`);
}