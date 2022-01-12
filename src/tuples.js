
const EPSILON = 1e-5;
const Tuples = { 
  // factories
  makeTuple : function(x, y, z, w) {
    return { x, y, z, w };
  },
  makePoint : function(x, y, z) {
    return { x, y, z, w: 1.0 };
  },
  makeVector : function(x, y, z) {
    return { x, y, z, w: 0.0 };
  },

  //maths on tuples
  add : function(a, b) {
    //FIXME: we may want to throw if adding two points
    return Tuples.makeTuple(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
  },
  sub : function(a, b) {
    //FIXME: we may want to throw if subtracting a point a vector
    return Tuples.makeTuple(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
  },
  negate : function(tuple) {
    return Tuples.makeTuple(-tuple.x, -tuple.y, -tuple.z, -tuple.w);
  },
  scale : function(tuple, scalar) {
    return Tuples.makeTuple(scalar * tuple.x, scalar * tuple.y, scalar * tuple.z, scalar * tuple.w);
  },
  divide : function(tuple, scalar) {
    return Tuples.makeTuple(tuple.x / scalar, tuple.y / scalar, tuple.z / scalar, tuple.w / scalar);
  },
  
  dot : function(a, b) {
    return a.x * b.x
         + a.y * b.y
         + a.z * b.z
         + a.w * b.w;
  },
  cross : function(a, b) {
    return Tuples.makeVector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z ,
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
  epsilonEquals : function(a, b) {
    return Math.abs(a - b) < EPSILON;
  },
  tuplesEquivalent : function(a, b) {
    return Tuples.epsilonEquals(a.x, b.x) && Tuples.epsilonEquals(a.y, b.y) && Tuples.epsilonEquals(a.z, b.z) && Tuples.epsilonEquals(a.w, b.w);
  }
}
export default Tuples;