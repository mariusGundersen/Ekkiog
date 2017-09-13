const cache = new Map<string, HTMLImageElement>();

export default function getImage(src : string) : HTMLImageElement {
  return cache.get(src) || create(src);
}

export function ifOnlyWeHadTopLevelAwaitAndNotSyncModules(src : string) : Promise<void> {
  return new Promise(res => create(src).onload = () => res());
}

function create(src : string) : HTMLImageElement{
  const image = new Image();
  image.src = src;
  cache.set(src, image);
  return image;
}