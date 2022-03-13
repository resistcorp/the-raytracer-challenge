import { make } from "./lib.js";
import { material } from "./lighting.js";
import { M4x4 } from "./matrices.js";
import Tuples, { createPoint, createVector } from "./tuples.js";

export function sphere(matrix, mtl) {
  const ret = make(SPHERE);
  ret.setTransform(matrix ?? M4x4.identity());
  ret.setMaterial(mtl ?? material());
  return ret;
}

const SPHERE  = {
  type: "sphere",
  transform: undefined,
  inverseTransform: undefined,
  setMaterial(material){
    this.material = material;
  },
  //warning : keeps a reference to the given matrix. Pass in single-use matrices.
  setTransform(matrix){
    this.transform = matrix;
    this.inverseTransform = matrix.inversed();
    this.transpose = this.inverseTransform.transposed();
  },
  normalAt(worldSpacePoint){
    const objectSpacePoint = this.inverseTransform.transform(worldSpacePoint);
    const objectSpaceNormal = Tuples.normalize(Tuples.sub(objectSpacePoint, createPoint(0, 0, 0)));
    const ret = this.transpose.transform(objectSpaceNormal);
    ret.w = 0.0;//some matrices may mess up the w, but this is easier than getting a submatrix
    return Tuples.normalize(ret);
  }
}
