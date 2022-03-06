import { epsilonEquals } from "./lib.js";
export function tuple(x, y, z, w) {
  return { x, y, z, w };
}
export function point(x, y, z) {
  return { x, y, z, w: 1.0 };
}
export function vector(x, y, z) {
  return { x, y, z, w: 0.0 };
}

const Tuples = { 
  tuple,point,vector,
  // factories
  //maths on tuples
  add : function(a, b) {
    //FIXME: we may want to throw if adding two points
    return Tuples.tuple(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  },
  sub : function(a, b) {
    //FIXME: we may want to throw if subtracting a point a vector
    return Tuples.tuple(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  },

  negate : function(tuple) {
    return Tuples.tuple(-tuple.x, -tuple.y, -tuple.z, -tuple.w);
  },
  scale : function(tuple, scalar) {
    return Tuples.tuple(scalar * tuple.x, scalar * tuple.y, scalar * tuple.z, scalar * tuple.w);
  },
  divide : function(tuple, scalar) {
    return Tuples.tuple(tuple.x / scalar, tuple.y / scalar, tuple.z / scalar, tuple.w / scalar);
  },
  
  dot : function(a, b) {
    return a.x * b.x
         + a.y * b.y
         + a.z * b.z
         + a.w * b.w;
  },
  cross : function(a, b) {
    return Tuples.vector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x,
    );
  },

  magnitude : function(vector) {
    let {x, y, z, w} = vector;
    //FIXME: we may want to throw when taking the magnitude of a point
    return Math.sqrt(x*x + y*y + z*z + w*w);
  },
  normalize : function(vector) {
    //FIXME: we may want to throw normalizing a point
    return Tuples.divide(vector, Tuples.magnitude(vector));
  },
  
  // checks
  isPoint : function(tuple) {
    return tuple.w == 1.0;
  },
  isVector : function(tuple) {
    return tuple.w == 0.0;
  },
  equivalent : function(a, b) {
    return epsilonEquals(a.x, b.x) && epsilonEquals(a.y, b.y) && epsilonEquals(a.z, b.z) && epsilonEquals(a.w, b.w);
  }
}

export default Tuples;