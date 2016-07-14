export default function loadImage(src){
  return new Promise((res, rej) => {
    const image = new Image();
    image.addEventListener("load", () => res(image));
    image.addEventListener('error', rej);
    image.src = src;
  })
}