import { EPSILON, intersection, intersections, make } from "./lib.js";
import { material } from "./lighting.js";
import { M4x4 } from "./matrices.js";
import Tuples, { createPoint, createVector } from "./tuples.js";

function makeShape(proto, matrix, mtl) {
  return make(proto)
    .setTransform(matrix ?? M4x4.identity())
    .setMaterial(mtl ?? material());
  
}

export function sphere(matrix, mtl) {
  return makeShape(SPHERE, matrix, mtl);
}

export function plane(matrix, mtl) {
  return makeShape(PLANE, matrix, mtl);
}

export function testShape(matrix, mtl) {
  return makeShape(TEST, matrix, mtl);
}

const SHAPE = {
  isShape : true,
  transform: undefined,
  inverseTransform: undefined,
  material: undefined,
  setMaterial(material) {
    this.material = material;
    return this;
  },
  //warning : keeps a reference to the given matrix. Pass in single-use matrices.
  setTransform(matrix) {
    this.transform = matrix;
    this.inverseTransform = matrix.inversed();
    this.transpose = this.inverseTransform.transposed();
    return this;
  },
  normalAt(worldSpacePoint) {
    const objectSpacePoint = this.inverseTransform.transform(worldSpacePoint);

    const ret = this.transpose.transform(this.localNormalAt(objectSpacePoint));
    ret.w = 0.0;//some matrices may mess up the w, but this is easier than getting a submatrix
    return Tuples.normalize(ret);
  },
  localNormalAt(objectSpacePoint){
    return Tuples.normalize(Tuples.sub(objectSpacePoint, createPoint(0, 0, 0)));
  },
  localIntersect(){
    console.warn("trying to intersect 'abstract' shape");
    return [];
  }

};
const TEST  = make(SHAPE, {type : "test"});
const PLANE  = make(SHAPE, {
  type : "plane",
  localNormalAt(_objectSpacePoint){
    return createVector(0, 1, 0);
  },
  localIntersect(localRay){
    const {direction, origin} = localRay;
    if( Math.abs(direction.y) < EPSILON )
      return [];
    const t = - origin.y / direction.y;
    return [intersection(t, this)];
  }
});

const SPHERE = make(SHAPE, {
  type: "sphere",
  localIntersect(localRay){
    const sphToRay = Tuples.sub(localRay.origin, createPoint(0, 0, 0));

    //this is actually ray.direction's magnitude squared. Should really draw this one
    const a = Tuples.dot(localRay.direction, localRay.direction);
    const b = 2.0 * Tuples.dot(localRay.direction, sphToRay);
    const c = Tuples.dot(sphToRay, sphToRay) - 1.0;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0)
      return [];

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    return intersections(intersection(t1, this), intersection(t2, this));
  }
});
