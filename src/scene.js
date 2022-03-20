import { createColor } from "./canvas.js";
import { intersect, make } from "./lib.js";
import { lighting } from "./lighting.js";
import { createRay } from "./rays.js";
import Tuples from "./tuples.js";

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
  isInShadow : function(point) {
    //TODO: update with multiple lights
    const light = this.lights[0];
    const toLight = Tuples.sub(light.position, point);
    const distanceToLight = Tuples.magnitude(toLight);
    const ray = createRay(point, Tuples.normalize(toLight));

    const xs = this.intersect(ray);
    for(const intersection of xs){
      const t = intersection.t;
      if(t >= 0 && t <= distanceToLight)
        return true;
    }
    return false;
  },
  shade : function(comps) {
    //TODO: use all lights
    const { object, point, eyev, normalv, overPoint} = comps;

    const ray = createRay(overPoint, normalv);

    let closest = Number.POSITIVE_INFINITY;
    if(this.tryAmbient){
      const xs = this.intersect(ray);
      for (const intersection of xs) {
        const t = intersection.t;
        if (t >= 0)
          closest = t;
      }
    }

    const threshold = 1.0;

    const ambientMultiplier = closest > threshold ? 1.0 : (closest / threshold);
    return lighting(object.material, this.lights[0], point, eyev, normalv, this.isInShadow(overPoint), ambientMultiplier * ambientMultiplier);
  },
  colorAt : function (ray) {
    const intersections = this.intersect(ray).filter( ({t}) => t >= 0);
    if(intersections.length <= 0)
      return createColor(0, 0, 0);
    return this.shade(ray.prepareComputations(intersections[0]));
  }
}
