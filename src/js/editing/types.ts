import {
  MutableContext as ContextToEdit
} from 'ekkiog-editing';


export type Tool = 'wire' | 'gate' | 'underpass' | 'button' | 'component' | 'light';

export interface MutableContext extends ContextToEdit{
  updateDataTextures() : void;
}
