import {point} from "./tuples.js";
import {rotation_z, translation} from "./matrices.js";
import Canvas from "./canvas.js";

function isNode(){
  return !isHTML();
}
function isHTML(){
  try{
    return window && document;
  }catch(e){}
  return false;
}
export function play(){
  const $ = id => + document.getElementById(id).value;

  let w = $("width");
  let h = $("height");
  let T = translation(0, -h * 4/10, 0);
  let center = translation(w/2, h/2, 0);
  let mtx = T;
  let cnv = Canvas.create(w, h);
  for(let i = 0; i < 12; ++i){

    let p = T.transform(point(0, 0, 0));
    let R = rotation_z(i * Math.PI / 6);
    p = R.transform(p);
    p = center.transform(p);
    Canvas.writePixel(cnv, p.x, p.y, Canvas.makeColor(0.0, 1.0, 0.0, 1.0));
  }
  let destCnv = document.getElementById("cnv");
  let { width, height } = cnv;
  destCnv.width = width;
  destCnv.height = height;
  let ctx = destCnv.getContext("2d");
  // let imageData = ctx.getImageData(0, 0, width, height);
  let imageData = new ImageData(width, height);
  Canvas.populateImageData(cnv, imageData.data);
  ctx.putImageData(imageData, 0, 0);

  return false;
}