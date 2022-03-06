import { make } from "./lib.js";
import Tuples, {point, vector} from "./tuples.js";

export function ray(origin, direction) {
  return make(PROTOTYPE, { origin, direction });
}

const PROTOTYPE = {
  origin : point(),
  direction : vector(),
  at : function(t){
    return Tuples.add(this.origin, Tuples.scale(this.direction, t));
  },
  transformed : function(matrix){
    return ray(matrix.transform(this.origin), matrix.transform(this.direction));
  }
}