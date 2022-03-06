import {point} from "./tuples.js";
import {rotation_z, translation} from "./matrices.js";
import Canvas from "./canvas.js";
import { drawCanvas } from "./htmlLib.js";

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
  drawCanvas(cnv);

  return false;
}