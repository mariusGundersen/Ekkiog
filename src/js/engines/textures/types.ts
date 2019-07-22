import { vec2 } from 'gl-matrix';

export interface VertexBuffer {
  bind(): void;
  draw(): void;
}

export interface TextureBuffer {
  sampler2D(index: number): number;
  readonly width: number;
  readonly height: number;
  readonly size: vec2;
  readonly inverseSize: vec2;
}

export interface FrameBuffer {
  readonly width: number;
  readonly height: number;
  bindFramebuffer(): void;
  unbindFramebuffer(): void;
}

export interface RenderContext {
  readonly tileSize: number;
  readonly testPoints: VertexBuffer;
  readonly triangle: VertexBuffer;
  readonly wordQuads: VertexBuffer;
  readonly spriteSheetTexture: TextureBuffer;
  readonly chargeMapTexture: TextureBuffer & FrameBuffer;
  readonly tileMapTexture: TextureBuffer & FrameBuffer;
  readonly netChargeTextures: [TextureBuffer & FrameBuffer, TextureBuffer & FrameBuffer];
  readonly netMapTexture: TextureBuffer;
  readonly mapTexture: TextureBuffer;
  readonly gatesTexture: TextureBuffer;
  readonly testResultTexture: TextureBuffer & FrameBuffer;
}

export interface AtomicBind {
  (vbo: VertexBuffer): void;
}