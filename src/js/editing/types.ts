import {
  MutableContext as ContextToEdit
} from 'ekkiog-editing';

export interface MutableContext extends ContextToEdit{
  updateDataTextures() : void;
}
