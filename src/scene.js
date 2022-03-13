import { createColor } from "./canvas.js";
import { intersect, make } from "./lib.js";
import { lighting } from "./lighting.js";

export function createWorld(){
  const lights = [];
  const objects = [];

  return make(WORLD_PROTO, {lights, objects});
}

const WORLD_PROTO = {
  addLight : function(light){
    this.lights.push(light);
  },
  addObject : function(prim){
    this.objects.push(prim);
  },
  intersect : function (ray) {
    return this.objects
        .map(prim => intersect(ray, prim))
        .flat()
        .sort((a, b) => a.t - b.t);
  },
  shade : function(comps) {
    //TODO: use all lights
    const { object, point, eyev, normalv} = comps;
    return lighting(object.material, this.lights[0], point, eyev, normalv);
  },
  colorAt : function (ray) {
    const intersections = this.intersect(ray).filter( ({t}) => t >= 0);
    if(intersections.length <= 0)
      return createColor(0, 0, 0);
    return this.shade(ray.prepareComputations(intersections[0]));
  }
}
