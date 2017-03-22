import {
  Context as ContextToEdit,
  Texture as TextureToEdit
} from 'ekkiog-editing';


export type Tool = 'wire' | 'gate' | 'underpass' | 'button' | 'component' | 'light';

export interface Context extends ContextToEdit{
  mapTexture : Texture,
  netMapTexture : Texture,
  gatesTexture : Texture
}

export interface Texture extends TextureToEdit {
  update() : void
}
