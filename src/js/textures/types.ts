import { vec2 } from 'gl-matrix';

export interface VertexBuffer {
  bind() : void;
  draw() : void;
}

export interface TextureBuffer {
  sampler2D(index : number) : number;
  readonly size : vec2;
  readonly inverseSize : vec2;
}

export interface FrameBuffer {
  bindFramebuffer() : void;
  unbindFramebuffer() : void;
}

export interface RenderContext {
  readonly tileSize : number;
  readonly triangle : VertexBuffer;
  readonly wordQuadList : VertexBuffer;
  readonly spriteSheetTexture : TextureBuffer & { readonly ready : boolean };
  readonly chargeMapTexture : TextureBuffer & FrameBuffer;
  readonly tileMapTexture : TextureBuffer & FrameBuffer;
  readonly netChargeTextures : [TextureBuffer & FrameBuffer, TextureBuffer & FrameBuffer];
  readonly netMapTexture : TextureBuffer;
  readonly mapTexture : TextureBuffer;
  readonly gatesTexture : TextureBuffer;
}

export interface AtomicBind {
  (vbo : VertexBuffer) : void;
}