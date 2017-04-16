import * as React from 'react';

import { connect } from 'react-redux';

import style from './navbar.css';

export default connect(store => ({
  name: store.editor.currentComponentName
}))(({
  name
}) => (
  <span className={style.statusBar}>
    {name}
  </span>
));