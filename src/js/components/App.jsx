import React from 'react';
import {connect} from 'react-redux';

import Menu from './Menu.jsx';
import WebGLCanvas from './WebGLCanvas.jsx';

const App = connect(
  state => ({
    width: state.width,
    height: state.height,
  })
)(props => (
  <div className="root">
    <Menu />
    <WebGLCanvas />
  </div>
));

export default App;