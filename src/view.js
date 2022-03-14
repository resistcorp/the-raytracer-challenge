import Canvas from "./canvas.js";
import { make } from "./lib.js";
import { M4x4, translation } from "./matrices.js";
import { createRay } from "./rays.js";
import Tuples, { createPoint, createVector } from "./tuples.js";

export function lookAt(cameraPosition, target, up){
  const upn = Tuples.normalize(up);
  const forwardVector = Tuples.normalize(Tuples.sub(target, cameraPosition));
  const leftVector = Tuples.normalize(Tuples.cross(forwardVector, upn));
  const upVector = Tuples.normalize(Tuples.cross(leftVector, forwardVector));

  const rotation = M4x4(
    leftVector.x, leftVector.y, leftVector.z, 0,
    upVector.x, upVector.y, upVector.z, 0,
    -forwardVector.x, -forwardVector.y, -forwardVector.z, 0,
    0, 0, 0, 1
  );
  const {x, y, z} = cameraPosition;
  return rotation.mul(translation(-x, -y, -z));
}

//fov may be either horizontal or vertical, depending on the aspect ratio (whichever is larger)
export function createCamera(hsize, vsize, fov){
  const transform = M4x4.identity();
  const halfView = Math.tan(fov/2);
  const aspect = hsize/vsize;
  let halfWidth;
  let halfHeight;
  if(aspect >= 1){
    halfWidth = halfView;
    halfHeight = halfView / aspect;
  }else{
    halfHeight = halfView;
    halfWidth = halfView * aspect;
  }
  const pixelSize = halfWidth *2 / hsize;
  return make(CAMERA_PROTOTYPE, { hsize, vsize, fov, pixelSize, halfHeight, halfWidth }).setTransform(transform);
}

const CAMERA_PROTOTYPE = {
  setTransform : function (transform) {
    this.transform = transform;
    this.inverseTr = transform.inversed();
    return this;
  },
  lookAt : function (center, target, up) {
    return this.setTransform(lookAt(center, target, up));
  },
  ray : function(pixelX, pixelY){
    const origin = this.inverseTr.transform(createPoint(0, 0, 0));
    const offsetX = this.pixelSize * (pixelX + 0.5);
    const offsetY = this.pixelSize * (pixelY + 0.5);

    const worldX = this.halfWidth - offsetX;
    const worldY = this.halfHeight - offsetY;

    const pixel = this.inverseTr.transform(createPoint(worldX, worldY, -1, 0, 0));

    const direction = Tuples.normalize(Tuples.sub(pixel, origin));
    return createRay(origin, direction);
  },
  render: function(world, canvas){
    canvas ||= Canvas.create(this.hsize, this.vsize);

    for(let j = 0; j < this.vsize; ++j){
      for(let i = 0; i < this.hsize; ++i){
        const ray = this.ray(i, j);
        const color = world.colorAt(ray);
        Canvas.writePixel(canvas, i, j, color);
      }
    }

    return canvas;
  }
}
