import * as React from 'react';

export interface Props {
  readonly message : string
}

export default (props : Props) => (
  <div>
    <pre>{props.message}</pre>
  </div>
);