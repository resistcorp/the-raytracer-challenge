import Tuples, {point} from "./tuples.js";

export function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
const EPSILON = 1e-5;
export function epsilonEquals(a, b) {
  return Math.abs(a - b) < EPSILON;
}

export function make(prototype, properties){
  return Object.assign(Object.create(prototype), properties);
}

export function intersect(ray, prim){
  switch(prim.type){
    case "sphere" :
      return intersectSphere(ray, prim);
    default : throw(`unkown primitive type : ${prim} (${prim.type})`)
  }
}

export function intersection(t, object){
  return {t, object};
}

export function intersections(... intersects) {
  return intersects;
}

export function hit(intersections){
  let best;
  for(const x of intersections){
    if(x.t < 0) continue;
    if(!best || best.t > x.t)
      best = x;
  }
  return best;
}

function intersectSphere(originalRay, s){
  const ray = originalRay.transformed(s.inverseTransform);
  const sphToRay = Tuples.sub(ray.origin, point(0, 0, 0));

  //this is actually ray.direction's magnitude squared. Should really draw this one
  const a = Tuples.dot(ray.direction, ray.direction);
  const b = 2.0 * Tuples.dot(ray.direction, sphToRay);
  const c = Tuples.dot(sphToRay, sphToRay) -1.0;

  const discriminant = b*b - 4 * a * c;
  if(discriminant < 0)
    return [];
  
  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
  return intersections(intersection( t1, s ), intersection( t2, s ) );
}
