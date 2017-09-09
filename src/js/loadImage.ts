export default function loadImage(src : string) : HTMLImageElement {
  const image = new Image();
  image.src = src;
  return image;
}