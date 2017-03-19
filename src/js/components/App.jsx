import React from 'react';
import {connect} from 'react-redux';

import Menu from './Menu.jsx';
import WebGLCanvas from './WebGLCanvas.jsx';
import NavBar from './NavBar.jsx';

import style from './main.css';

const App = connect(
  state => ({
    width: state.width,
    height: state.height,
  })
)(props => (
  <div className={style.root}>
    <Menu />
    <WebGLCanvas />
    <NavBar />
  </div>
));

export default App;