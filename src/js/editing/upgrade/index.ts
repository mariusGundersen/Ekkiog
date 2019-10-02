import {
  Tool,
  Item
} from '../types';

import upgradeComponent from './component';

export interface UpgradableItem {
  type : Tool
}

export default function upgrade(item : UpgradableItem, size : {width : number, height : number}) : Item {
  switch(item.type){
    case 'component':
      return upgradeComponent(item as any, size);
    default:
      return item as any;
  }
}