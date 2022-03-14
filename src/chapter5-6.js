import Tuples, { point, vector } from "./tuples.js";
import { rotation_z, scaling, translation } from "./matrices.js";
import Canvas, { createColor } from "./canvas.js";
import { sphere } from "./primitives.js";
import { ray } from "./rays.js";
import { drawCanvas } from "./htmlLib.js";
import { hit, intersect } from "./lib.js";
import { lighting, material, pointLight } from "./lighting.js";

export function play() {
  const $ = id => + document.getElementById(id).value || document.getElementById(id).checked;

  const w = $("width");
  const h = $("height");
  const distance = $("distance");

  const sphRadius = 1.0;
  const rayZ = - (sphRadius + distance);
  
  const backgroundColor = createColor(0.1, 0.1, 0.1, 1.0);
  const cnv = Canvas.create(w, h);
  const rayOrigin = point(0, 0, rayZ);
  const z_dir = vector(0, 0, 1);
  const ortho = $("orthogonal");
  const shaded = $("shaded");
  const squished = $("squished")? 0.2 : 1.0;

  const light = pointLight(point(1 * sphRadius, 2 * sphRadius, -10 * sphRadius), createColor(1.0,1.0,1.0));
  const transform = scaling(sphRadius, sphRadius * squished, sphRadius);
  const mtl = material({ color: createColor(0.8, 0.0, 0.2, 1.0) });
  const sph = sphere(transform, mtl);
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      let r;
      const pointOnImagePlate = point(2 * x / w - 1, 2.0 * y / h - 1, rayZ + 0.001);
      if(ortho){
        r = ray(pointOnImagePlate, z_dir);
      }else{//perspective
        const direction = Tuples.normalize(Tuples.sub(pointOnImagePlate, rayOrigin));
        r = ray(rayOrigin, direction);
      }
      const xs = intersect(r, sph);
      const theHit = hit(xs);
      let color = backgroundColor;
      if(theHit){
        if(shaded){
          const prim = theHit.object;
          const hitPoint = r.at(theHit.t);
          const eyev = Tuples.negate(r.direction);
          const normal = prim.normalAt(hitPoint);
          color = lighting(prim.material, light, hitPoint, eyev, normal)
        }else{
          color = sph.material.color;
        }
      }
      Canvas.writePixel(cnv, x, y, color);
    }
  }

  drawCanvas(cnv);

  return false;
}