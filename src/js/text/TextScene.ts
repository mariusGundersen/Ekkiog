import { Item, Area } from 'ekkiog-editing';

import textFromItem from './textFromItem';

export type ItemTexts = {
  size : number,
  item : Item
}

export default class TextScene{
  quadList : any;
  itemList : ItemTexts[];
  constructor(quadList : any){
    this.quadList = quadList;
    this.itemList = new Array<ItemTexts>();
  }

  insertItem(item : Item, area : Area){
    const characters = textFromItem(item, area);
    if(characters.length == 0) return;

    const size = this.itemList.reduce((sum, i) => sum + i.size, 0);

    characters.forEach((char, i) => this.quadList.set(size + i, char));
    this.itemList.push({
      item,
      size: characters.length
    });
  }

  removeItem(item : Item){
    let size = 0;
    let start = 0;
    let count = 0;
    let index = 0;
    for(const entry of this.itemList){
      if(entry.item === item){
        this.itemList.splice(index, 1);
        start = size;
        count = entry.size;
        size = 0;
      }else{
        size += entry.size;
      }
      index++;
    }
    this.quadList.remove(start, count, size);
  }

  updateItem(before : Item, after : Item){
    for(const entry of this.itemList){
      if(entry.item === before){
        entry.item = after;
      }
    }
  }
}