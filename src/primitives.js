import { make } from "./lib.js";
import { M4x4 } from "./matrices.js";

export function sphere(matrix) {
  const ret = make(SPHERE);
  ret.setTransform(matrix ?? M4x4.identity());
  return ret;
}

const SPHERE  = {
  type: "sphere",
  transform: undefined,
  inverseTransform: undefined,
  //warning : keeps a reference to the given matrix. Pass in single-use matrices.
  setTransform(matrix){
    this.transform = matrix;
    this.inverseTransform = matrix.inversed();
  }
}
