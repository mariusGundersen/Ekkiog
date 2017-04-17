import * as React from 'react';

import Menu from './Menu';
import WebGLCanvas from './WebGLCanvas';
import NavBar from './NavBar';

import style from './main.css';

export default () => (
  <div className={style.root}>
    <Menu />
    <WebGLCanvas />
    <NavBar />
  </div>
);