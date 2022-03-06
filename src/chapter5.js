import Tuples, { point, vector } from "./tuples.js";
import { rotation_z, scaling, translation } from "./matrices.js";
import Canvas from "./canvas.js";
import { sphere } from "./primitives.js";
import { ray } from "./rays.js";
import { drawCanvas } from "./htmlLib.js";
import { hit, intersect } from "./lib.js";

export function play() {
  const $ = id => + document.getElementById(id).value || document.getElementById(id).checked;

  const w = $("width");
  const h = $("height");
  const distance = $("distance");

  const sphRadius = Math.min(w, h) * 0.4;
  const rayZ = - (sphRadius + distance);
  
  const sphereColor = Canvas.makeColor(0.8, 0.0, 0.2, 1.0);
  const backgroundColor = Canvas.makeColor(0.1, 0.1, 0.1, 1.0);
  const cnv = Canvas.create(w, h);
  const rayOrigin = point(0, 0, rayZ);
  const z_dir = vector(0, 0, 1);
  const ortho = $("orthogonal");

  const sph = sphere(scaling(sphRadius, sphRadius, sphRadius));
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      let r;
      const pointOnImagePlate = point(x - w/2, y - h/2, rayZ + 1);
      if(ortho){
        r = ray(pointOnImagePlate, z_dir);
      }else{//perspective
        const direction = Tuples.normalize(Tuples.sub(pointOnImagePlate, rayOrigin));
        r = ray(rayOrigin, direction);
      }
      const xs = intersect(r, sph);
      const theHit = hit(xs);
      const color = theHit ? sphereColor : backgroundColor;
      Canvas.writePixel(cnv, x, y, color);
    }
  }

  drawCanvas(cnv);

  return false;
}