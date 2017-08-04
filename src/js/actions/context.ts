import { Forest, Box } from 'ekkiog-editing';

export type NewContextAction = {
  readonly type : 'new-context',
  readonly name : string,
  readonly forest : Forest
}
export const newContext = (name : string, forest : Forest) : NewContextAction => ({
  type: 'new-context',
  name,
  forest
});

export type PushContextAction = {
  readonly type : 'push-context',
  readonly name : string,
  readonly forest : Forest,
  readonly boundingBox : Box,
  readonly centerX : number,
  readonly centerY : number
}
export const pushContext = (name : string, forest : Forest, boundingBox : Box, centerX : number, centerY : number) : PushContextAction => ({
  type: 'push-context',
  name,
  forest,
  boundingBox,
  centerX,
  centerY
});

export type PopContextAction = {
  readonly type : 'pop-context'
}
export const popContext = () : PopContextAction => ({
  type: 'pop-context'
});

export type ContextActions =
  NewContextAction |
  PushContextAction |
  PopContextAction;
