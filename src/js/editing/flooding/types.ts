import {
  Pos
} from 'ennea-tree';

export interface Context {
  net : number,
  pos : Pos,
  prev : Pos
}

export interface FloodSourceWire extends Pos {
  type : 'wire',
  net : number
}

export interface FloodSourceGate extends Pos {
  type : 'gate',
  net : number
}

export interface FloodSourceUnderpass extends Pos {
  type : 'underpass',
  net : number
}

export interface FloodSourceButton extends Pos {
  type : 'button',
  net : number
}

export interface FloodSourceComponent extends Pos {
  type : 'component',
  net : number,
  dx : number,
  dy : number
}

export type FloodSource = FloodSourceWire
  | FloodSourceGate
  | FloodSourceUnderpass
  | FloodSourceButton
  | FloodSourceComponent;