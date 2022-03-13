import { make } from "./lib.js";
import Tuples, {createPoint, createVector} from "./tuples.js";

export function createRay(origin, direction) {
  return make(PROTOTYPE, { origin, direction });
}

const PROTOTYPE = {
  origin : createPoint(),
  direction : createVector(),
  at : function(t){
    return Tuples.add(this.origin, Tuples.scale(this.direction, t));
  },
  transformed : function(matrix){
    return createRay(matrix.transform(this.origin), matrix.transform(this.direction));
  },

  prepareComputations : function(intersection) {
    const { t, object } = intersection;

    const point = this.at(t);
    const eyev = Tuples.negate(this.direction);
    let normalv = object.normalAt(point);
    const inside = Tuples.dot(eyev, normalv) < 0;

    if(inside)
      normalv = Tuples.negate(normalv);

    return { t, point, eyev, normalv, inside, object };
  }
}