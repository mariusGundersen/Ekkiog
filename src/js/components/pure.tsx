import * as React from 'react';

export default function pure<TProps>(keys: (keyof TProps)[], component: (props: TProps) => JSX.Element) {
  return React.memo(component, (prevProps, nextProps) => {
    return keys.every(key => prevProps[key] === nextProps[key]);
  });
}
