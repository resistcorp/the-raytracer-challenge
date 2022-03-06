import Canvas from "./canvas.js";

export function isNode() {
  return !isHTML();
}
export function isHTML() {
  try {
    return window && document;
  } catch (e) { }
  return false;
}

export function drawCanvas(cnv) {
  let destCnv = document.getElementById("cnv");
  let { width, height } = cnv;
  destCnv.width = width;
  destCnv.height = height;
  let ctx = destCnv.getContext("2d");
  // let imageData = ctx.getImageData(0, 0, width, height);
  let imageData = new ImageData(width, height);
  Canvas.populateImageData(cnv, imageData.data);
  ctx.putImageData(imageData, 0, 0);

}