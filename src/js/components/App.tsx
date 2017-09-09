import * as React from 'react';
import { connect } from 'react-redux';

import { State } from '../reduce';
import Edit from './Edit';
import Demo from './Demo';

export default connect((s : State) => ({
  name: s.page.name
}))(({name} : { name : string }) => {
  switch(name){
    case 'edit':
      return <Edit />
    case 'demo':
      return <Demo />
    default:
      return null;
  }
})