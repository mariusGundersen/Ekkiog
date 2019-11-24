import { vec2 } from 'gl-matrix';

export interface VertexBuffer {
  bind(): void;
  draw(output: FrameBuffer): void;
}

export interface TextureBuffer {
  sampler2D(index: number): number;
  readonly width: number;
  readonly height: number;
  readonly size: vec2;
  readonly inverseSize: vec2;
}

export interface FrameBuffer extends Bindable {
  readonly width: number;
  readonly height: number;
  clear(r?: number, g?: number, b?: number, a?: number): void;
  bind(): void;
}

export interface Bindable {
  _bind(): void;
}

export type AtomicBind = (bindable: Bindable) => (() => void);