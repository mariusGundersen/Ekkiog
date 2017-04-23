import * as React from 'react';

import { connect } from 'react-redux';

import style from './navbar.scss';

export default connect(store => ({
  name: store.editor.currentComponentName
}))(({
  name
}) => (
  <span className={style.statusBar}>
    {name}
  </span>
));