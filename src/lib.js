import Tuples, {createPoint} from "./tuples.js";

export function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
export const EPSILON = 1e-5;

export const PI = Math.PI;
export const π = Math.PI;
export const PI_OVER_2 = π / 2;
export const PI_OVER_4 = π / 4;

export const SQRT_2 = Math.sqrt(2);
export const SQRT_2_OVER_2 = SQRT_2 / 2;

export function epsilonEquals(a, b) {
  return Math.abs(a - b) < EPSILON;
}

export function make(prototype, properties){
  return Object.assign(Object.create(prototype), properties);
}

export function intersect(ray, prim){
  const localRay = ray.transformed(prim.inverseTransform);
  return prim.localIntersect(localRay);
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


