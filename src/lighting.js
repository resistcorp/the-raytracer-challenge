import Canvas, { createColor } from "./canvas.js";
import Tuples from "./tuples.js";

export function pointLight(position, intensity){
  return { position, intensity };
}
const DEFAULT_MATERIAL_VALUES = {
  color : createColor(1, 1, 1),
  ambient : 0.1,
  diffuse : 0.9,
  specular : 0.9,
  shininess : 200
};
export function material(params){
  const color = params?.color ?? DEFAULT_MATERIAL_VALUES.color;
  const ambient = params?.ambient ?? DEFAULT_MATERIAL_VALUES.ambient;
  const diffuse = params?.diffuse ?? DEFAULT_MATERIAL_VALUES.diffuse;
  const specular = params?.specular ?? DEFAULT_MATERIAL_VALUES.specular;
  const shininess = params?.shininess ?? DEFAULT_MATERIAL_VALUES.shininess;
  return { ambient, specular, shininess, color, diffuse };
}

const BLACK = createColor(0, 0, 0);

export function lighting(material, light, point, eyeVector, normalVector, isInShadow = false, ambientMultiplier = 1.0){
  const actualColor = Canvas.mult(material.color, light.intensity);
  if(material.debug)
    debugger;

  //direction of lightSource
  const lightVector = Tuples.normalize(Tuples.sub(light.position, point));
  //ambient contribution to the total color
  const ambient = Tuples.scale(actualColor, material.ambient);
  //a measure of how directly the light is falling on the surface
  const lightDotNormal = Tuples.dot(lightVector, normalVector);
  let diffuse = BLACK;
  let specular = BLACK;
  if(!isInShadow && lightDotNormal >= 0){ // TODO check for exactly zero
    //diffuse contrib
    diffuse = Tuples.scale(actualColor, lightDotNormal * material.diffuse);
    const reflection = Tuples.reflect(Tuples.negate(lightVector), normalVector);
    const reflectDotEye = Tuples.dot(reflection, eyeVector);
    if (reflectDotEye > 0){
      const factor = Math.pow(reflectDotEye, material.shininess);
      specular = Tuples.scale(light.intensity, material.specular * factor);
    }
  }
  let result = Tuples.add(Tuples.add(ambient, diffuse), specular); //TODO add a chained add operation
  const {x, y, z} = result;
  return createColor(x * ambientMultiplier, y * ambientMultiplier, z * ambientMultiplier);
}
