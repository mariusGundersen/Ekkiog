import * as React from 'react';
import pure from './pure';
import style from './main.css';

export interface Props {
  readonly width: number
  readonly height: number
}

interface ForwardeRefProps extends Props {
  readonly forwardedRef: any
}

const compare = (a: ForwardeRefProps, b: ForwardeRefProps) => a.width !== b.width || a.height !== b.height;

const Canvas = pure(compare, props => (
  <canvas
    className={style.canvas}
    ref={props.forwardedRef}
    width={props.width}
    height={props.height} />
))

export default React.forwardRef<HTMLCanvasElement, Props>(
  (props, ref) => <Canvas forwardedRef={ref} {...props} />
);
