import { Item, Area } from '../../editing';

import textFromItem from './textFromItem';

import QuadList from '../buffers/QuadList'

import { AtomicBind } from '../buffers/types';

export type ItemTexts = {
  next?: ItemTexts,
  size: number,
  item: Item
};

type ItemChain = ItemTexts | { next?: ItemTexts, size: number, item: null };

export default class TextScene {
  readonly quadList: QuadList;
  private readonly itemChain: ItemChain;
  constructor(gl: WebGLRenderingContext, atomicBind: AtomicBind) {
    this.quadList = new QuadList(gl, atomicBind);
    this.itemChain = {
      size: 0,
      item: null
    };
  }

  insertItem(item: Item, area: Area) {
    const characters = textFromItem(item, area);
    if (characters.length == 0) return;

    let size = 0;
    let itemLink = this.itemChain;
    while (itemLink.next) {
      itemLink = itemLink.next;
      size += itemLink.size;
    }

    characters.forEach((char, i) => this.quadList.set(size + i, char));
    itemLink.next = {
      item,
      size: characters.length
    };
  }

  removeItem(item: Item) {
    let count = 0;
    let size = 0;
    let itemLink = this.itemChain;
    while (itemLink.next) {
      if (itemLink.next.item === item) {
        count = itemLink.next.size;
        itemLink.next = itemLink.next.next;
        break;
      }
      itemLink = itemLink.next;
      size += itemLink.size;
    }
    this.quadList.remove(size, count);
  }

  updateItem(before: Item, after: Item) {
    let itemLink = this.itemChain;
    while (itemLink.next) {
      itemLink = itemLink.next;
      if (itemLink.item === before) {
        itemLink.item = after;
        break;
      }
    }
  }
}
